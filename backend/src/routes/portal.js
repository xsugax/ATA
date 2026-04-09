import express from "express";
import { db } from "../data/store.js";

const router = express.Router();

router.get("/overview", (req, res) => {
  const bookings = db.bookings.filter((entry) => entry.userId === req.user.id);
  const contracts = db.contracts.filter((entry) => bookings.some((booking) => booking.id === entry.bookingId));
  const payments = db.payments.filter((entry) => bookings.some((booking) => booking.id === entry.bookingId));
  const messages = db.messages.filter((entry) => entry.toUserId === req.user.id);

  return res.json({
    membershipTier: db.users.find((entry) => entry.id === req.user.id)?.membershipTier,
    bookings,
    contracts,
    payments,
    messages,
    concierge: {
      assistantName: "AURELIA",
      suggestion: "Based on your profile, Monaco Grand Prix week has high strategic alignment for luxury brand activations.",
    },
    vipUpgradeOptions: ["Sovereign Circle", "Founders Office", "Dynasty Tier"],
  });
});

export default router;
