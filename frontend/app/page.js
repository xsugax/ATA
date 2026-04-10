"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HeroDeck from "../components/HeroDeck";
import MetricCounters from "../components/MetricCounters";
import RevisionLog from "../components/RevisionLog";
import { fetchJson } from "../lib/api";

function Skeleton() {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px 20px",
        marginBottom: "12px",
        animation: "pulse 1.8s ease-in-out infinite",
      }}>
        <div style={{ width: "120px", height: "10px", background: "rgba(148,180,216,0.2)", borderRadius: "6px", marginBottom: "12px" }} />
        <div style={{ width: "220px", height: "24px", background: "rgba(255,255,255,0.07)", borderRadius: "6px", marginBottom: "10px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: "36px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }} />)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px", animation: "pulse 1.8s ease-in-out infinite" }}>
            <div style={{ width: "80%", height: "9px", background: "rgba(148,180,216,0.15)", borderRadius: "4px", marginBottom: "10px" }} />
            <div style={{ width: "60%", height: "20px", background: "rgba(255,255,255,0.06)", borderRadius: "4px" }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

export default function DashboardPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => fetchJson("/celebrities/featured")
      .then(data => { setPayload(data); setLoading(false); })
      .catch(() => setTimeout(load, 4000));
    load();
  }, []);

  return (
    <main>
      <NavBar />
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <HeroDeck featured={payload?.data || []} />
          <MetricCounters metrics={payload?.metrics} />
        </>
      )}
      <section className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Exclusive Membership</h3>
          <p className="mt-2 text-xs text-platinum/70">Premium onboarding with full access to our verified global talent roster and private booking controls.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Priority Booking</h3>
          <p className="mt-2 text-xs text-platinum/70">Secure high-demand talent through our priority bid windows and direct offer escalation.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Private Talent Requests</h3>
          <p className="mt-2 text-xs text-platinum/70">Submit off-roster talent requests with confidential vetting and dedicated representation.</p>
        </div>
      </section>
      <RevisionLog />
    </main>
  );
}
