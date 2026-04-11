import express from "express";
import { v4 as uuid } from "uuid";

const router = express.Router();

const inquiries = [];

// POST /api/inquiry  (public — no auth required)
router.post("/", (req, res) => {
  const { name, email, celebrity, eventType, date, message } = req.body || {};

  if (!name || !email || !celebrity || !message) {
    return res.status(400).json({ error: "name, email, celebrity, and message are required" });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const inquiry = {
    id: uuid(),
    name,
    email,
    celebrity,
    eventType: eventType || "General",
    date: date || null,
    message,
    submittedAt: new Date().toISOString(),
    status: "Received",
  };
  inquiries.push(inquiry);

  return res.status(201).json({
    message: `Thank you, ${name}. Your inquiry for ${celebrity} has been received. Our Concierge Desk will respond within 48 hours under full NDA.`,
    referenceId: inquiry.id.slice(0, 8).toUpperCase(),
  });
});

export default router;
