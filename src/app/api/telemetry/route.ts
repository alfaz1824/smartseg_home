import { NextResponse } from "next/server";

import {
  createTelemetryReading,
  parseTelemetryInput,
  TelemetryServiceError,
} from "@/lib/services/telemetry-service";

export async function POST(request: Request) {
  try {
    const input = parseTelemetryInput(
      await request.json(),
    );
    const data = await createTelemetryReading(input);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Request body must be valid JSON",
        },
        { status: 400 },
      );
    }

    if (error instanceof TelemetryServiceError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode },
      );
    }

    console.error(
      "Failed to process telemetry:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process telemetry",
      },
      { status: 500 },
    );
  }
}
