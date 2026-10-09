import type { BinTelemetry } from "@/types/bin";

interface BinStatusCardProps {
  bin: BinTelemetry;
}

const categoryLabels: Record<BinTelemetry["category"], string> = {
  WET: "Wet Waste",
  DRY: "Dry Waste",
  E_WASTE_HAZARDOUS: "E-Waste / Hazardous",
  SANITARY: "Sanitary Waste",
};

const statusLabels: Record<BinTelemetry["status"], string> = {
  NORMAL: "Normal",
  NEARLY_FULL: "Nearly Full",
  CRITICAL: "Critical",
  OFFLINE: "Offline",
  SENSOR_ERROR: "Sensor Error",
};

const statusStyles: Record<BinTelemetry["status"], string> = {
  NORMAL: "bg-emerald-500/10 text-emerald-400",
  NEARLY_FULL: "bg-yellow-500/10 text-yellow-400",
  CRITICAL: "bg-red-500/10 text-red-400",
  OFFLINE: "bg-slate-500/10 text-slate-400",
  SENSOR_ERROR: "bg-red-500/10 text-red-400",
};

const fillBarStyles: Record<BinTelemetry["status"], string> = {
  NORMAL: "bg-emerald-400",
  NEARLY_FULL: "bg-yellow-400",
  CRITICAL: "bg-red-400",
  OFFLINE: "bg-slate-500",
  SENSOR_ERROR: "bg-red-400",
};

export default function BinStatusCard({ bin }: BinStatusCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {categoryLabels[bin.category]}
          </p>

          <h3 className="mt-1 text-3xl font-bold text-white">
            {bin.fillPercentage}%
          </h3>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[bin.status]}`}>
          {statusLabels[bin.status]}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>Fill level</span>
          <span>{bin.fillPercentage}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
  className={`h-full rounded-full transition-all ${fillBarStyles[bin.status]}`}
  style={{ width: `${bin.fillPercentage}%` }}
/>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Distance</p>
          <p className="mt-1 font-medium text-white">
            {bin.distanceCm} cm
          </p>
        </div>

        <div>
          <p className="text-slate-500">Remaining</p>
          <p className="mt-1 font-medium text-white">
            {bin.remainingCapacity}%
          </p>
        </div>

        <div>
          <p className="text-slate-500">Sensor</p>
          <p className="mt-1 font-medium text-emerald-400">
            {bin.sensorHealth}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Connection</p>
          <p className="mt-1 font-medium text-emerald-400">
            {bin.communicationStatus}
          </p>
        </div>
      </div>
    </div>
  );
}