import type {
  WasteCategory,
  WasteClass,
} from "@/types/classification";

export interface WasteRule {
  category: WasteCategory;
  destinationBin: string | null;
  recyclability: "RECYCLABLE" | "NON_RECYCLABLE" | "HAZARDOUS" | "CONFIGURE";
}

export const wasteRules: Record<WasteClass, WasteRule> = {
  Battery: {
    category: "E_WASTE_HAZARDOUS",
    destinationBin: "E-Waste / Hazardous Bin",
    recyclability: "HAZARDOUS",
  },

  Biological: {
    category: "WET",
    destinationBin: "Wet Bin",
    recyclability: "NON_RECYCLABLE",
  },

  "Brown Glass": {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Cardboard: {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Clothes: {
    category: "CONFIGURABLE",
    destinationBin: null,
    recyclability: "CONFIGURE",
  },

  "Green Glass": {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Metal: {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Paper: {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Plastic: {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },

  Shoes: {
    category: "CONFIGURABLE",
    destinationBin: null,
    recyclability: "CONFIGURE",
  },

  Trash: {
    category: "CONFIGURABLE",
    destinationBin: null,
    recyclability: "CONFIGURE",
  },

  "White Glass": {
    category: "DRY",
    destinationBin: "Dry Bin",
    recyclability: "RECYCLABLE",
  },
};