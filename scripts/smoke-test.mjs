import { spawn } from "node:child_process";

const backendCwd = new URL("../backend", import.meta.url);
const API = "http://localhost:4000/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForHealth(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${API}/health`);
      if (response.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error("Backend health check timed out");
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `${path} failed`);
  }
  return payload;
}

async function runSmoke() {
  const featured = await request("/celebrities/featured");
  if (!featured?.data?.length) throw new Error("Featured list empty");

  const availability = await request(`/celebrities/${featured.data[0].id}/availability?date=2026-03-10`);
  if (typeof availability.available !== "boolean") throw new Error("Availability payload invalid");

  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "client@aurelux.com", password: "Client@123" }),
  });

  const token = login?.token;
  if (!token) throw new Error("Login token missing");

  const message = await request("/messages/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      celebrityId: featured.data[0].id,
      priority: "Priority",
      body: "Smoke test message for sovereign representative channel.",
    }),
  });

  if (!message?.ok) throw new Error("Message endpoint failed");

  const booking = await request("/bookings/initiate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      celebrityId: featured.data[0].id,
      eventType: "Gala",
      date: "2026-03-20",
      location: "Dubai",
      ndaRequired: true,
      securityLevel: "Executive",
      riderRequirements: "Private secure arrival protocol",
      pricingAdjustmentPercent: 10,
    }),
  });

  if (!booking?.booking?.id) throw new Error("Booking initiation failed");

  console.log("✅ Smoke test passed: health, featured, availability, auth, message, booking");
}

const backend = spawn("node", ["src/server.js"], {
  cwd: backendCwd,
  stdio: "ignore",
  shell: true,
});

try {
  await waitForHealth();
  await runSmoke();
} catch (error) {
  console.error(`❌ Smoke test failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  backend.kill();
}
