import express from "express";
import { celebrities } from "../data/celebrities.js";
import { db } from "../data/store.js";

const router = express.Router();

// GET /api/portfolio/summary  (admin only)
router.get("/summary", (_req, res) => {
  const totalRoster = celebrities.length;

  // Static plausible portfolio financials
  const totalManagedPortfolio = 284_000_000_000; // $284B lifetime
  const ytdRevenue = 3_120_000_000;              // $3.12B YTD
  const yoyGrowth = 18;                          // 18% YoY
  const escrowHeld = 420_000_000;                // $420M in escrow
  const portfolioYield = 24;                     // 24% net return
  const activeContracts = db.bookings.length + 47; // base + in-memory
  const avgDealSize = Math.round(celebrities.reduce((s, c) => s + c.bookingPrice, 0) / celebrities.length);

  const categoryBreakdown = [
    { category: "Music & Entertainment", annualVolume: 980_000_000, shareOfPortfolio: 31, avgDealSize: 1_800_000 },
    { category: "Sports & Athletics",    annualVolume: 870_000_000, shareOfPortfolio: 28, avgDealSize: 2_200_000 },
    { category: "Film & Television",     annualVolume: 560_000_000, shareOfPortfolio: 18, avgDealSize: 1_400_000 },
    { category: "Fashion & Luxury",      annualVolume: 380_000_000, shareOfPortfolio: 12, avgDealSize: 950_000  },
    { category: "Business & Tech",       annualVolume: 220_000_000, shareOfPortfolio: 7,  avgDealSize: 750_000  },
    { category: "Digital & Influence",   annualVolume: 110_000_000, shareOfPortfolio: 4,  avgDealSize: 320_000  },
  ];

  const topEarners = celebrities
    .slice()
    .sort((a, b) => b.bookingPrice - a.bookingPrice)
    .slice(0, 8)
    .map((c) => ({
      name: c.name,
      category: c.category || "Entertainment",
      region: c.region || "Global",
      annualRevenue: Math.round(c.bookingPrice * (4 + Math.random() * 6)),
    }));

  const revenueTimeline = [
    { year: "2019", revenue: 890_000_000 },
    { year: "2020", revenue: 620_000_000 },
    { year: "2021", revenue: 1_100_000_000 },
    { year: "2022", revenue: 1_840_000_000 },
    { year: "2023", revenue: 2_420_000_000 },
    { year: "2024", revenue: 2_960_000_000 },
    { year: "2025", revenue: 3_120_000_000 },
  ];

  return res.json({
    totalManagedPortfolio,
    ytdRevenue,
    yoyGrowth,
    escrowHeld,
    portfolioYield,
    activeContracts,
    avgDealSize,
    totalRoster,
    categoryBreakdown,
    topEarners,
    revenueTimeline,
  });
});

export default router;
