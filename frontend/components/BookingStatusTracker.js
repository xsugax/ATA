export default function BookingStatusTracker({ stages, currentStage }) {
  const currentIdx = stages.indexOf(currentStage);

  return (
    <div className="glass rounded-2xl p-4">
      <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-sovereign">Booking Progress</p>
      <ol className="space-y-1.5">
        {stages.map((stage, idx) => {
          const isActive   = stage === currentStage;
          const isComplete = idx < currentIdx;
          return (
            <li key={stage} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs leading-snug transition ${
              isActive   ? "border-sovereign/50 bg-sovereign/15 text-sovereign" :
              isComplete ? "border-green-500/20 bg-green-500/8 text-green-400/80" :
                           "border-white/8 bg-white/3 text-platinum/35"
            }`}>
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                isActive   ? "bg-sovereign text-black" :
                isComplete ? "bg-green-500/30 text-green-400" :
                             "bg-white/10 text-platinum/30"
              }`}>
                {isComplete ? "✓" : idx + 1}
              </span>
              <span className="leading-tight">{stage}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 shrink-0 mt-1 rounded-full bg-sovereign animate-pulse" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
