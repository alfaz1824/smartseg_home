"use client";

import { useEffect, useMemo, useState } from "react";

import BinHistoryChart from "@/components/dashboard/BinHistoryChart";

type Bin = {
  id: string;
  category: string;
  fillPercentage: number;
  distanceCm: number;
  remainingCapacity: number;
  status: string;
  sensorHealth: string;
  communicationStatus: string;
  lastUpdated: string;
};

type Telemetry = {
  id: string;
  fillPercentage: number;
  distanceCm: number;
  recordedAt: string;
};

export default function HistoryPage() {
  const [bins, setBins] = useState<Bin[]>([]);

  const [selectedBin, setSelectedBin] =
    useState<string>("");

  const [telemetry, setTelemetry] =
    useState<Telemetry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD BINS
  // ============================================================

  async function loadBins() {
    try {
      const response = await fetch(
        "/api/bins",
        {
          cache: "no-store",
        },
      );

      const json = await response.json();

      if (!json.success) {
        throw new Error(
          json.error || "Failed to load bins",
        );
      }

      setBins(json.data);

      if (
        json.data.length > 0 &&
        !selectedBin
      ) {
        setSelectedBin(json.data[0].id);
      }

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load SmartBin data.",
      );
    }
  }

  // ============================================================
  // LOAD HISTORY
  // ============================================================

  async function loadHistory(
    binId: string,
  ) {
    if (!binId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/bins/${binId}/history?limit=100`,
        {
          cache: "no-store",
        },
      );

      const json = await response.json();

      if (!json.success) {
        throw new Error(
          json.error ||
            "Failed to load telemetry",
        );
      }

      setTelemetry(
        json.data.telemetry,
      );

      setError(null);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load telemetry history.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadBins();
  }, []);

  // ============================================================
  // LOAD SELECTED BIN
  // ============================================================

  useEffect(() => {
    if (!selectedBin) {
      return;
    }

    setLoading(true);

    loadHistory(selectedBin);

  }, [selectedBin]);

  // ============================================================
  // LIVE REFRESH
  //
  // Refresh every 3 seconds to match ESP32 telemetry cadence.
  // ============================================================

  useEffect(() => {
    if (!selectedBin) {
      return;
    }

    const interval = setInterval(() => {
      loadHistory(selectedBin);
    }, 3000);

    return () => {
      clearInterval(interval);
    };

  }, [selectedBin]);

  // ============================================================
  // SELECTED BIN
  // ============================================================

  const selectedBinData =
    bins.find(
      (bin) => bin.id === selectedBin,
    );

  // ============================================================
  // ANALYTICS
  // ============================================================

  const analytics = useMemo(() => {

    if (telemetry.length === 0) {
      return {
        averageFill: 0,
        minimumFill: 0,
        maximumFill: 0,
      };
    }

    const values =
      telemetry.map(
        (item) =>
          item.fillPercentage,
      );

    const total = values.reduce(
      (sum, value) =>
        sum + value,
      0,
    );

    return {
      averageFill:
        total / values.length,

      minimumFill:
        Math.min(...values),

      maximumFill:
        Math.max(...values),
    };

  }, [telemetry]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="mb-8">

        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

          <p className="text-sm font-medium text-emerald-400">
            SmartSeg Analytics
          </p>

        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Bin Telemetry History
        </h1>

        <p className="mt-2 max-w-2xl text-slate-400">
          Monitor real-time ultrasonic sensor
          measurements and analyze historical
          SmartBin behavior.
        </p>

      </header>

      {/* ======================================================
          BIN SELECTOR
      ====================================================== */}

      <section className="mb-6">

        <div className="mb-3">

          <p className="text-sm font-medium text-slate-300">
            Select SmartBin
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {bins.map((bin) => (

            <button
              key={bin.id}
              onClick={() =>
                setSelectedBin(bin.id)
              }
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                selectedBin === bin.id
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >

              {bin.category.replace(
                "_",
                " ",
              )}

            </button>

          ))}

        </div>

      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>

      )}

      {/* ======================================================
          CURRENT BIN
      ====================================================== */}

      {selectedBinData && (

        <section className="mb-6">

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <p className="text-sm text-slate-400">
                  Currently monitoring
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {selectedBinData.category.replace(
                    "_",
                    " ",
                  )}
                </h2>

              </div>

              <div className="flex items-center gap-3">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selectedBinData.communicationStatus ===
                    "ONLINE"
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />

                <span className="text-sm text-slate-300">
                  {selectedBinData.communicationStatus}
                </span>

              </div>

            </div>

          </div>

        </section>

      )}

      {/* ======================================================
          LIVE METRICS
      ====================================================== */}

      <section className="mb-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {/* CURRENT FILL */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Current Fill
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">

              {selectedBinData
                ?.fillPercentage ?? 0}

              %

            </p>

          </div>

          {/* DISTANCE */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Sensor Distance
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">

              {selectedBinData
                ?.distanceCm ?? 0}

              <span className="ml-1 text-base font-normal text-slate-400">
                cm
              </span>

            </p>

          </div>

          {/* AVERAGE */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Average Fill
            </p>

            <p className="mt-2 text-3xl font-bold text-white">

              {analytics.averageFill.toFixed(
                1,
              )}

              %

            </p>

          </div>

          {/* RECORDS */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Telemetry Records
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {telemetry.length}
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          CHARTS
      ====================================================== */}

      {loading && telemetry.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />

          <p className="text-slate-400">
            Loading telemetry...
          </p>

        </div>

      ) : (

        <>

          <BinHistoryChart
            telemetry={telemetry}
          />

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section className="mt-6">

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                <p className="text-sm text-slate-400">
                  Minimum Fill
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {analytics.minimumFill.toFixed(
                    1,
                  )}
                  %
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                <p className="text-sm text-slate-400">
                  Maximum Fill
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {analytics.maximumFill.toFixed(
                    1,
                  )}
                  %
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                <p className="text-sm text-slate-400">
                  Sensor Health
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {selectedBinData
                    ?.sensorHealth ??
                    "UNKNOWN"}
                </p>

              </div>

            </div>

          </section>

        </>

      )}

    </div>
  );
}