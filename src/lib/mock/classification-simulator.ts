import type { WasteClass } from "@/types/classification";
import { applyKBWDE } from "@/lib/kb-wde/decision-engine";

const classes: WasteClass[] = [
  "Battery",
  "Biological",
  "Brown Glass",
  "Cardboard",
  "Clothes",
  "Green Glass",
  "Metal",
  "Paper",
  "Plastic",
  "Shoes",
  "Trash",
  "White Glass",
];

export function generateClassificationEvent() {
  const predictedClass =
    classes[Math.floor(Math.random() * classes.length)];

  const confidence =
    Number((0.82 + Math.random() * 0.17).toFixed(3));

  const decision = applyKBWDE(predictedClass);

  return {
    id: `CLS-${Date.now()}`,
    timestamp: new Date().toISOString(),
    predictedClass,
    confidence,
    wasteCategory: decision.category,
    destinationBin: decision.destinationBin,
    processingTimeMs: Math.floor(90 + Math.random() * 100),
    deviceId: "DEVICE-001",
  };
}