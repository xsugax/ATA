"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import CelebrityCard from "../../components/CelebrityCard";
import { fetchJson } from "../../lib/api";

const initialFilters = {
  search: "",
  category: "All",
  region: "All",
  minPrice: 0,
  maxPrice: 2000000,
  minPopularity: 60,
  minDemand: 55,
  maxAvailabilityDays: 60,
  netWorthTier: "All",
  eventType: "All",
};

export default function ExplorerPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityDate, setAvailabilityDate] = useState("");

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(Object.entries(filters)).toString();
    const load = () => fetchJson(`/celebrities?${query}`)
      .then((res) => { setCelebrities(res.data); setLoading(false); })
      .catch(() => setTimeout(load, 4000));
    load();
  }, [filters]);

  const meta = useMemo(
    () => ({
      categories: ["All", "Film", "Music", "Sports", "Fashion", "Business", "Influencer"],
      regions: ["All", "North America", "Europe", "Middle East", "Asia", "Latin America", "Africa"],
      netWorthTiers: ["All", "$50M+", "$100M+", "$500M+", "$1B+"],
      eventTypes: ["All", "Summit", "Gala", "Launch", "Private Dinner", "Festival"],
    }),
    []
  );

  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="glass rounded-2xl p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold md:text-xl">Celebrity Intelligence Explorer</h2>
            <p className="mt-0.5 text-sm text-platinum/60">Real-time filtering across {celebrities.length || "166"} verified global profiles</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <input className="col-span-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm sm:col-span-1" placeholder="Search name" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>{meta.categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.region} onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}>{meta.regions.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.eventType} onChange={(e) => setFilters((prev) => ({ ...prev, eventType: e.target.value }))}>{meta.eventTypes.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.netWorthTier} onChange={(e) => setFilters((prev) => ({ ...prev, netWorthTier: e.target.value }))}>{meta.netWorthTiers.map((c) => <option key={c}>{c}</option>)}</select>
          <input type="number" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.minPrice} onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))} placeholder="Min $" />
          <input type="number" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.maxPrice} onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))} placeholder="Max $" />
          <input type="date" className="rounded-lg border border-sovereign/35 bg-black/40 px-3 py-2 text-sm" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} />
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-platinum/50 transition hover:text-platinum"
          >
            Reset
          </button>
        </div>
      </section>
      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/7 bg-white/4 p-4" style={{ animation: "pulse 1.8s ease-in-out infinite" }}>
              <div className="mb-3 h-44 rounded-xl bg-white/6" />
              <div className="mb-2 h-4 w-3/4 rounded bg-sovereign/15" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
            </div>
          ))
        ) : celebrities.length === 0 ? (
          <div className="col-span-full glass rounded-2xl p-8 text-center text-sm text-platinum/50">
            No celebrities match your filters. <button type="button" className="text-sovereign underline" onClick={() => setFilters(initialFilters)}>Reset filters</button>
          </div>
        ) : (
          celebrities.map((celeb) => (
            <CelebrityCard key={celeb.id} celebrity={celeb} availabilityDate={availabilityDate} />
          ))
        )}
      </section>
    </main>
  );
}
