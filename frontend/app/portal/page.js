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
        <div className="glass rounded-2xl p-6 text-sm">Login as client or manager to unlock the client portal.</div>
      ) : (
        <section className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-2xl font-semibold">Client Portal</h2>
            <p className="text-sm text-platinum/70">Membership Tier: <span className="text-sovereign">{data.membershipTier}</span></p>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Active Bookings</h3><p className="mt-2 text-2xl">{data.bookings.length}</p></div>
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Contract Vault</h3><p className="mt-2 text-2xl">{data.contracts.length}</p></div>
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Payment Dashboard</h3><p className="mt-2 text-2xl">{data.payments.length}</p></div>
            <div className="metric-card"><h3 className="text-xs uppercase tracking-wider text-sovereign">Disclosure Workspaces</h3><p className="mt-2 text-2xl">{data.disclosureWorkspaces?.length || 0}</p></div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg">Bookings Under Review</h3>
              <span className="text-xs uppercase tracking-[0.18em] text-platinum/45">Admin verification required before approval</span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {data.bookings.length === 0 ? (
                <p className="text-sm text-platinum/55">No active bookings yet.</p>
              ) : data.bookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-platinum">{booking.celebrityName}</p>
                      <p className="mt-1 text-xs text-platinum/55">{booking.eventType} · {booking.location} · {booking.date || "Date pending"}</p>
                    </div>
                    <span className="rounded-full border border-sovereign/30 bg-sovereign/10 px-3 py-1 text-[11px] text-sovereign">{booking.status}</span>
                  </div>
                  {booking.verificationRequired ? <p className="mt-3 text-xs text-platinum/60">Awaiting admin verification before approval can proceed.</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-lg">Professional Disclosure Workspace</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {(data.disclosureWorkspaces || []).length === 0 ? (
                <p className="text-sm text-platinum/55">Secure workspaces appear here after admin approval.</p>
              ) : data.disclosureWorkspaces.map((workspace) => (
                <div key={workspace.id} className="rounded-xl border border-sovereign/25 bg-sovereign/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-sovereign">{workspace.id}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-platinum/65">{workspace.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-platinum/60">Isolated from the initial booking form and restricted to assigned participants.</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-platinum/70 sm:grid-cols-3">
                    {Object.keys(workspace.modules || {}).map((module) => (
                      <span key={module} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 capitalize">{module.replace(/([A-Z])/g, " $1")}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
