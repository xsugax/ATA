import express from "express";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";
import {
  APPROVAL_STAGE,
  bookingStages,
  closeAdminVerificationTask,
  createDisclosureWorkspace,
} from "./bookingWorkflow.js";

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
      verificationQueue: db.followUpTasks.filter((task) => task.status === "open").length,
      disclosureWorkspaces: db.disclosureWorkspaces.length,
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
    const followUpTask = db.followUpTasks.find((task) => task.bookingId === b.id && task.type === "admin_verification");
    const disclosureWorkspace = db.disclosureWorkspaces.find((workspace) => workspace.bookingId === b.id);
    return { ...b, userEmail: user?.email || "unknown", userName: user?.name || "Unknown", followUpTask, disclosureWorkspace };
  });
  return res.json({ data: enriched.reverse(), total: enriched.length });
});

router.patch("/bookings/:id/status", (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  const { stage } = req.body;
  if (!bookingStages.includes(stage)) return res.status(400).json({ error: "Invalid stage" });

  if (stage === APPROVAL_STAGE && booking.verificationRequired && !booking.verifiedAt) {
    return res.status(409).json({ error: "Admin verification must be completed before approval." });
  }

  if (stage === "Admin Verified - Terms Review" && !booking.verifiedAt) {
    booking.verifiedAt = new Date().toISOString();
    booking.verifiedBy = req.user.email;
    booking.verificationRequired = false;
    booking.approvalLockedReason = null;
    closeAdminVerificationTask(db, booking.id, req.user.email);
  }

  booking.status = stage;
  booking.statusHistory.push({ stage, at: new Date().toISOString() });
  let disclosureWorkspace = null;
  if (stage === APPROVAL_STAGE) {
    disclosureWorkspace = createDisclosureWorkspace(db, booking, req.user.email);
  }
  db.auditLogs.push({
    id: uuid(), actor: req.user.email, action: stage === APPROVAL_STAGE ? "DISCLOSURE_WORKSPACE_CREATED" : "ADMIN_BOOKING_STATUS_UPDATED",
    referenceId: booking.id, timestamp: new Date().toISOString(),
  });
  emitAdminEvent(stage === APPROVAL_STAGE ? "DISCLOSURE_WORKSPACE_CREATED" : "BOOKING_STATUS_UPDATED", {
    bookingId: booking.id,
    stage,
    workspaceId: disclosureWorkspace?.id,
    by: req.user.email,
  });
  return res.json({ booking, disclosureWorkspace });
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
      if (!bookingStages.includes(stage)) continue;
      if (stage === APPROVAL_STAGE && b.verificationRequired && !b.verifiedAt) continue;
      if (stage === "Admin Verified - Terms Review" && !b.verifiedAt) {
        b.verifiedAt = new Date().toISOString();
        b.verifiedBy = req.user.email;
        b.verificationRequired = false;
        b.approvalLockedReason = null;
        closeAdminVerificationTask(db, b.id, req.user.email);
      }
      b.status = stage;
      b.statusHistory.push({ stage, at: new Date().toISOString() });
      if (stage === APPROVAL_STAGE) createDisclosureWorkspace(db, b, req.user.email);
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

// ── Celebrity FULL CRUD (God Mode) ────────────────────────────────────────────
router.post("/celebrities", (req, res) => {
  const { name, category, region, startingPrice, netWorth, socialReachMillions, agencyRepresentation, eliteSignal, portrait, reservationWindows, meetingNotes, availability } = req.body;
  if (!name?.trim() || !category || !region || !startingPrice || !eliteSignal?.trim()) {
    return res.status(400).json({ error: "name, category, region, startingPrice, eliteSignal are required" });
  }
  const id = `cadmin-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const price = Number(startingPrice);
  const avail = availability || (price >= 1500000 ? "Waitlist" : price >= 600000 ? "Limited" : "Open");
  const reach = Number(socialReachMillions) || 0;
  const celeb = {
    id, name: name.trim(), verified: true, category, region,
    portrait: portrait || `https://i.pravatar.cc/300?u=${encodeURIComponent(name)}`,
    eliteSignal: eliteSignal.trim(),
    bookingTiers: [
      { type: "Private Event",      multiplier: 1.0,  startPrice: price },
      { type: "Corporate Keynote",  multiplier: 1.25, startPrice: Math.round(price*1.25) },
      { type: "Brand Endorsement",  multiplier: 1.70, startPrice: Math.round(price*1.70) },
      { type: "Virtual Appearance", multiplier: 0.65, startPrice: Math.round(price*0.65) },
    ],
    startingPrice: price, bookingPrice: price,
    dynamicPriceRange: { min: Math.round(price*0.9), max: Math.round(price*1.4) },
    averageEventRate: Math.round(price*1.15),
    demandIndex: 75, popularityScore: 75,
    netWorth: netWorth || "$10M", netWorthTier: "$10M",
    availability: avail,
    availabilityWindowDays: avail === "Waitlist" ? 90 : avail === "Limited" ? 45 : 21,
    socialReachMillions: reach, socialReach: `${reach}M`,
    agencyRepresentation: agencyRepresentation || "Independent",
    agency: agencyRepresentation || "Independent",
    partnerships: [], awards: [],
    riskIndex: "medium", ndaDefault: true,
    securityTiers: ["Standard","Enhanced","Executive","Sovereign"],
    recentBrandAlignment: "",
    eventCompatibility: ["Summit","Gala","Launch","Private Dinner","Festival"],
    preferredHotels: [],
    reservationWindows: reservationWindows || [],
    meetingNotes: meetingNotes || "",
    adminCreated: true,
    brandValue: null,
  };
  celebrities.push(celeb);
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "CELEBRITY_ADDED", referenceId: id, detail: `${name} added to roster`, timestamp: new Date().toISOString() });
  emitAdminEvent("CELEBRITY_ADDED", { id, name, category });
  return res.status(201).json({ celebrity: celeb });
});

router.put("/celebrities/:id", (req, res) => {
  const celeb = celebrities.find(c => c.id === req.params.id);
  if (!celeb) return res.status(404).json({ error: "Celebrity not found" });
  const { name, category, region, startingPrice, netWorth, socialReachMillions, agencyRepresentation, eliteSignal, portrait, reservationWindows, meetingNotes, availability, demandIndex, availabilityWindowDays } = req.body;
  if (name) celeb.name = name.trim();
  if (category) celeb.category = category;
  if (region) celeb.region = region;
  if (portrait) celeb.portrait = portrait;
  if (eliteSignal) celeb.eliteSignal = eliteSignal.trim();
  if (netWorth) celeb.netWorth = netWorth;
  if (agencyRepresentation) { celeb.agencyRepresentation = agencyRepresentation; celeb.agency = agencyRepresentation; }
  if (socialReachMillions !== undefined) { const r = Number(socialReachMillions); celeb.socialReachMillions = r; celeb.socialReach = `${r}M`; }
  if (reservationWindows) celeb.reservationWindows = reservationWindows;
  if (meetingNotes !== undefined) celeb.meetingNotes = meetingNotes;
  if (demandIndex) celeb.demandIndex = Number(demandIndex);
  if (availabilityWindowDays) celeb.availabilityWindowDays = Number(availabilityWindowDays);
  if (availability) celeb.availability = availability;
  if (startingPrice) {
    const price = Number(startingPrice);
    celeb.startingPrice = price; celeb.bookingPrice = price;
    celeb.dynamicPriceRange = { min: Math.round(price*0.9), max: Math.round(price*1.4) };
    celeb.averageEventRate = Math.round(price*1.15);
    celeb.bookingTiers = [
      { type: "Private Event",      multiplier: 1.0,  startPrice: price },
      { type: "Corporate Keynote",  multiplier: 1.25, startPrice: Math.round(price*1.25) },
      { type: "Brand Endorsement",  multiplier: 1.70, startPrice: Math.round(price*1.70) },
      { type: "Virtual Appearance", multiplier: 0.65, startPrice: Math.round(price*0.65) },
    ];
    if (!availability) celeb.availability = price >= 1500000 ? "Waitlist" : price >= 600000 ? "Limited" : "Open";
  }
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "CELEBRITY_UPDATED", referenceId: celeb.id, detail: `${celeb.name} profile updated`, timestamp: new Date().toISOString() });
  emitAdminEvent("CELEBRITY_UPDATED", { id: celeb.id, name: celeb.name });
  return res.json({ celebrity: celeb });
});

router.delete("/celebrities/:id", (req, res) => {
  const idx = celebrities.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Celebrity not found" });
  const [removed] = celebrities.splice(idx, 1);
  db.auditLogs.push({ id: uuid(), actor: req.user.email, action: "CELEBRITY_REMOVED", referenceId: removed.id, detail: `${removed.name} removed from roster`, timestamp: new Date().toISOString() });
  emitAdminEvent("CELEBRITY_REMOVED", { id: removed.id, name: removed.name });
  return res.json({ ok: true, removed: removed.name });
});

export default router;
