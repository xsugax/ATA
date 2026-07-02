"use client";

import Link from "next/link";
import { useState } from "react";
import { authHeaders, fetchJson, logRevision } from "../lib/api";

export default function CelebrityCard({ celebrity, availabilityDate }) {
  const [status, setStatus] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);

  const checkAvailability = async () => {
    if (!availabilityDate) {
      setStatus("Choose a date first to check availability.");
      return;
    }

    try {
      const result = await fetchJson(`/celebrities/${celebrity.id}/availability?date=${availabilityDate}`);
      logRevision("AVAILABILITY_CHECK", `${celebrity.name} on ${availabilityDate}: ${result.available ? "Available" : "Unavailable"}`);
      setStatus(result.available ? `Available: ${result.date}` : `Unavailable: ${result.reason}`);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const messageRepresentative = async () => {
    try {
      const result = await fetchJson("/messages/send", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          celebrityId: celebrity.id,
          priority: "Priority",
          body: `Requesting representation call regarding ${celebrity.name} availability, terms, and security protocol.`,
        }),
      });
      logRevision("MESSAGE_SENT", `Representative message sent for ${celebrity.name}`);
      setStatus(result.acknowledgement.body);
    } catch (error) {
      setStatus(`${error.message} (login from Access page first)`);
    }
  };

  return (
    <article className="glass rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-aura">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{celebrity.name}</h3>
        <span className="rounded-full bg-sovereign/20 px-2 py-1 text-[10px] uppercase tracking-wider text-sovereign">Verified</span>
      </div>
      <img
        src={celebrity.portrait}
        alt={celebrity.name}
        className="aspect-[4/5] w-full cursor-zoom-in rounded-xl object-cover"
        onClick={() => setIsImageOpen(true)}
        loading="lazy"
      />
      <div className="mt-3 space-y-1 text-sm text-platinum/80">
        <p>{celebrity.category} · {celebrity.region}</p>
        <p>Starting at ${celebrity.startingPrice.toLocaleString()}</p>
        <p>Demand: {celebrity.demandIndex}% · Reach: {celebrity.socialReachMillions}M</p>
        <p>Agency: {celebrity.agencyRepresentation}</p>
        <p>Risk: <span className="uppercase">{celebrity.riskIndex}</span> · NDA: {celebrity.ndaDefault ? "Required" : "Optional"}</p>
      </div>
      {celebrity.reservationWindows?.length ? (
        <div className="mt-3 rounded-xl border border-sovereign/20 bg-sovereign/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sovereign">Private hotel windows</p>
          <div className="mt-2 space-y-2 text-xs text-platinum/70">
            {celebrity.reservationWindows.slice(0, 2).map((window) => (
              <p key={`${window.date}-${window.place}`}>{window.date} · {window.place}</p>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 grid gap-2">
        <Link href={`/booking/${celebrity.id}`} className="flex-1 rounded-lg bg-sovereign px-3 py-2 text-center text-xs font-semibold uppercase text-black">Book Now</Link>
        <button type="button" onClick={checkAvailability} className="rounded-lg border border-sovereign/35 bg-black/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sovereign">Check Availability</button>
        <button type="button" onClick={messageRepresentative} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-platinum">Message Representative</button>
      </div>
      {status ? <p className="mt-3 text-xs text-sovereign">{status}</p> : null}

      {isImageOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/88 p-3 sm:p-4" onClick={() => setIsImageOpen(false)}>
          <div className="relative w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsImageOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-platinum"
            >
              Close
            </button>
            <img src={celebrity.portrait} alt={celebrity.name} className="max-h-[84dvh] w-full rounded-2xl object-contain" />
          </div>
        </div>
      ) : null}
    </article>
  );
}
