import express from "express";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";

const router = express.Router();

// ── SSE: real-time event stream for admin panel ───────────────────────────────
const sseClients = new Set();

export function emitAdminEvent(type, payload) {
  const data = JSON.stringify({ type, payload, at: new Date().toISOString() });
  for (const res of sseClients) {
    try { res.write(`data: ${data}\n\n`); } catch (_) { sseClients.delete(res); }
  }
}

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", at: new Date().toISOString() })}\n\n`);
  sseClients.add(res);
  const heartbeat = setInterval(() => { try { res.write(": ping\n\n"); } catch (_) { clearInterval(heartbeat); } }, 20000);
  req.on("close", () => { sseClients.delete(res); clearInterval(heartbeat); });
});

router.get("/dashboard", (_req, res) => {
  const revenueSeries = Array.from({ length: 8 }, (_, i) => ({
    month: `M${i + 1}`,
    revenue: 6500000 + i * 2100000,
  }));

  const distribution = ["Film", "Music", "Sports", "Fashion", "Business", "Influencer"].map((name, i) => ({
    category: name,
    count: 10 + i * 6,
  }));

  const requested = celebrities.slice(0, 8).map((entry, i) => ({
    name: entry.name,
    requests: 90 - i * 7,
  }));

  const regional = ["North America", "Europe", "Middle East", "Asia", "Latin America", "Africa"].map((name, i) => ({
    region: name,
    intensity: 40 + i * 8,
  }));

  return res.json({
    kpis: {
      revenueYTD: 148200000,
      activeBookings: db.bookings.length,
      avgEscrowPercent: 30,
      suspendedUsers: 2,
    },
    charts: { revenueSeries, distribution, requested, regional },
    auditLogs: db.auditLogs.slice(-25).reverse(),
  });
});

router.patch("/celebrities/:id", (req, res) => {
  const celeb = celebrities.find((entry) => entry.id === req.params.id);
  if (!celeb) {
    return res.status(404).json({ error: "Celebrity not found" });
  }

  const { startingPrice, demandIndex, availabilityWindowDays } = req.body;
  if (startingPrice) {
    celeb.startingPrice = Number(startingPrice);
  }
  if (demandIndex) {
    celeb.demandIndex = Number(demandIndex);
  }
  if (availabilityWindowDays) {
    celeb.availabilityWindowDays = Number(availabilityWindowDays);
  }

  db.auditLogs.push({
    id: uuid(),
    actor: req.user.email,
    action: "CELEBRITY_PROFILE_UPDATED",
    referenceId: celeb.id,
    timestamp: new Date().toISOString(),
  });

  return res.json({ celebrity: celeb });
});

router.post("/users/:id/suspend", (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (user) user.suspended = true;
  db.auditLogs.push({
    id: uuid(), actor: req.user.email, action: "USER_SUSPENDED",
    referenceId: req.params.id, timestamp: new Date().toISOString(),
  });
  emitAdminEvent("USER_SUSPENDED", { userId: req.params.id, by: req.user.email });
  return res.json({ ok: true });
});

router.post("/users/:id/unsuspend", (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (user) user.suspended = false;
  db.auditLogs.push({
    id: uuid(), actor: req.user.email, action: "USER_UNSUSPENDED",
    referenceId: req.params.id, timestamp: new Date().toISOString(),
  });
  emitAdminEvent("USER_UNSUSPENDED", { userId: req.params.id, by: req.user.email });
  return res.json({ ok: true });
});

// ── All bookings (God view) ──────────────────────────────────────────────────
router.get("/bookings", (_req, res) => {
  const enriched = db.bookings.map((b) => {
    const user = db.users.find((u) => u.id === b.userId);
    return { ...b, userEmail: user?.email || "unknown", userName: user?.name || "Unknown" };
  });
  return res.json({ data: enriched.reverse(), total: enriched.length });
});

const bookingStages = [
  "Inquiry Received", "Under Representation Review", "Terms Negotiation",
  "Contract Finalized", "Escrow Secured", "Confirmed",
];

router.patch("/bookings/:id/status", (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  const { stage } = req.body;
  if (!bookingStages.includes(stage)) return res.status(400).json({ error: "Invalid stage" });
  booking.status = stage;
  booking.statusHistory.push({ stage, at: new Date().toISOString() });
  db.auditLogs.push({
    id: uuid(), actor: req.user.email, action: "ADMIN_BOOKING_STATUS_UPDATED",
    referenceId: booking.id, timestamp: new Date().toISOString(),
  });
  emitAdminEvent("BOOKING_STATUS_UPDATED", { bookingId: booking.id, stage, by: req.user.email });
  return res.json({ booking });
});

router.delete("/bookings/:id", (req, res) => {
  const idx = db.bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Booking not found" });
  const [removed] = db.bookings.splice(idx, 1);
  db.auditLogs.push({
    id: uuid(), actor: req.user.email, action: "ADMIN_BOOKING_CANCELLED",
    referenceId: removed.id, timestamp: new Date().toISOString(),
  });
  emitAdminEvent("BOOKING_CANCELLED", { bookingId: removed.id, celebrity: removed.celebrityName, by: req.user.email });
  return res.json({ ok: true });
});

// ── All users ────────────────────────────────────────────────────────────────
router.get("/users", (_req, res) => {
  const safe = db.users.map(({ passwordHash: _ph, ...u }) => u);
  return res.json({ data: safe, total: safe.length });
});

// ── All celebrities (paginated) ──────────────────────────────────────────────
router.get("/celebrities", (_req, res) => {
  const page = Number(_req.query.page || 1);
  const limit = Number(_req.query.limit || 20);
  const slice = celebrities.slice((page - 1) * limit, page * limit);
  return res.json({ data: slice, total: celebrities.length, page, limit });
});

// ── Flip celebrity availability ──────────────────────────────────────────────
router.patch("/celebrities/:id/availability", (req, res) => {
  const celeb = celebrities.find((c) => c.id === req.params.id);
  if (!celeb) return res.status(404).json({ error: "Not found" });
  const cycle = ["Open", "Limited", "Waitlist"];
  celeb.availability = cycle[(cycle.indexOf(celeb.availability) + 1) % cycle.length];
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "CELEBRITY_AVAILABILITY_CHANGED", referenceId: celeb.id, timestamp: new Date().toISOString() });
  emitAdminEvent("CELEBRITY_AVAILABILITY_CHANGED", { id: celeb.id, name: celeb.name, availability: celeb.availability });
  return res.json({ celebrity: celeb });
});

// ── Bulk booking operations ──────────────────────────────────────────────────
router.post("/bookings/bulk", (req, res) => {
  const { ids, action, stage } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: "No ids provided" });
  let affected = 0;
  for (const id of ids) {
    const b = db.bookings.find((x) => x.id === id);
    if (!b) continue;
    if (action === "advance" && stage) {
      b.status = stage;
      b.statusHistory.push({ stage, at: new Date().toISOString() });
    } else if (action === "cancel") {
      db.bookings.splice(db.bookings.indexOf(b), 1);
    }
    db.auditLogs.push({ id: uuid(), actor: req.user.email, action: `BULK_${action.toUpperCase()}`, referenceId: id, timestamp: new Date().toISOString() });
    affected++;
  }
  emitAdminEvent("BULK_ACTION", { action, affected, by: req.user.email });
  return res.json({ ok: true, affected });
});

// ── Broadcast system message to all users ───────────────────────────────────
router.post("/broadcast", (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Message required" });
  for (const user of db.users) {
    db.messages.push({ id: uuid(), from: "Command Center", toUserId: user.id, body: message.trim(), timestamp: new Date().toISOString() });
  }
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "BROADCAST_SENT", referenceId: "ALL_USERS", timestamp: new Date().toISOString() });
  emitAdminEvent("BROADCAST", { message: message.trim(), by: req.user.email });
  return res.json({ ok: true, recipients: db.users.length });
});

// ── Session counter ──────────────────────────────────────────────────────────
router.get("/sessions", (_req, res) => {
  return res.json({ adminSessions: sseClients.size });
});

// ── Impersonate: issue a short-lived token as any non-admin user ─────────────
import jwt from "jsonwebtoken";
import { config } from "../config.js";
router.post("/impersonate/:id", (req, res) => {
  const target = db.users.find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: "User not found" });
  if (target.role === "admin") return res.status(403).json({ error: "Cannot impersonate admin" });
  const token = jwt.sign({ sub: target.id, role: target.role, impersonated: true }, config.jwtSecret, { expiresIn: "30m" });
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "USER_IMPERSONATED", referenceId: target.id, timestamp: new Date().toISOString() });
  emitAdminEvent("USER_IMPERSONATED", { targetEmail: target.email, targetRole: target.role, by: req.user.email });
  return res.json({ token, user: { id: target.id, name: target.name, email: target.email, role: target.role } });
});

// ── Full audit log ───────────────────────────────────────────────────────────
router.get("/audit", (_req, res) => {
  return res.json({ data: [...db.auditLogs].reverse(), total: db.auditLogs.length });
});

export default router;
