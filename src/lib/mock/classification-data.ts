import type { ClassificationEvent } from "@/types/classification";

export const mockLatestClassification: ClassificationEvent = {
  id: "CLS-00001",
  timestamp: "2026-08-15T15:00:00.000Z",
  predictedClass: "Plastic",
  confidence: 0.978,
  wasteCategory: "DRY",
  destinationBin: "Dry Bin",
  processingTimeMs: 142,
  deviceId: "DEVICE-001",
};