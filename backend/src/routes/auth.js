import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../data/store.js";
import { config } from "../config.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid credentials payload" });
  }

  const { email, password } = parsed.data;
  const user = db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: "8h" });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      membershipTier: user.membershipTier,
    },
  });
});

router.get("/seed-users", (_req, res) => {
  return res.json({
    users: db.users.map((entry) => ({ email: entry.email, role: entry.role })),
    passwordHint: "Client@123 | Manager@123 | Admin@123",
  });
});

router.get("/me", authenticate, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
