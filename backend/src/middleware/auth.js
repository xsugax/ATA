import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { db } from "../data/store.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  // Also accept ?token= query param (needed for EventSource / SSE which can't set headers)
  const token = bearerToken || req.query.token || null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = db.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
};
