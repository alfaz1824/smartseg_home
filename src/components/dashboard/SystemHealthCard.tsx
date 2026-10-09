"use client";

import { useEffect, useState } from "react";
import type { SystemHealth } from "@/types/system";

interface SystemHealthCardProps {
  health: SystemHealth;
}

export default function SystemHealthCard({
  health,
}: SystemHealthCardProps) {
  const isOnline = health.systemStatus === "ONLINE";

  const [lastEventText, setLastEventText] = useState("Just now");

  useEffect(() => {
    const updateTime = () => {
      setLastEventText(formatRelativeTime(health.lastEventAt));
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [health.lastEventAt]);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">
            System Status
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isOnline
                  ? "bg-emerald-400"
                  : "bg-red-400"
              }`}
            />

            <h2 className="text-2xl font-bold text-white">
              {health.systemStatus}
            </h2>
          </div>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Live System
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <Metric
          label="Devices"
          value={`${health.connectedDevices}/${health.totalDevices}`}
        />

        <Metric
          label="Sensors"
          value={`${health.healthySensors}/${health.totalSensors}`}
        />

        <Metric
          label="AI"
          value={health.aiStatus}
        />

        <Metric
          label="Camera"
          value={health.cameraStatus}
        />

        <Metric
          label="Last Event"
          value={lastEventText}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function formatRelativeTime(timestamp: string) {
  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(timestamp).getTime()) /
        1000,
    ),
  );

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);

  return `${minutes}m ago`;
}