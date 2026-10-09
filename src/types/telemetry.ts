import type { BinTelemetry } from "@/types/bin";

export interface CreateTelemetryInput {
  binId: string;
  fillPercentage: number;
  distanceCm: number;
}

export interface TelemetryReading {
  id: string;
  binId: string;
  fillPercentage: number;
  distanceCm: number;
  recordedAt: string;
}

export interface CreateTelemetryResult {
  bin: BinTelemetry;
  telemetry: TelemetryReading;
}
