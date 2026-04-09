"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HeroDeck from "../components/HeroDeck";
import MetricCounters from "../components/MetricCounters";
import RevisionLog from "../components/RevisionLog";
import { fetchJson } from "../lib/api";

export default function DashboardPage() {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    fetchJson("/celebrities/featured").then(setPayload).catch(console.error);
  }, []);

  return (
    <main>
      <NavBar />
      <HeroDeck featured={payload?.data || []} />
      <MetricCounters metrics={payload?.metrics} />
      <section className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Invite-Only Membership</h3>
          <p className="mt-2 text-xs text-platinum/70">Black Card onboarding for private wealth offices with discretionary access controls.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Auction Bidding</h3>
          <p className="mt-2 text-xs text-platinum/70">Unavailable icons engaged through sovereign bid windows and private offer escalation.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Unlisted Icon Requests</h3>
          <p className="mt-2 text-xs text-platinum/70">Submit off-market representation requests with confidential vetting.</p>
        </div>
      </section>
      <RevisionLog />
    </main>
  );
}
