import type {
  CreateTelemetryInput,
  CreateTelemetryResult,
} from "@/types/telemetry";

interface TelemetryApiResponse {
  success: boolean;
  data?: CreateTelemetryResult;
  error?: string;
}

export async function postTelemetryReading(
  input: CreateTelemetryInput,
): Promise<CreateTelemetryResult> {
  const response = await fetch("/api/telemetry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result =
    (await response.json()) as TelemetryApiResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.error ?? "Failed to write telemetry reading",
    );
  }

  return result.data;
}
