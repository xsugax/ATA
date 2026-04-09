"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroDeck({ featured }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!featured?.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [featured]);

  if (!featured?.length) return null;

  const active = featured[index];

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-sovereign">Global Featured Profile</p>
          <h2 className="text-4xl font-semibold md:text-5xl">{active.name}</h2>
          <div className="mt-5 grid gap-3 text-sm text-platinum/85 md:grid-cols-2">
            <div>Booking Tier Lead: {active.bookingTiers[2].type}</div>
            <div>Availability: {active.availability}</div>
            <div>Demand Index: {active.demandIndex}%</div>
            <div>Average Event Rate: ${active.averageEventRate.toLocaleString()}</div>
            <div className="md:col-span-2">Recent Brand Alignment: {active.recentBrandAlignment}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
