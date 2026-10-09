import type { WasteCategory } from "@/types/classification";
import type { BinCategory } from "@/types/bin";

export const categoryToBin: Record<
  Exclude<WasteCategory, "CONFIGURABLE">,
  BinCategory
> = {
  WET: "WET",
  DRY: "DRY",
  E_WASTE_HAZARDOUS: "E_WASTE_HAZARDOUS",
  SANITARY: "SANITARY",
};