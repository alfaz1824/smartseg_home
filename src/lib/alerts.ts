import type { BinTelemetry } from "@/types/bin";
import type { SmartAlert } from "@/types/alert";

export function createBinAlert(
  bin: BinTelemetry,
): SmartAlert | null {
  if (bin.status === "CRITICAL") {
    return {
      id: `ALERT-${bin.id}-${Date.now()}`,
      type: "BIN_CRITICAL",
      severity: "CRITICAL",
      title: `${bin.category} bin is critical`,
      message: `${bin.category} bin has reached ${bin.fillPercentage}%. Schedule collection immediately.`,
      binId: bin.id,
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
    };
  }

  if (bin.status === "NEARLY_FULL") {
    return {
      id: `ALERT-${bin.id}-${Date.now()}`,
      type: "BIN_NEARLY_FULL",
      severity: "WARNING",
      title: `${bin.category} bin is nearly full`,
      message: `${bin.category} bin has reached ${bin.fillPercentage}%. Consider emptying it soon.`,
      binId: bin.id,
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
    };
  }

  return null;
}