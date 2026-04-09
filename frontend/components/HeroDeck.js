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
    <div className="glass relative overflow-hidden rounded-2xl p-4 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-1 text-[10px] uppercase tracking-[0.4em] text-sovereign">Featured Profile</p>
          <h2 className="text-2xl font-semibold md:text-5xl">{active.name}</h2>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-platinum/75 md:text-sm">
            <div><span className="text-platinum/40">Tier</span><br />{active.bookingTiers[2].type}</div>
            <div><span className="text-platinum/40">Status</span><br />{active.availability}</div>
            <div><span className="text-platinum/40">Demand</span><br />{active.demandIndex}%</div>
            <div><span className="text-platinum/40">Rate</span><br />${active.averageEventRate.toLocaleString()}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
