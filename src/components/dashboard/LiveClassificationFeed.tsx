import type { ClassificationEvent } from "@/types/classification";

interface LiveClassificationFeedProps {
  events: ClassificationEvent[];
}

export default function LiveClassificationFeed({
  events,
}: LiveClassificationFeedProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Live AI Activity
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Classification Feed
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          LIVE
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {event.predictedClass}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {event.deviceId}
                </p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                {(event.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-purple-400">
                {event.wasteCategory}
              </span>

              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
                → {event.destinationBin ?? "Rule Required"}
              </span>

              <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-400">
                {event.processingTimeMs} ms
              </span>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No classification events yet.
          </div>
        )}
      </div>
    </section>
  );
}