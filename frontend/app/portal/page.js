"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { authHeaders, fetchJson } from "../../lib/api";

export default function PortalPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchJson("/portal/overview", { headers: authHeaders() }).then(setData).catch(() => setData(null));
  }, []);

  return (
    <main>
      <NavBar />
      {!data ? (
        <div className="glass rounded-2xl p-6 text-sm">Login as client or manager to unlock the sovereign client portal.</div>
      ) : (
        <section className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-2xl font-semibold">Sovereign Client Portal</h2>
            <p className="text-sm text-platinum/70">Membership Tier: <span className="text-sovereign">{data.membershipTier}</span></p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Active Bookings</h3><p className="mt-2 text-2xl">{data.bookings.length}</p></div>
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Contract Vault</h3><p className="mt-2 text-2xl">{data.contracts.length}</p></div>
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Payment Dashboard</h3><p className="mt-2 text-2xl">{data.payments.length}</p></div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-lg">Private AI Concierge Assistant</h3>
            <p className="mt-2 text-sm text-platinum/75">{data.concierge.suggestion}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-sovereign">VIP Membership Upgrades</p>
            <div className="mt-2 flex flex-wrap gap-2">{data.vipUpgradeOptions.map((tier) => <span key={tier} className="rounded-lg border border-sovereign/40 px-3 py-1 text-xs">{tier}</span>)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
