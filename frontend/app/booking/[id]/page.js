"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";
import BookingStatusTracker from "../../../components/BookingStatusTracker";
import { authHeaders, fetchJson, logRevision } from "../../../lib/api";

const stages = [
  "Booking Submitted - Awaiting Admin Verification",
  "Admin Verification In Progress",
  "Admin Verified - Terms Review",
  "Terms Negotiation",
  "Contract Finalized",
  "Escrow Secured",
  "Approved - Disclosure Workspace Open",
];

const cryptoWallets = {
  BTC: { network: "Bitcoin", address: "bc1qaurelux7k2mnp4z3wl8rdf6sd2xemvs3c8qkm7" },
  ETH: { network: "Ethereum ERC-20", address: "0xAureLux9F5d8A4C2b6E91D0fE7b2C8aC9D3eF012" },
  USDT: { network: "Ethereum ERC-20", address: "0xAureLuxUSDT8A4C2b6E91D0fE7b2C8aC9D3" },
};

export default function BookingPage() {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    eventType: "Gala",
    date: "",
    location: "Dubai",
    ndaRequired: true,
    securityLevel: "Executive",
    riderRequirements: "Private lounge + fortified arrival corridor",
    pricingAdjustmentPercent: 0,
    paymentMethod: "wire",
    cryptoCurrency: "BTC",
  });

  useEffect(() => {
    fetchJson(`/celebrities/${id}`).then(setCelebrity).catch(console.error);
  }, [id]);

  const pricing = useMemo(() => {
    if (!celebrity) return { quote: 0, escrow: 0 };
    const quote = Math.round(celebrity.startingPrice * (1 + form.pricingAdjustmentPercent / 100));
    return { quote, escrow: Math.round(quote * 0.3) };
  }, [celebrity, form.pricingAdjustmentPercent]);

  const submit = async () => {
    try {
      const booking = await fetchJson("/bookings/initiate", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ ...form, celebrityId: id }),
      });
      setResult(booking.booking);
      logRevision("BOOKING_INITIATED", `Booking submitted for ${booking.booking.celebrityName} (${booking.booking.contractId})`);
    } catch (error) {
      alert(error.message + " | Use login page first.");
    }
  };

  if (!celebrity) return <main><NavBar /><p>Loading...</p></main>;

  return (
    <main>
      <NavBar />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass rounded-2xl p-4 md:p-5">
          <h2 className="text-2xl font-semibold">Book Talent · {celebrity.name}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" placeholder="Event type" value={form.eventType} onChange={(e) => setForm((p) => ({ ...p, eventType: e.target.value }))} />
            <input type="date" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            <input className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
            <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2" value={form.securityLevel} onChange={(e) => setForm((p) => ({ ...p, securityLevel: e.target.value }))}>
              {celebrity.securityTiers.map((tier) => <option key={tier}>{tier}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-platinum/80">
              <input type="checkbox" checked={form.ndaRequired} onChange={(e) => setForm((p) => ({ ...p, ndaRequired: e.target.checked }))} /> NDA Required
            </label>
            <div>
              <p className="text-xs uppercase tracking-wider text-sovereign">Dynamic Pricing Slider</p>
              <input type="range" min={-15} max={50} value={form.pricingAdjustmentPercent} onChange={(e) => setForm((p) => ({ ...p, pricingAdjustmentPercent: Number(e.target.value) }))} className="w-full" />
            </div>
            <textarea className="md:col-span-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2" rows={3} value={form.riderRequirements} onChange={(e) => setForm((p) => ({ ...p, riderRequirements: e.target.value }))} />
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sovereign">Payment Method</p>
                <p className="text-xs text-platinum/55">Escrow instructions remain gated until admin verification.</p>
              </div>
              <div className="grid w-full grid-cols-3 gap-2 sm:w-auto">
                {[
                  ["wire", "Wire"],
                  ["escrow", "Escrow"],
                  ["crypto", "Crypto"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, paymentMethod: value }))}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${form.paymentMethod === value ? "border-sovereign bg-sovereign text-black" : "border-white/10 bg-white/5 text-platinum/70 hover:border-sovereign/50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {form.paymentMethod === "crypto" ? (
              <details className="mt-3 rounded-lg border border-sovereign/25 bg-sovereign/10 p-3" open>
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-sovereign">Cryptocurrency details</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                  <select className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={form.cryptoCurrency} onChange={(e) => setForm((p) => ({ ...p, cryptoCurrency: e.target.value }))}>
                    {Object.keys(cryptoWallets).map((coin) => <option key={coin}>{coin}</option>)}
                  </select>
                  <div className="min-w-0 rounded-lg border border-white/10 bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-platinum/50">{cryptoWallets[form.cryptoCurrency].network}</p>
                    <p className="mt-1 break-all font-mono text-xs text-sovereign">{cryptoWallets[form.cryptoCurrency].address}</p>
                    <p className="mt-2 text-xs text-platinum/55">Send only the selected asset on the listed network after verification.</p>
                  </div>
                </div>
              </details>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="metric-card"><p className="text-xs text-platinum/60">Live Quote</p><p className="text-xl text-sovereign">${pricing.quote.toLocaleString()}</p></div>
            <div className="metric-card"><p className="text-xs text-platinum/60">Escrow Deposit (30%)</p><p className="text-xl text-sovereign">${pricing.escrow.toLocaleString()}</p></div>
            <div className="metric-card"><p className="text-xs text-platinum/60">Contract PDF</p><p className="text-xl text-sovereign">Simulation Ready</p></div>
          </div>
          <button onClick={submit} className="mt-4 rounded-xl bg-sovereign px-5 py-3 text-sm font-semibold uppercase text-black">Confirm Booking Workflow</button>
          {result ? (
            <div className="mt-4 rounded-xl border border-sovereign/30 bg-sovereign/10 p-4">
              <p className="text-sm font-semibold text-sovereign">Booking Submitted - Awaiting Admin Verification</p>
              <p className="mt-1 text-xs text-platinum/65">Admin follow-up task created. Approval remains locked until details are verified.</p>
            </div>
          ) : null}
        </div>
        <BookingStatusTracker stages={stages} currentStage={result?.status || stages[0]} />
      </section>
    </main>
  );
}
