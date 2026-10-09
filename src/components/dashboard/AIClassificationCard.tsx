import type {
  ClassificationEvent,
  WasteCategory,
} from "@/types/classification";

interface AIClassificationCardProps {
  event: ClassificationEvent;
}

const categoryLabels: Record<WasteCategory, string> = {
  WET: "Wet Waste",
  DRY: "Dry Waste",
  E_WASTE_HAZARDOUS: "E-Waste / Hazardous",
  SANITARY: "Sanitary Waste",
  CONFIGURABLE: "Awaiting KB-WDE Rule",
};

function formatConfidence(confidence: number) {
  return `${(confidence * 100).toFixed(1)}%`;
}

export default function AIClassificationCard({
  event,
}: AIClassificationCardProps) {
  const highConfidence = event.confidence >= 0.85;

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">Latest AI Classification</p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {event.predictedClass}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            highConfidence
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {formatConfidence(event.confidence)}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <InfoRow
          label="Waste Category"
          value={categoryLabels[event.wasteCategory]}
        />

        <InfoRow
          label="Destination"
          value={event.destinationBin ?? "Not configured"}
        />

        <InfoRow
          label="Processing Time"
          value={`${event.processingTimeMs} ms`}
        />

        <InfoRow
          label="Device"
          value={event.deviceId}
        />
      </div>

      <div className="mt-5 rounded-xl bg-white/5 p-4">
        <p className="text-xs text-slate-500">Decision Status</p>

        <p
          className={`mt-1 text-sm font-semibold ${
            highConfidence
              ? "text-emerald-400"
              : "text-yellow-400"
          }`}
        >
          {highConfidence
            ? "High-confidence prediction"
            : "Low-confidence prediction"}
        </p>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}