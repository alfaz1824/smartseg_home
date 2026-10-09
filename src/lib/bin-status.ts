import type { BinStatus } from "@/types/bin";
import { BIN_THRESHOLDS } from "@/lib/config/bin-thresholds";

export function calculateBinStatus(
  fillPercentage: number,
): BinStatus {
  if (fillPercentage >= BIN_THRESHOLDS.critical) {
    return "CRITICAL";
  }

  if (fillPercentage >= BIN_THRESHOLDS.nearlyFull) {
    return "NEARLY_FULL";
  }

  return "NORMAL";
}