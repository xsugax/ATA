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

router.get("/standing", (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  const bookings = db.bookings.filter((b) => b.userId === req.user.id);
  const messages = db.messages.filter((m) => m.toUserId === req.user.id || m.fromUserId === req.user.id);

  const bookingContribution = Math.min(40, bookings.length * 8);
  const messageContribution = Math.min(15, messages.length * 3);
  const roleBonus = user?.role === "admin" ? 20 : user?.role === "manager" ? 12 : 5;
  const score = Math.min(99, 42 + bookingContribution + messageContribution + roleBonus);

  let tier = "Observer";
  let nextTier = "Black Card";
  let nextTierThreshold = 55;
  if (score >= 90) { tier = "Sovereign"; nextTier = null; nextTierThreshold = 99; }
  else if (score >= 75) { tier = "Founders Circle"; nextTier = "Sovereign"; nextTierThreshold = 90; }
  else if (score >= 60) { tier = "Black Card"; nextTier = "Founders Circle"; nextTierThreshold = 75; }
  else if (score >= 55) { tier = "Black Card"; nextTier = "Founders Circle"; nextTierThreshold = 75; }

  const privilegeMap = {
    "Observer":        ["Read-only roster access", "Standard inquiry form", "Public event access"],
    "Black Card":      ["Priority inquiry queue", "Dedicated representative", "Exclusive pricing access", "Private event invitations"],
    "Founders Circle": ["Same-day response SLA", "Direct representative line", "First-look availability", "Sovereign contract pathway", "Priority waitlist positioning"],
    "Sovereign":       ["24/7 concierge hotline", "Guaranteed slot reservation", "Bespoke engagement design", "Maximum tier: all privileges active", "NDA-protected negotiation channel"],
  };

  return res.json({
    score,
    tier,
    nextTier,
    nextTierThreshold,
    privileges: privilegeMap[tier] || privilegeMap["Observer"],
    breakdown: { bookingContribution, messageContribution, roleBonus },
  });
});

export default router;
