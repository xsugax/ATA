"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "../components/NavBar";
import HeroDeck from "../components/HeroDeck";
import MetricCounters from "../components/MetricCounters";
import RevisionLog from "../components/RevisionLog";
import { fetchJson } from "../lib/api";

// Ticker names — duplicated for seamless loop
const TICKER_NAMES = [
  "Beyoncé", "Elon Musk", "Taylor Swift", "Dwayne Johnson", "Rihanna",
  "Drake", "Leonardo DiCaprio", "Cristiano Ronaldo", "Kim Kardashian", "Jay-Z",
  "Adele", "Monica Bellucci", "Sofia Vergara", "Kate Beckinsale", "Warren Buffett",
  "Steven Tyler", "Riley Green", "Jeff Bezos", "Lady Gaga", "LeBron James",
];

const PILLARS = [
  {
    icon: "✦",
    title: "Invite-Only Membership",
    body: "Black Card onboarding for private wealth offices, sovereign funds, and family offices. Tiered privilege controls with discretionary access protocols.",
  },
  {
    icon: "◈",
    title: "Sovereign Bid Windows",
    body: "Unavailable icons engaged through confidential bid escalation. First-refusal windows for platinum-tier clients on calendar closures.",
  },
  {
    icon: "◎",
    title: "Unlisted Icon Requests",
    body: "Submit off-market representation requests with confidential vetting. Our senior team approaches talent not publicly available for bookings.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Browse Verified Talent",
    body: "Explore 166+ globally verified profiles across entertainment, business, sports, fashion, and culture. Real-time availability and demand metrics.",
  },
  {
    num: "02",
    title: "Submit Confidential Request",
    body: "All inquiries are encrypted, NDA-protected, and reviewed by our senior talent coordinators within 24 hours.",
  },
  {
    num: "03",
    title: "We Close the Deal",
    body: "Our team handles all negotiations, contracts, logistics, and security protocols from first contact through event delivery.",
  },
];

const CATEGORIES = ["Film", "Music", "Sports", "Business", "Fashion", "Influencer", "Technology", "Government"];
const REGIONS = ["North America", "Europe", "Middle East", "Asia", "Latin America", "Africa"];

const TRUST_STATS = [
  ["$284B+", "Managed Portfolio"],
  ["166+", "Verified Profiles"],
  ["3,241", "Global Bookings"],
  ["128", "Active Negotiations"],
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function DashboardPage() {
  const [payload, setPayload] = useState(null);
  const ticker = [...TICKER_NAMES, ...TICKER_NAMES];

  useEffect(() => {
    fetchJson("/celebrities/featured").then(setPayload).catch(console.error);
  }, []);

  return (
    <main className="space-y-5">
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl px-6 py-20 text-center md:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(112,143,168,0.13) 0%, transparent 68%)",
          }}
          aria-hidden="true"
        />

        <motion.p {...fade(0)} className="text-[11px] uppercase tracking-[0.55em] text-sovereign">
          All Talents Agency &nbsp;·&nbsp; ATA &nbsp;·&nbsp; Global Celebrity Booking
        </motion.p>

        <motion.h1
          {...fade(0.1)}
          className="mt-4 text-4xl font-bold leading-[1.08] md:text-6xl lg:text-7xl"
        >
          Opportunity to meet the people
          <br className="hidden md:block" />
          {" "}who{" "}
          <span className="text-sovereign">change the world.</span>
        </motion.h1>

        <motion.p
          {...fade(0.22)}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-platinum/55 md:text-lg"
        >
          The world&apos;s most exclusive celebrity booking platform. 166+ verified A-list profiles
          spanning entertainment, business, sports, and global culture.
        </motion.p>

        <motion.div
          {...fade(0.36)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/explorer"
            className="rounded-xl bg-sovereign px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-sovereign/80 hover:shadow-aura"
          >
            Explore Talent →
          </Link>
          <Link
            href="/portal"
            className="rounded-xl border border-sovereign/35 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-sovereign transition hover:border-sovereign hover:text-platinum"
          >
            Client Portal
          </Link>
        </motion.div>
      </section>

      {/* ── CELEBRITY NAME TICKER ─────────────────────────── */}
      <div className="overflow-hidden border-y border-white/[0.06] py-3" aria-hidden="true">
        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: "ticker 48s linear infinite", willChange: "transform" }}
        >
          {ticker.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[10px] font-medium uppercase tracking-[0.35em] text-platinum/25"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED CELEBRITY DECK ───────────────────────── */}
      <HeroDeck featured={payload?.data || []} />

      {/* ── METRICS ──────────────────────────────────────── */}
      <MetricCounters metrics={payload?.metrics} />

      {/* ── SERVICE PILLARS ──────────────────────────────── */}
      <section>
        <motion.p {...fade(0)} className="mb-4 text-[11px] uppercase tracking-[0.38em] text-sovereign">
          Premium Services
        </motion.p>
        <div className="grid gap-3 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              {...fade(i * 0.08)}
              className="metric-card cursor-default transition hover:-translate-y-1 hover:shadow-aura"
            >
              <span className="text-2xl text-sovereign leading-none">{p.icon}</span>
              <h3 className="mt-3 text-[11px] uppercase tracking-[0.25em] text-sovereign">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-platinum/60">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section>
        <motion.div {...fade(0)} className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.38em] text-sovereign">How It Works</p>
          <h2 className="mt-1 text-xl font-semibold md:text-2xl">
            From inquiry to unforgettable experience
          </h2>
        </motion.div>
        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.num} {...fade(i * 0.08)} className="metric-card">
              <p className="text-3xl font-bold text-sovereign/20 leading-none">{s.num}</p>
              <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-platinum/55">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="glass rounded-2xl p-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.42em] text-sovereign">Talent Categories</p>
        <p className="mt-1 text-xs text-platinum/40">
          Filter by category in the Explorer
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/explorer?category=${encodeURIComponent(cat)}`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-platinum/60 transition hover:border-sovereign/40 hover:bg-sovereign/10 hover:text-sovereign"
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="mt-5 border-t border-white/5 pt-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-platinum/30">
            Global Reach — {REGIONS.join("  ·  ")}
          </p>
        </div>
      </section>

      {/* ── TRUST & AUTHORITY ────────────────────────────── */}
      <section className="glass rounded-2xl px-6 py-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.42em] text-sovereign">Trusted Worldwide</p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-platinum/50">
          Trusted by private wealth offices, sovereign investment funds, luxury brands,
          and executive leadership teams across six continents.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {TRUST_STATS.map(([val, label]) => (
            <div
              key={label}
              className="rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <p className="text-xl font-semibold text-sovereign">{val}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-platinum/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVISION LOG ─────────────────────────────────── */}
      <RevisionLog />
    </main>
  );
}
