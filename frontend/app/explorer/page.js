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
    <main>
      <NavBar />
      <section className="glass rounded-2xl p-4">
        <h2 className="text-xl font-semibold">Elite Celebrity Intelligence Explorer</h2>
        <p className="mt-1 text-sm text-platinum/70">Real-time filtering across 100 verified global profiles</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="Search name" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>{meta.categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.region} onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}>{meta.regions.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.eventType} onChange={(e) => setFilters((prev) => ({ ...prev, eventType: e.target.value }))}>{meta.eventTypes.map((c) => <option key={c}>{c}</option>)}</select>
          <input type="number" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.minPrice} onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))} placeholder="Min price" />
          <input type="number" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.maxPrice} onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))} placeholder="Max price" />
          <input type="number" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.minPopularity} onChange={(e) => setFilters((prev) => ({ ...prev, minPopularity: Number(e.target.value) }))} placeholder="Min popularity" />
          <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={filters.netWorthTier} onChange={(e) => setFilters((prev) => ({ ...prev, netWorthTier: e.target.value }))}>{meta.netWorthTiers.map((c) => <option key={c}>{c}</option>)}</select>
          <input type="date" className="rounded-lg border border-sovereign/35 bg-black/40 px-3 py-2 text-sm" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} />
        </div>
      </section>
      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "16px", animation: "pulse 1.8s ease-in-out infinite" }}>
              <div style={{ height: "176px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", marginBottom: "12px" }} />
              <div style={{ height: "16px", width: "70%", background: "rgba(148,180,216,0.15)", borderRadius: "4px", marginBottom: "8px" }} />
              <div style={{ height: "11px", width: "50%", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
            </div>
          ))
        ) : (
          celebrities.map((celeb) => (
            <CelebrityCard key={celeb.id} celebrity={celeb} availabilityDate={availabilityDate} />
          ))
        )}
      </section>
    </main>
  );
}
