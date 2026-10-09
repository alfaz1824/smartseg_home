"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type TelemetryPoint = {
  fillPercentage: number;
  distanceCm: number;
  recordedAt: string;
};

export default function BinHistoryChart({
  telemetry,
}: {
  telemetry: TelemetryPoint[];
}) {
  const chartData = telemetry.map((item) => ({
    time: new Date(item.recordedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),

    fill: Number(item.fillPercentage.toFixed(1)),

    distance: Number(item.distanceCm.toFixed(1)),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* =====================================================
          FILL LEVEL CHART
      ===================================================== */}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

        <div className="mb-5">

          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            Live Telemetry
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Fill Level
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Historical waste fill percentage
          </p>

        </div>

        <div className="h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                unit="%"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                }}
              />

              <Line
                type="monotone"
                dataKey="fill"
                name="Fill"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* =====================================================
          DISTANCE CHART
      ===================================================== */}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

        <div className="mb-5">

          <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Ultrasonic Sensor
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Sensor Distance
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            HC-SR04 measured distance
          </p>

        </div>

        <div className="h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
              />

              <YAxis
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                unit=" cm"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                }}
              />

              <Line
                type="monotone"
                dataKey="distance"
                name="Distance"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}