import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import celebrityRoutes from "./routes/celebrities.js";
import bookingRoutes from "./routes/bookings.js";
import portalRoutes from "./routes/portal.js";
import adminRoutes from "./routes/admin.js";
import messagesRoutes from "./routes/messages.js";
import crowdfundingRoutes from "./routes/crowdfunding.js";
import { authenticate, requireRole } from "./middleware/auth.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "AURELUX Sovereign API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/celebrities", celebrityRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/portal", authenticate, portalRoutes);
app.use("/api/messages", authenticate, messagesRoutes);
app.use("/api/admin", authenticate, requireRole("admin"), adminRoutes);
app.use("/api/crowdfunding", crowdfundingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`AURELUX Sovereign API live on port ${config.port}`);
});
