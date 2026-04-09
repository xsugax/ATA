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
    <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
      {cards.map(([label, value], i) => (
        <motion.div
          className="metric-card"
          key={label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-platinum/50 leading-tight">{label}</p>
          <p className="mt-2 text-xl font-semibold text-sovereign">{value}</p>
        </motion.div>
      ))}
    </div>
  );
}
