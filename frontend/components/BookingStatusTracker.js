export default function BookingStatusTracker({ stages, currentStage }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h4 className="mb-3 text-sm uppercase tracking-[0.25em] text-sovereign">Booking Status Tracker</h4>
      <ol className="space-y-2">
        {stages.map((stage) => {
          const active = stage === currentStage;
          return (
            <li key={stage} className={`rounded-lg border px-3 py-2 text-sm ${active ? "border-sovereign bg-sovereign/20 text-sovereign" : "border-white/10 bg-white/5 text-platinum/70"}`}>
              {stage}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
