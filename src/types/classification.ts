export type WasteClass =
  | "Battery"
  | "Biological"
  | "Brown Glass"
  | "Cardboard"
  | "Clothes"
  | "Green Glass"
  | "Metal"
  | "Paper"
  | "Plastic"
  | "Shoes"
  | "Trash"
  | "White Glass";

export type WasteCategory =
  | "WET"
  | "DRY"
  | "E_WASTE_HAZARDOUS"
  | "SANITARY"
  | "CONFIGURABLE";

export interface ClassificationEvent {
  id: string;
  timestamp: string;
  predictedClass: WasteClass;
  confidence: number;
  wasteCategory: WasteCategory;
  destinationBin: string | null;
  processingTimeMs: number;
  deviceId: string;
}