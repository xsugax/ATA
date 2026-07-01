export default function BookingStatusTracker({ stages, currentStage }) {
  const currentIndex = Math.max(0, stages.indexOf(currentStage));

  return (
    <div className="glass rounded-2xl p-4 xl:sticky xl:top-6">
      <h4 className="mb-3 text-sm uppercase tracking-[0.25em] text-sovereign">Booking Status Tracker</h4>
      <ol className="space-y-2">
        {stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <li
              key={stage}
              className={`rounded-xl border px-3 py-2 text-sm leading-snug ${
                isActive
                  ? "border-sovereign bg-sovereign/20 text-sovereign shadow-[0_0_0_1px_rgba(148,180,216,0.2)]"
                  : isComplete
                    ? "border-white/10 bg-white/5 text-platinum/70"
                    : "border-white/5 bg-black/10 text-platinum/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${isActive ? "bg-sovereign text-black" : isComplete ? "bg-white/10 text-sovereign" : "bg-white/5 text-platinum/35"}`}>
                  {index + 1}
                </span>
                <span>{stage}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
