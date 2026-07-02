"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../../components/NavBar";
import { fetchJson, authHeaders, logRevision } from "../../lib/api";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

function SlotBar({ claimed, total }) {
  const pct = Math.round((claimed / total) * 100);
  const remaining = total - claimed;
  const color = remaining === 0 ? "bg-red-500/60" : remaining <= 5 ? "bg-amber-500/70" : "bg-sovereign";
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-platinum/50 mb-1">
        <span>{remaining === 0 ? "Fully Claimed" : `${remaining} of ${total} slots remaining`}</span>
        <span>{pct}% claimed</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CrowdPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    fetchJson("/crowd-events")
      .then((res) => {
        setEvents(res.events || res.data || res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const joinEvent = async (eventId, eventName) => {
    setJoining(eventId);
    try {
      const res = await fetchJson(`/crowd-events/${eventId}/join`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({}),
      });
      logRevision("CROWD_ACCESS_JOINED", `Joined crowd event: ${eventName}`);
      setStatus((prev) => ({ ...prev, [eventId]: res.message || "Successfully registered!" }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        [eventId]: err.message.includes("login") ? "Login required — visit the Access page first." : err.message,
      }));
    } finally {
      setJoining(null);
    }
  };

  return (
    <main className="space-y-5">
      <NavBar />

      {/* Header */}
      <motion.section {...fade(0)} className="glass rounded-2xl px-6 py-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-sovereign">All Talents Agency</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Crowd Access Events</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-platinum/55 leading-relaxed">
          Limited-slot curated experiences with the world's biggest names. VIP tables, private
          meet & greets, backstage access, signed memorabilia, and exclusive after-parties.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-[10px] uppercase tracking-widest text-platinum/40">
          <span>Verified Talent</span>
          <span className="text-sovereign">·</span>
          <span>NDA Protected</span>
          <span className="text-sovereign">·</span>
          <span>Instalment Plans Available</span>
          <span className="text-sovereign">·</span>
          <span>Global Cities</span>
        </div>
      </motion.section>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/3 p-5" style={{ animation: "pulse 1.8s ease-in-out infinite" }}>
              <div className="mb-3 h-4 w-2/3 rounded bg-sovereign/15" />
              <div className="h-3 w-1/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-platinum/50 text-sm">No crowd events available at this time.</p>
          <p className="mt-2 text-xs text-platinum/30">Check back soon or contact your relationship manager.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((ev, i) => {
            const remaining = ev.slots - ev.claimed;
            const isFull = remaining <= 0;
            return (
              <motion.article
                key={ev.id}
                {...fade(i * 0.07)}
                className="glass rounded-2xl p-5 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-aura"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold leading-tight">{ev.name}</h2>
                      <p className="mt-0.5 text-xs text-platinum/55">{ev.city} · {new Date(ev.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold ${isFull ? "bg-red-500/20 text-red-400" : remaining <= 5 ? "bg-amber-500/20 text-amber-400" : "bg-sovereign/20 text-sovereign"}`}>
                      {isFull ? "Sold Out" : remaining <= 5 ? "Almost Full" : "Open"}
                    </span>
                  </div>

                  <p className="mt-4 text-xl font-semibold text-sovereign">
                    ${ev.pricePerSlot.toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-platinum/40">/ slot</span>
                  </p>

                  <SlotBar claimed={ev.claimed} total={ev.slots} />

                  {ev.includes?.length ? (
                    <ul className="mt-4 space-y-1.5">
                      {ev.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-platinum/70">
                          <span className="text-sovereign text-[10px]">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {ev.installments?.length ? (
                    <div className="mt-4 rounded-xl border border-sovereign/15 bg-sovereign/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-sovereign mb-2">Instalment Options</p>
                      <div className="flex flex-wrap gap-3">
                        {ev.installments.map((inst) => (
                          <div key={inst.months} className="text-xs text-platinum/65">
                            {inst.months}mo · <span className="text-platinum">${inst.monthly.toLocaleString()}/mo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5">
                  {status[ev.id] ? (
                    <p className="mb-3 text-xs text-sovereign">{status[ev.id]}</p>
                  ) : null}
                  <button
                    type="button"
                    disabled={isFull || joining === ev.id}
                    onClick={() => joinEvent(ev.id, ev.name)}
                    className="w-full rounded-lg bg-sovereign px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-sovereign/80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {joining === ev.id ? "Reserving…" : isFull ? "Fully Claimed" : "Reserve Slot"}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </main>
  );
}
