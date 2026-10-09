import { wasteRules } from "./rules";
import type { WasteClass } from "@/types/classification";

export function applyKBWDE(predictedClass: WasteClass) {
  return wasteRules[predictedClass];
}