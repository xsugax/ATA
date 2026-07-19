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
  BTC:  { network: "Bitcoin",           address: "bc1qaurelux7k2mnp4z3wl8rdf6sd2xemvs3c8qkm7" },
  ETH:  { network: "Ethereum ERC-20",   address: "0xAureLux9F5d8A4C2b6E91D0fE7b2C8aC9D3eF012" },
  USDT: { network: "Ethereum ERC-20",   address: "0xAureLuxUSDT8A4C2b6E91D0fE7b2C8aC9D3" },
};

export default function BookingPage() {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    eventType:                "Gala",
    date:                     "",
    location:                 "Dubai",
    ndaRequired:              true,
    securityLevel:            "Executive",
    riderRequirements:        "Private lounge + fortified arrival corridor",
    pricingAdjustmentPercent: 0,
    paymentMethod:            "wire",
    cryptoCurrency:           "BTC",
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
    if (!form.date) { alert("Please select an event date."); return; }
    setLoading(true);
    try {
      const booking = await fetchJson("/bookings/initiate", {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify({ ...form, celebrityId: id }),
      });
      setResult(booking.booking);
      logRevision("BOOKING_INITIATED", `Booking submitted for ${booking.booking.celebrityName} (${booking.booking.contractId})`);
    } catch (error) {
      alert(error.message + " — Please log in first via the Access page.");
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  if (!celebrity) {
    return (
      <main>
        <NavBar />
        <div className="glass rounded-2xl p-8 text-center text-sm text-platinum/50">Loading talent profile…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <NavBar />

      {/* Page header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sovereign">Initiate Engagement</p>
          <h1 className="mt-0.5 text-xl font-semibold md:text-2xl">{celebrity.name}</h1>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
          celebrity.availability === "Open"     ? "border-green-500/30 bg-green-500/10 text-green-400" :
          celebrity.availability === "Limited"  ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                                                  "border-red-500/30 bg-red-500/10 text-red-400"
        }`}>{celebrity.availability}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        {/* ── Booking form ───────────────────────────── */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 md:p-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-sovereign">Event Details</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-platinum/50">Event Type</label>
                <input className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="e.g. Gala, Summit, Launch" value={form.eventType} onChange={(e) => set("eventType", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-platinum/50">Event Date</label>
                <input type="date" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-platinum/50">Location / City</label>
                <input className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="e.g. Dubai, New York" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-platinum/50">Security Tier</label>
                <select className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" value={form.securityLevel} onChange={(e) => set("securityLevel", e.target.value)}>
                  {celebrity.securityTiers.map((tier) => <option key={tier}>{tier}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-platinum/50">Rider Requirements</label>
                <textarea className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" rows={2} value={form.riderRequirements} onChange={(e) => set("riderRequirements", e.target.value)} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-platinum/80">
                <input type="checkbox" checked={form.ndaRequired} onChange={(e) => set("ndaRequired", e.target.checked)} className="accent-sovereign" />
                NDA Required
              </label>
            </div>
          </div>

          {/* Dynamic pricing */}
          <div className="glass rounded-2xl p-4 md:p-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-sovereign">Dynamic Pricing</p>
            <div className="flex items-center justify-between text-xs text-platinum/60 mb-1">
              <span>-15%</span>
              <span className="font-semibold text-sovereign">{form.pricingAdjustmentPercent > 0 ? "+" : ""}{form.pricingAdjustmentPercent}%</span>
              <span>+50%</span>
            </div>
            <input type="range" min={-15} max={50} value={form.pricingAdjustmentPercent} onChange={(e) => set("pricingAdjustmentPercent", Number(e.target.value))} className="w-full accent-sovereign" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                <p className="text-[10px] text-platinum/50">Live Quote</p>
                <p className="mt-1 text-base font-semibold text-sovereign">${pricing.quote.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                <p className="text-[10px] text-platinum/50">Escrow (30%)</p>
                <p className="mt-1 text-base font-semibold text-sovereign">${pricing.escrow.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                <p className="text-[10px] text-platinum/50">Contract</p>
                <p className="mt-1 text-base font-semibold text-sovereign">Ready</p>
              </div>
            </div>
          </div>

          {/* Payment — crypto is collapsible and only shown when selected */}
          <div className="glass rounded-2xl p-4 md:p-5">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-sovereign">Payment Method</p>
            <div className="flex gap-2">
              {[["wire", "Wire Transfer"], ["escrow", "Escrow"], ["crypto", "Cryptocurrency"]].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("paymentMethod", value)}
                  className={`flex-1 rounded-lg border py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
                    form.paymentMethod === value
                      ? "border-sovereign bg-sovereign/15 text-sovereign"
                      : "border-white/10 bg-white/5 text-platinum/50 hover:border-white/20 hover:text-platinum/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Crypto details — only rendered + shown when crypto is selected */}
            {form.paymentMethod === "crypto" && (
              <div className="mt-3 rounded-xl border border-sovereign/20 bg-sovereign/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-sovereign font-semibold">Wallet Details</span>
                  <span className="text-[10px] text-platinum/40">Select currency below</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {Object.keys(cryptoWallets).map((coin) => (
                    <button
                      key={coin}
                      type="button"
                      onClick={() => set("cryptoCurrency", coin)}
                      className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition ${
                        form.cryptoCurrency === coin
                          ? "border-sovereign bg-sovereign/15 text-sovereign"
                          : "border-white/10 bg-white/5 text-platinum/50 hover:border-white/20"
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-platinum/40 mb-1">{cryptoWallets[form.cryptoCurrency].network}</p>
                  <p className="break-all font-mono text-[11px] text-sovereign leading-relaxed">{cryptoWallets[form.cryptoCurrency].address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-sovereign px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Confirm Booking Workflow"}
          </button>

          {/* Post-submit confirmation */}
          {result && (
            <div className="rounded-2xl border border-sovereign/30 bg-sovereign/8 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-sovereign">Booking Submitted — Awaiting Admin Verification</p>
                  <p className="mt-1 text-xs text-platinum/60">
                    Contract <code className="font-mono text-sovereign">{result.contractId}</code> created.
                    An admin has been assigned to review and will contact you to confirm details.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-platinum/50">
                    <span>Event: {result.eventType}</span>
                    <span>Location: {result.location}</span>
                    <span>Security: {result.securityLevel}</span>
                    <span>Payment: {result.paymentMethod}</span>
                  </div>
                  <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-2.5 text-[11px] text-amber-300/80 leading-relaxed">
                    Verification checklist: identity validation, event details review, security tier confirmation, and quote approval. Check your Portal for status updates.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Status tracker sidebar ──────────────────── */}
        <div className="xl:sticky xl:top-4 xl:self-start">
          <BookingStatusTracker stages={stages} currentStage={result?.status || stages[0]} />
        </div>
      </div>
    </main>
  );
}
