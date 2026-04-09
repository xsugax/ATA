import express from "express";
import { applyCelebrityFilters, celebrities } from "../data/celebrities.js";

const router = express.Router();

router.get("/", (req, res) => {
  const filtered = applyCelebrityFilters(celebrities, req.query || {});
  return res.json({ total: filtered.length, data: filtered });
});

router.get("/featured", (_req, res) => {
  return res.json({
    data: celebrities.slice(0, 6),
    metrics: {
      totalGlobalBookings: 3241,
      managedPortfolioValue: 980000000,
      activeNegotiations: 128,
      verifiedCelebrities: celebrities.length,
    },
  });
});

router.get("/:id/availability", (req, res) => {
  const celebrity = celebrities.find((entry) => entry.id === req.params.id);
  if (!celebrity) {
    return res.status(404).json({ error: "Celebrity not found" });
  }

  const dateInput = req.query?.date;
  if (!dateInput) {
    return res.status(400).json({ error: "Date query is required" });
  }

  const targetDate = new Date(String(dateInput));
  if (Number.isNaN(targetDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const now = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const withinWindow = diffDays >= 0 && diffDays <= celebrity.availabilityWindowDays;
  const openStatus = celebrity.availability !== "Waitlist";
  const available = withinWindow && openStatus;

  return res.json({
    celebrityId: celebrity.id,
    celebrityName: celebrity.name,
    date: targetDate.toISOString().split("T")[0],
    available,
    reason: available
      ? "Date is available for sovereign inquiry."
      : "Date is outside booking window or currently waitlisted.",
    availabilityWindowDays: celebrity.availabilityWindowDays,
    baseStatus: celebrity.availability,
  });
});

router.get("/:id", (req, res) => {
  const celebrity = celebrities.find((entry) => entry.id === req.params.id);
  if (!celebrity) {
    return res.status(404).json({ error: "Celebrity not found" });
  }
  return res.json(celebrity);
});

export default router;
