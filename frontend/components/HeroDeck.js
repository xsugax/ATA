"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HeroDeck({ featured }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!featured?.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [featured]);

  if (!featured?.length) {
    return (
      <div className="glass flex min-h-[220px] items-center justify-center rounded-2xl">
        <p className="text-xs text-platinum/30 tracking-widest uppercase">Loading featured talent…</p>
      </div>
    );
  }

  const active = featured[index];

  return (
    <div className="glass relative overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="flex min-h-[260px] flex-col md:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Content ── */}
          <div className="flex flex-1 flex-col justify-between p-6 md:p-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-sovereign">
                All Talents Agency · Featured Profile
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
                {active.name}
              </h2>
              {active.eliteSignal && (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-platinum/50 line-clamp-3">
                  {active.eliteSignal}
                </p>
              )}
            </div>

            <div>
              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-platinum/65">
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-platinum/35">
                    Starting Rate
                  </span>
                  ${active.averageEventRate?.toLocaleString() ?? active.startingPrice?.toLocaleString()}
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-platinum/35">
                    Status
                  </span>
                  {active.availability}
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-platinum/35">
                    Agency
                  </span>
                  {active.agencyRepresentation}
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-platinum/35">
                    Social Reach
                  </span>
                  {active.socialReachMillions}M followers
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/booking/${active.id}`}
                  className="rounded-lg bg-sovereign px-5 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-sovereign/80"
                >
                  Book Private Event →
                </Link>
                <Link
                  href="/explorer"
                  className="rounded-lg border border-sovereign/30 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-sovereign transition hover:border-sovereign"
                >
                  All Talent
                </Link>
              </div>
            </div>
          </div>

          {/* ── Portrait ── */}
          <div className="relative h-52 flex-shrink-0 overflow-hidden md:h-auto md:w-72 md:rounded-r-2xl lg:w-80">
            <img
              src={active.portrait}
              alt={`${active.name} — All Talents Agency`}
              className="h-full w-full object-cover object-top"
              loading="eager"
            />
            {/* Gradient fade: bottom on mobile, left on desktop */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #0F1419 0%, transparent 40%), linear-gradient(to right, #0F1419 0%, transparent 30%)",
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Dot navigation ── */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {featured.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View celebrity ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-sovereign" : "w-1.5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
