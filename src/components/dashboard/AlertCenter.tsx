import type { SmartAlert } from "@/types/alert";

interface AlertCenterProps {
  alerts: SmartAlert[];
}

const severityStyles = {
  INFO: "border-blue-500/20 bg-blue-500/5 text-blue-400",
  WARNING: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
  CRITICAL: "border-red-500/20 bg-red-500/5 text-red-400",
};

export default function AlertCenter({
  alerts,
}: AlertCenterProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Attention Required
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Smart Alerts
          </h2>
        </div>

        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
          {alerts.length} active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-emerald-400">
              All systems normal
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No active alerts require your attention.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${
                severityStyles[alert.severity]
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    {alert.title}
                  </p>

                  <p className="mt-1 text-xs opacity-80">
                    {alert.message}
                  </p>
                </div>

                <span className="text-[10px] font-bold uppercase">
                  {alert.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}