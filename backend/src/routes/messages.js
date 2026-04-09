import express from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";

const router = express.Router();

const messageSchema = z.object({
  celebrityId: z.string(),
  body: z.string().min(10).max(500),
  priority: z.enum(["Standard", "Priority", "Urgent"]).default("Priority"),
});

router.post("/send", (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid message payload" });
  }

  const payload = parsed.data;
  const celebrity = celebrities.find((entry) => entry.id === payload.celebrityId);
  if (!celebrity) {
    return res.status(404).json({ error: "Celebrity not found" });
  }

  const manager = db.users.find((entry) => entry.role === "manager") || db.users[0];
  const outbound = {
    id: uuid(),
    from: req.user.name,
    toUserId: manager.id,
    body: `[${payload.priority}] Inquiry for ${celebrity.name}: ${payload.body}`,
    timestamp: new Date().toISOString(),
  };

  const acknowledgement = {
    id: uuid(),
    from: "Representation Desk",
    toUserId: req.user.id,
    body: `Message received for ${celebrity.name}. A representative will respond within 90 minutes.`,
    timestamp: new Date().toISOString(),
  };

  db.messages.push(outbound, acknowledgement);
  db.auditLogs.push({
    id: uuid(),
    actor: req.user.email,
    action: "MESSAGE_SENT_TO_REPRESENTATION",
    referenceId: celebrity.id,
    timestamp: new Date().toISOString(),
  });

  return res.status(201).json({
    ok: true,
    acknowledgement,
  });
});

export default router;
