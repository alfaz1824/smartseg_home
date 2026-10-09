"use client";

import { useEffect, useRef, useState } from "react";

import BinStatusCard from "@/components/dashboard/BinStatusCard";
import SystemHealthCard from "@/components/dashboard/SystemHealthCard";
import AIClassificationCard from "@/components/dashboard/AIClassificationCard";
import LiveClassificationFeed from "@/components/dashboard/LiveClassificationFeed";
import AlertCenter from "@/components/dashboard/AlertCenter";

import { mockSystemHealth } from "@/lib/mock/system-data";

import { createBinAlert } from "@/lib/alerts";
import { getBins } from "@/lib/services/bin-service";

import type { BinTelemetry } from "@/types/bin";
import type { ClassificationEvent } from "@/types/classification";
import type { SmartAlert } from "@/types/alert";

export default function DashboardPage() {
  // ============================================================
  // BIN STATE
  // ============================================================

  const [bins, setBins] = useState<BinTelemetry[]>([]);
  const [isLoadingBins, setIsLoadingBins] = useState(true);
  const [binError, setBinError] = useState<string | null>(null);

  // ============================================================
  // CLASSIFICATION STATE
  // ============================================================

  const [classificationEvents, setClassificationEvents] =
    useState<ClassificationEvent[]>([]);

  // ============================================================
  // ALERT STATE
  // ============================================================

  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const binsRef = useRef<BinTelemetry[]>([]);

  function applyUpdatedBin(updatedBin: BinTelemetry) {
    binsRef.current = binsRef.current.map((bin) =>
      bin.id === updatedBin.id ? updatedBin : bin,
    );

    setBins(binsRef.current);

    const alert = createBinAlert(updatedBin);

    if (!alert) {
      return;
    }

    setAlerts((currentAlerts) => {
      const alreadyExists = currentAlerts.some(
        (existingAlert) =>
          existingAlert.binId === updatedBin.id &&
          existingAlert.type === alert.type &&
          existingAlert.status === "ACTIVE",
      );

      if (alreadyExists) {
        return currentAlerts;
      }

      return [alert, ...currentAlerts].slice(0, 10);
    });
  }

  // ============================================================
  // LOAD + POLL REAL BIN TELEMETRY
  //
  // ESP32 → /api/telemetry → PostgreSQL → /api/bins → Dashboard
  //
  // The browser only READS telemetry here.
  // It does not generate or write fake fill values.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadBins() {
      try {
        setBinError(null);

        const data = await getBins();

        if (cancelled) {
          return;
        }

        binsRef.current = data;
        setBins(data);
      } catch (error) {
        console.error("Failed to load real SmartSeg bins:", error);

        if (!cancelled) {
          setBinError(
            "Unable to load SmartBin data from the backend.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBins(false);
        }
      }
    }

    // Initial load.
    loadBins();

    // Read fresh ESP32-backed values every 2 seconds.
    const interval = setInterval(loadBins, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // REAL AI CLASSIFICATION EVENTS
  //
  // Python CNN → KB-WDE → POST /api/classification
  // → PostgreSQL → GET /api/classification → Dashboard
  //
  // No browser-side random classification events.
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadClassificationEvents() {
      try {
        const response = await fetch("/api/classification?limit=6", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Classification API returned ${response.status}`,
          );
        }

        const payload = await response.json();

        if (cancelled) {
          return;
        }

        const events = Array.isArray(payload?.data)
          ? payload.data
          : [];

        setClassificationEvents(
          events as ClassificationEvent[],
        );
      } catch (error) {
        console.error(
          "Failed to load real AI classification events:",
          error,
        );
      }
    }

    loadClassificationEvents();

    // Keep the dashboard live while the Python classifier is running.
    const interval = setInterval(
      loadClassificationEvents,
      2000,
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">

      {/* ========================================================
          HEADER
      ========================================================= */}

      <header>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

          <p className="text-sm font-medium text-emerald-400">
            SmartSeg Home
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          SmartBin Overview
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor your smart waste system and AI
          classification in real time.
        </p>
      </header>

      {/* ========================================================
          SYSTEM HEALTH
      ========================================================= */}

      <section className="mt-8">
        <SystemHealthCard
          health={mockSystemHealth}
        />
      </section>

      {/* ========================================================
          LATEST AI CLASSIFICATION
      ========================================================= */}

      <section className="mt-6">
        {classificationEvents.length > 0 ? (
          <AIClassificationCard
            event={classificationEvents[0]}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Live AI Classification
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Awaiting classifier telemetry
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Waiting for an accepted CNN → KB-WDE classification
              from the physical camera system.
            </p>
          </div>
        )}
      </section>

      {/* ========================================================
          LIVE AI CLASSIFICATION FEED
      ========================================================= */}

      <section className="mt-6">
        <LiveClassificationFeed
          events={classificationEvents}
        />
      </section>

      {/* ========================================================
          SMART ALERTS
      ========================================================= */}

      <section className="mt-6">
        <AlertCenter
          alerts={alerts}
        />
      </section>

      {/* ========================================================
          SMART BINS
      ========================================================= */}

      <section className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              Your Smart Bins
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current fill levels and sensor health from the ESP32.
            </p>
          </div>

          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="text-xs font-medium text-emerald-400">
              LIVE ESP32 TELEMETRY
            </span>
          </div>

        </div>

        {/* ------------------------------------------------------
            LOADING STATE
        ------------------------------------------------------- */}

        {isLoadingBins && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-white/5 bg-slate-900"
              />
            ))}
          </div>
        )}

        {/* ------------------------------------------------------
            ERROR STATE
        ------------------------------------------------------- */}

        {!isLoadingBins && binError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm font-semibold text-red-400">
              Bin data unavailable
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {binError}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------
            SUCCESS STATE
        ------------------------------------------------------- */}

        {!isLoadingBins &&
          !binError &&
          bins.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {bins.map((bin) => (
                <BinStatusCard
                  key={bin.id}
                  bin={bin}
                />
              ))}
            </div>
          )}

        {/* ------------------------------------------------------
            EMPTY STATE
        ------------------------------------------------------- */}

        {!isLoadingBins &&
          !binError &&
          bins.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <p className="text-sm text-slate-400">
                No SmartBins found.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Add a device to begin monitoring.
              </p>
            </div>
          )}
      </section>

      {/* ========================================================
          SMARTSEG ARCHITECTURE
      ========================================================= */}

      <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

        <div>
          <p className="text-sm text-slate-400">
            SmartSeg Architecture
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            AI → Decision → Bin
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">

          <PipelineStep
            number="01"
            title="CNN"
            description="12-class prediction"
          />

          <PipelineConnector />

          <PipelineStep
            number="02"
            title="Confidence"
            description="Prediction reliability"
          />

          <PipelineConnector />

          <PipelineStep
            number="03"
            title="KB-WDE"
            description="Maps class to waste stream"
          />

        </div>

        <div className="my-5 h-px bg-white/5" />

        <div className="grid gap-4 md:grid-cols-5">

          <PipelineStep
            number="04"
            title="Destination"
            description="Selects physical bin"
          />

          <PipelineConnector />

          <PipelineStep
            number="05"
            title="Telemetry"
            description="Updates bin state"
          />

        </div>

      </section>

    </div>
  );
}

// ============================================================
// PIPELINE STEP
// ============================================================

function PipelineStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">

      <div className="flex items-center gap-3">

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
          {number}
        </span>

        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        </div>

      </div>

    </div>
  );
}

// ============================================================
// PIPELINE CONNECTOR
// ============================================================

function PipelineConnector() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <span className="text-xl text-slate-700">
        →
      </span>
    </div>
  );
}
