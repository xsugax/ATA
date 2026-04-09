"use client";

import { useEffect, useState } from "react";
import { getRevisionLog } from "../lib/api";

export default function RevisionLog() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const refresh = () => setEntries(getRevisionLog());
    refresh();
    window.addEventListener("aurelux:revision-updated", refresh);
    return () => window.removeEventListener("aurelux:revision-updated", refresh);
  }, []);

  return (
    <section className="glass mt-3 rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-[0.25em] text-sovereign">Revision Log</h3>
        <span className="text-[10px] text-platinum/40">{entries.length} actions</span>
      </div>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-platinum/65">No events yet. Actions like login, availability checks, messages, and bookings will appear here.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
              <p className="font-semibold text-sovereign">{entry.action}</p>
              <p className="text-platinum/80">{entry.detail}</p>
              <p className="mt-1 text-platinum/55">{new Date(entry.at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
