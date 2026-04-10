import express from "express";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const projectTypes = [
  "Documentary Film", "Charity Gala", "Fan Experience Tour",
  "Creative Album Project", "Youth Foundation", "Environmental Campaign",
  "Stadium Fan Event", "Art Installation", "Podcast Series", "Social Initiative",
];

const titleTemplates = [
  (n) => `${n} — Untold Story Documentary`,
  (n) => `${n} World Tour Fan Experience`,
  (n) => `${n} Foundation Launch`,
  (n) => `${n} Creative Vision Project`,
  (n) => `${n} Private Gala Access`,
  (n) => `${n} Social Impact Initiative`,
  (n) => `${n} Behind the Scenes Series`,
  (n) => `${n} Charity Stadium Event`,
];

const campaigns = celebrities.slice(0, 24).map((c, i) => ({
  id: `cf${i + 1}`,
  celebrityId: c.id,
  celebrityName: c.name,
  portrait: c.portrait,
  category: projectTypes[i % projectTypes.length],
  title: titleTemplates[i % titleTemplates.length](c.name),
  description: `An exclusive opportunity to co-fund ${c.name}'s next landmark project. Top-tier backers receive unprecedented access, recognition, and private moments money cannot ordinarily buy.`,
  goal: 50000 + (i * 27500) % 475000,
  raised: Math.round((50000 + (i * 27500) % 475000) * (0.12 + (i * 0.031) % 0.72)),
  backers: 40 + (i * 23) % 820,
  daysLeft: 3 + (i * 9) % 26,
  tiers: [
    {
      name: "Supporter",
      amount: 50,
      perks: ["Name in final credits", "Exclusive digital content pack", "Campaign progress updates"],
    },
    {
      name: "Patron",
      amount: 500,
      perks: ["All Supporter perks", "Signed collector item", "VIP livestream access", "Private Discord group"],
    },
    {
      name: "Sovereign Backer",
      amount: 5000,
      perks: ["All Patron perks", "Private meet & greet session", "Executive producer screen credit", "Front-row event access", "Personal thank-you message"],
    },
  ],
  pledges: [],
}));

router.get("/", (_req, res) => {
  const data = campaigns.map((c) => ({
    ...c,
    raised: c.raised + c.pledges.reduce((s, p) => s + p.amount, 0),
    backers: c.backers + c.pledges.length,
    percentFunded: Math.min(
      100,
      Math.round(((c.raised + c.pledges.reduce((s, p) => s + p.amount, 0)) / c.goal) * 100)
    ),
  }));
  res.json({ data, total: data.length });
});

router.get("/:id", (req, res) => {
  const c = campaigns.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "Campaign not found" });
  const totalRaised = c.raised + c.pledges.reduce((s, p) => s + p.amount, 0);
  res.json({
    ...c,
    raised: totalRaised,
    backers: c.backers + c.pledges.length,
    percentFunded: Math.min(100, Math.round((totalRaised / c.goal) * 100)),
  });
});

router.post("/:id/pledge", authenticate, (req, res) => {
  const c = campaigns.find((x) => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "Campaign not found" });
  const { tierName, amount } = req.body;
  const tier = c.tiers.find((t) => t.name === tierName) || c.tiers[0];
  const pledge = {
    id: `p${Date.now()}`,
    userId: req.user.id,
    userName: req.user.name,
    tierName: tier.name,
    amount: Number(amount) || tier.amount,
    timestamp: new Date().toISOString(),
  };
  c.pledges.push(pledge);
  db.auditLogs.push({
    timestamp: new Date().toISOString(),
    actor: req.user.email,
    action: `Pledged $${pledge.amount} to "${c.title}" — ${tier.name} tier`,
  });
  res.json({
    success: true,
    pledge,
    message: `Pledge confirmed — welcome to the ${tier.name} tier for ${c.celebrityName}'s project.`,
  });
});

export default router;
