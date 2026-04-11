import express from "express";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";

const router = express.Router();

const reservations = [];

// POST /api/waitlist/reserve  (requires auth — mounted under authenticate)
router.post("/reserve", (req, res) => {
  const { celebrityId } = req.body || {};
  if (!celebrityId) return res.status(400).json({ error: "celebrityId is required" });

  const cel = celebrities.find((c) => c.id === celebrityId);
  if (!cel) return res.status(404).json({ error: "Celebrity not found" });

  // Prevent duplicate active reservations per user
  const existing = reservations.find(
    (r) => r.userId === req.user.id && r.celebrityId === celebrityId && new Date(r.expiresAt) > new Date()
  );
  if (existing) {
    return res.json({
      reservationCode: existing.reservationCode,
      expiresAt: existing.expiresAt,
      message: `You already hold a waitlist reservation for ${cel.name}.`,
      terms: "Reservation is non-transferable. Priority slot subject to representative confirmation.",
    });
  }

  const reservationCode = `WL-${uuid().slice(0, 6).toUpperCase()}-${cel.name.slice(0, 3).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours

  const record = {
    id: uuid(),
    reservationCode,
    userId: req.user.id,
    celebrityId,
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  reservations.push(record);

  return res.status(201).json({
    reservationCode,
    expiresAt,
    message: `Waitlist slot secured for ${cel.name}. Our representative will contact you within 48 hours to confirm priority status.`,
    terms: "Reservation is non-transferable. Priority slot subject to representative confirmation.",
  });
});

export default router;
