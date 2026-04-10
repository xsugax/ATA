"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";
import BookingStatusTracker from "../../../components/BookingStatusTracker";
import { authHeaders, fetchJson, logRevision } from "../../../lib/api";

const stages = [
  "Inquiry Received",
  "Under Representation Review",
  "Terms Negotiation",
  "Contract Finalized",
  "Escrow Secured",
  "Confirmed",
];

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
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
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

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="metric-card"><p className="text-xs text-platinum/60">Live Quote</p><p className="text-xl text-sovereign">${pricing.quote.toLocaleString()}</p></div>
            <div className="metric-card"><p className="text-xs text-platinum/60">Escrow Deposit (30%)</p><p className="text-xl text-sovereign">${pricing.escrow.toLocaleString()}</p></div>
            <div className="metric-card"><p className="text-xs text-platinum/60">Contract PDF</p><p className="text-xl text-sovereign">Simulation Ready</p></div>
          </div>
          <button onClick={submit} className="mt-4 rounded-xl bg-sovereign px-5 py-3 text-sm font-semibold uppercase text-black">Confirm Booking Workflow</button>
        </div>
        <BookingStatusTracker stages={stages} currentStage={result?.status || stages[0]} />
      </section>
    </main>
  );
}
