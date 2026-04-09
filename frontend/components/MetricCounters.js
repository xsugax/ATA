"use client";

import { motion } from "framer-motion";

export default function MetricCounters({ metrics }) {
  if (!metrics) return null;

  const cards = [
    ["Total Global Bookings", metrics.totalGlobalBookings],
    ["Managed Portfolio Value", `$${(metrics.managedPortfolioValue / 1_000_000).toFixed(0)}M`],
    ["Active Negotiations", metrics.activeNegotiations],
    ["Verified Celebrities", metrics.verifiedCelebrities],
  ];

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value], i) => (
        <motion.div
          className="metric-card"
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-platinum/60">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-sovereign">{value}</p>
        </motion.div>
      ))}
    </div>
  );
}
