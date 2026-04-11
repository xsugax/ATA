import express from "express";
import { v4 as uuid } from "uuid";
import { celebrities } from "../data/celebrities.js";

const router = express.Router();

// Seeded crowd events based on real celebrities
const crowdEvents = [
  {
    id: "ce1",
    name: "Taylor Swift",
    city: "New York",
    date: "2025-09-14",
    slots: 40,
    claimed: 28,
    pricePerSlot: 18500,
    includes: ["VIP Table (8 seats)", "Private Meet & Greet", "Signed Memorabilia", "Concierge Host"],
    installments: [{ months: 3, monthly: 6333 }, { months: 6, monthly: 3250 }],
  },
  {
    id: "ce2",
    name: "Cristiano Ronaldo",
    city: "Dubai",
    date: "2025-10-05",
    slots: 30,
    claimed: 30,
    pricePerSlot: 22000,
    includes: ["Stadium Box Access", "Private Photo Session", "Jersey Signing", "Premium Dinner"],
    installments: [{ months: 3, monthly: 7533 }, { months: 6, monthly: 3833 }],
  },
  {
    id: "ce3",
    name: "Beyoncé",
    city: "London",
    date: "2025-11-22",
    slots: 20,
    claimed: 11,
    pricePerSlot: 25000,
    includes: ["Platinum Suite", "Backstage Access", "Personal Greeting", "Exclusive After-Party"],
    installments: [{ months: 3, monthly: 8500 }, { months: 6, monthly: 4333 }],
  },
  {
    id: "ce4",
    name: "Lionel Messi",
    city: "Miami",
    date: "2025-12-07",
    slots: 24,
    claimed: 18,
    pricePerSlot: 21000,
    includes: ["Pitch-Side Dinner", "Match Ball Signing", "Team Photo Access", "VIP Lounge"],
    installments: [{ months: 3, monthly: 7200 }, { months: 6, monthly: 3650 }],
  },
  {
    id: "ce5",
    name: "Rihanna",
    city: "Paris",
    date: "2026-01-18",
    slots: 16,
    claimed: 4,
    pricePerSlot: 28000,
    includes: ["Couture Show Access", "Private Studio Visit", "Signed Collection Piece", "Luxury Transport"],
    installments: [{ months: 3, monthly: 9533 }, { months: 6, monthly: 4833 }],
  },
  {
    id: "ce6",
    name: "Dwayne Johnson",
    city: "Los Angeles",
    date: "2025-08-30",
    slots: 35,
    claimed: 19,
    pricePerSlot: 14500,
    includes: ["Set Visit Pass", "Personal Workout Session", "Signed Poster", "Exclusive Q&A"],
    installments: [{ months: 3, monthly: 4967 }, { months: 6, monthly: 2533 }],
  },
];

// In-memory join records
const joinRecords = [];

// GET /api/crowd-events
router.get("/", (_req, res) => {
  return res.json(crowdEvents);
});

// POST /api/crowd-events/:id/join
router.post("/:id/join", (req, res) => {
  const event = crowdEvents.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const avail = event.slots - event.claimed;
  if (avail <= 0) return res.status(409).json({ error: "This event is fully sold out." });

  const { plan, paymentMethod } = req.body || {};
  if (!plan || !paymentMethod) {
    return res.status(400).json({ error: "plan and paymentMethod are required" });
  }

  // Mark a slot as claimed (in-memory)
  event.claimed = Math.min(event.slots, event.claimed + 1);

  const confirmationId = `CEJ-${uuid().slice(0, 8).toUpperCase()}`;
  const record = {
    confirmationId,
    eventId: event.id,
    eventName: event.name,
    city: event.city,
    date: event.date,
    plan,
    paymentMethod,
    joinedAt: new Date().toISOString(),
  };
  joinRecords.push(record);

  return res.status(201).json({
    confirmationId,
    message: `Your slot for ${event.name} in ${event.city} has been secured.`,
    event: { name: event.name, city: event.city, date: event.date },
    plan,
    includes: event.includes,
  });
});

export default router;
