import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import celebrityRoutes from "./routes/celebrities.js";
import bookingRoutes from "./routes/bookings.js";
import portalRoutes from "./routes/portal.js";
import adminRoutes from "./routes/admin.js";
import messagesRoutes from "./routes/messages.js";
import intelligenceRoutes from "./routes/intelligence.js";
import crowdEventsRoutes from "./routes/crowdEvents.js";
import waitlistRoutes from "./routes/waitlist.js";
import inquiryRoutes from "./routes/inquiry.js";
import portfolioRoutes from "./routes/portfolio.js";
import { authenticate, requireRole } from "./middleware/auth.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const deployMarker = "2026-07-05-new-celebs-smartsupp-fix";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Serve static files (CSS, JS, HTML, images, etc.)
app.use(express.static(join(__dirname, "../../static")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "AURELUX Sovereign API", deployMarker });
});

app.use("/api/auth", authRoutes);
app.use("/api/celebrities", celebrityRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/portal", authenticate, portalRoutes);
app.use("/api/messages", authenticate, messagesRoutes);
app.use("/api/admin", authenticate, requireRole("admin"), adminRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/crowd-events", crowdEventsRoutes);
app.use("/api/waitlist", authenticate, waitlistRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/portfolio", authenticate, requireRole("admin"), portfolioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`AURELUX Sovereign API live on port ${config.port}`);
});
