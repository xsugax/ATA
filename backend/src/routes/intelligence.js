import express from "express";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";

const router = express.Router();

// GET /api/intelligence/ticker
router.get("/ticker", (_req, res) => {
  const sample = celebrities.slice(0, 12);
  const events = sample.map((c) => {
    const change = ((c.demandIndex - 70) / 70 * 100).toFixed(1);
    const positive = c.demandIndex >= 70;
    const labels = ["Confirmed Available", "Inquiry Surge", "New Booking Window", "Waitlist Opened", "Exclusive Access"];
    const event = labels[Math.abs(c.id.charCodeAt(1) ?? 0) % labels.length];
    return { name: c.name, event, change: `${positive ? "+" : ""}${change}%`, positive };
  });
  return res.json({ events });
});

// GET /api/intelligence/market-pulse
router.get("/market-pulse", (_req, res) => {
  const demandHeat = Math.round(celebrities.reduce((s, c) => s + c.demandIndex, 0) / celebrities.length);
  const averageEntryQuote = Math.round(celebrities.reduce((s, c) => s + c.bookingPrice, 0) / celebrities.length);
  const topWaitlistPressure = celebrities.filter((c) => c.availability === "Waitlist").length;
  const top = celebrities
    .slice()
    .sort((a, b) => b.demandIndex - a.demandIndex)
    .slice(0, 5)
    .map((c) => ({ name: c.name, demandIndex: c.demandIndex }));
  return res.json({ metrics: { demandHeat, averageEntryQuote, topWaitlistPressure }, top });
});

// POST /api/intelligence/blueprint
router.post("/blueprint", (req, res) => {
  const { celebrityId, objective, audienceType, region, budget, timelineDays } = req.body || {};
  const cel = celebrities.find((c) => c.id === celebrityId);
  const blueprintId = `BLU-${uuid().slice(0, 8).toUpperCase()}`;

  const fitScore = cel ? Math.min(99, Math.round((cel.demandIndex * 0.6) + (budget ? Math.min(30, budget / cel.bookingPrice * 30) : 15))) : 62;
  const pressureScore = cel ? cel.demandIndex : 71;
  const budgetAlignment = budget && cel ? Math.min(99, Math.round((budget / cel.bookingPrice) * 85)) : 74;
  const exclusivityIndex = cel ? Math.min(99, Math.round(cel.demandIndex * 0.85 + 10)) : 78;

  const recommendations = [
    `Secure a minimum 60-day advance window to guarantee ${cel?.name ?? "this talent"}'s schedule slot.`,
    `Align your ${audienceType ?? "target audience"} activation with a ${region ?? "regional"} keynote or VIP reception format.`,
    `Budget allocation of ${budget ? `$${Number(budget).toLocaleString()}` : "confirmed budget"} is ${budgetAlignment > 80 ? "strongly aligned" : "within negotiable range"} for this engagement tier.`,
    `Execute via sovereign contract pathway within ${timelineDays ?? 30} days to lock exclusivity window.`,
  ];

  const executionPlan = [
    "Submit sovereign inquiry with full brief and NDA",
    "Representative qualification call within 48 hours",
    "Commercial term sheet issued within 5 business days",
    "Escrow confirmation and contract finalization",
    "Engagement logistics and concierge coordination",
    "Confirmed engagement on event date",
  ];

  return res.json({
    blueprintId,
    strategy: { recommendation: recommendations.join(" ") },
    scores: { fitScore, pressureScore, budgetAlignment, exclusivityIndex },
    executionPlan,
  });
});

// GET /api/intelligence/pressure/:id
router.get("/pressure/:id", (req, res) => {
  const cel = celebrities.find((c) => c.id === req.params.id);
  if (!cel) return res.status(404).json({ error: "Celebrity not found" });

  let heatLevel = "normal";
  if (cel.availability === "Waitlist" || cel.demandIndex >= 92) heatLevel = "critical";
  else if (cel.demandIndex >= 80) heatLevel = "elevated";

  const messages = {
    normal: `${cel.name} has open availability. Inquiry now to secure preferred dates.`,
    elevated: `Demand for ${cel.name} is elevated. ${cel.availability === "Limited" ? "Limited slots remain." : "Act promptly."}`,
    critical: `${cel.name} is fully waitlisted. Join waitlist to be notified of openings.`,
  };

  const lastInquiryMinutesAgo = Math.floor(Math.random() * 59) + 1;

  return res.json({ heatLevel, urgencyMessage: messages[heatLevel], lastInquiryMinutesAgo });
});

// POST /api/intelligence/compare
router.post("/compare", (req, res) => {
  const { celebrityIds } = req.body || {};
  if (!Array.isArray(celebrityIds) || !celebrityIds.length) {
    return res.status(400).json({ error: "celebrityIds array is required" });
  }

  const found = celebrityIds
    .map((id) => celebrities.find((c) => c.id === id))
    .filter(Boolean);

  if (!found.length) return res.status(404).json({ error: "No matching celebrities found" });

  const scored = found.map((c) => ({
    id: c.id,
    name: c.name,
    valueScore: Math.round((c.demandIndex * 0.5) + (Math.min(c.bookingPrice, 3000000) / 30000) + (c.socialReach?.includes("B") ? 15 : 5)),
  })).sort((a, b) => b.valueScore - a.valueScore);

  const winner = scored[0];
  const rationale = `${winner.name} leads on composite value scoring (demand index + booking premium + social authority). ${scored.length > 1 ? `Ranked above ${scored.slice(1).map((s) => s.name).join(", ")}.` : ""}`;

  return res.json({
    recommendation: { winner: { name: winner.name }, rationale },
    compared: scored,
  });
});

export default router;
