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
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <h3 className="text-sm uppercase tracking-[0.3em] text-sovereign">Invite-Only Membership</h3>
          <p className="mt-3 text-sm text-platinum/80">Black Card onboarding for private wealth offices with discretionary access controls.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-sm uppercase tracking-[0.3em] text-sovereign">Auction Bidding</h3>
          <p className="mt-3 text-sm text-platinum/80">Unavailable icons can be engaged through sovereign bid windows and private offer escalation.</p>
        </div>
        <div className="metric-card">
          <h3 className="text-sm uppercase tracking-[0.3em] text-sovereign">Unlisted Icon Requests</h3>
          <p className="mt-3 text-sm text-platinum/80">Submit off-market representation requests with confidential vetting.</p>
        </div>
      </section>
      <RevisionLog />
    </main>
  );
}
