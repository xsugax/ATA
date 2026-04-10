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
