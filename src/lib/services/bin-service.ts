import type { BinTelemetry } from "@/types/bin";

interface GetBinsResponse {
  success: boolean;
  data: BinTelemetry[];
}

export async function getBins(): Promise<BinTelemetry[]> {
  const response = await fetch("/api/bins");

  if (!response.ok) {
    throw new Error("Failed to fetch bin data");
  }

  const result =
    (await response.json()) as GetBinsResponse;

  if (!result.success) {
    throw new Error(
      "SmartSeg API returned an unsuccessful response",
    );
  }

  return result.data;
}