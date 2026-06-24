import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";
import { config } from "../config.js";
import { emitAdminEvent } from "./admin.js";
import { bookingStages, createAdminFollowUpTask } from "./bookingWorkflow.js";

const router = express.Router();

const bookingSchema = z.object({
  celebrityId: z.string(),
  eventType: z.string(),
  date: z.string(),
  location: z.string(),
  ndaRequired: z.boolean(),
  securityLevel: z.string(),
  riderRequirements: z.string(),
  pricingAdjustmentPercent: z.number().min(-15).max(50),
  paymentMethod: z.enum(["wire", "escrow", "crypto"]).default("wire"),
  cryptoCurrency: z.string().optional(),
});

const calculatePricing = (basePrice, adjustmentPercent) => {
  const finalQuote = Math.round(basePrice * (1 + adjustmentPercent / 100));
  const escrow = Math.round((finalQuote * config.escrowDefault) / 100);
  return { finalQuote, escrow, escrowPercent: config.escrowDefault };
};

router.post("/quote", (req, res) => {
  const payload = req.body;
  const celebrity = celebrities.find((entry) => entry.id === payload.celebrityId);
  if (!celebrity) {
    return res.status(404).json({ error: "Celebrity not found" });
  }

  const adjustmentPercent = Number(payload.pricingAdjustmentPercent || 0);
  const quote = calculatePricing(celebrity.startingPrice, adjustmentPercent);
  return res.json({ quote, celebrity });
});

router.post("/initiate", (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking payload" });
  }

  const payload = parsed.data;
  const celebrity = celebrities.find((entry) => entry.id === payload.celebrityId);
  if (!celebrity) {
    return res.status(404).json({ error: "Celebrity not found" });
  }

  const pricing = calculatePricing(celebrity.startingPrice, payload.pricingAdjustmentPercent);
  const booking = {
    id: uuid(),
    userId: req.user.id,
    celebrityId: celebrity.id,
    celebrityName: celebrity.name,
    eventType: payload.eventType,
    date: payload.date,
    location: payload.location,
    ndaRequired: payload.ndaRequired,
    securityLevel: payload.securityLevel,
    riderRequirements: payload.riderRequirements,
    status: bookingStages[0],
    statusHistory: [{ stage: bookingStages[0], at: new Date().toISOString() }],
    verificationRequired: true,
    verifiedAt: null,
    verifiedBy: null,
    approvalLockedReason: "Admin verification required before approval.",
    assignedAdminId: "u3",
    paymentMethod: payload.paymentMethod,
    cryptoCurrency: payload.paymentMethod === "crypto" ? payload.cryptoCurrency || "BTC" : null,
    pricing,
    createdAt: new Date().toISOString(),
    contractId: `CTR-${Math.floor(Math.random() * 900000 + 100000)}`,
  };

  db.bookings.push(booking);
  const followUpTask = createAdminFollowUpTask(db, booking);
  db.contracts.push({
    id: booking.contractId,
    bookingId: booking.id,
    title: `${celebrity.name} Sovereign Engagement Contract`,
    signed: false,
    pdfUrl: `/contracts/${booking.contractId}.pdf`,
  });
  db.payments.push({
    id: uuid(),
    bookingId: booking.id,
    amount: pricing.escrow,
    currency: "USD",
    status: "Pending Escrow",
    method: payload.paymentMethod,
    cryptoCurrency: booking.cryptoCurrency,
  });
  db.auditLogs.push({
    id: uuid(),
    actor: req.user.email,
    action: "BOOKING_INITIATED",
    referenceId: booking.id,
    timestamp: new Date().toISOString(),
  });

  emitAdminEvent("NEW_BOOKING", {
    bookingId: booking.id,
    celebrity: celebrity.name,
    client: req.user.email,
    eventType: payload.eventType,
    quote: pricing.finalQuote,
    date: payload.date,
    followUpTaskId: followUpTask.id,
    status: booking.status,
  });

  return res.status(201).json({ booking, bookingStages, followUpTask });
});

router.get("/mine", (req, res) => {
  const mine = db.bookings.filter((entry) => entry.userId === req.user.id);
  return res.json({ data: mine, total: mine.length });
});

router.patch("/:id/status", (req, res) => {
  const booking = db.bookings.find((entry) => entry.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const nextStage = req.body?.stage;
  if (!bookingStages.includes(nextStage)) {
    return res.status(400).json({ error: "Invalid stage" });
  }

  booking.status = nextStage;
  booking.statusHistory.push({ stage: nextStage, at: new Date().toISOString() });

  db.auditLogs.push({
    id: uuid(),
    actor: req.user.email,
    action: "BOOKING_STATUS_UPDATED",
    referenceId: booking.id,
    timestamp: new Date().toISOString(),
  });

  emitAdminEvent("BOOKING_STATUS_UPDATED", { bookingId: booking.id, stage: nextStage });

  return res.json({ booking });
});

export default router;
