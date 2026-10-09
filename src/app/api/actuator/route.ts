import { NextResponse } from "next/server";

const VALID_DESTINATIONS = [
  "WET",
  "DRY",
  "E_WASTE",
  "SANITARY",
] as const;

type Destination =
  (typeof VALID_DESTINATIONS)[number];

let pendingDestination: Destination | null = null;

let commandId = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const destination =
      body?.destination as Destination;

    if (
      !VALID_DESTINATIONS.includes(destination)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid destination. Use WET, DRY, E_WASTE or SANITARY.",
        },
        { status: 400 },
      );
    }

    commandId++;

    pendingDestination = destination;

    console.log(
      `[ACTUATOR] Command ${commandId}: ${destination}`,
    );

    return NextResponse.json({
      success: true,
      data: {
        commandId,
        destination,
        accepted: true,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {

    console.error(
      "Actuator request failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON request",
      },
      { status: 400 },
    );
  }
}


export async function GET() {

  return NextResponse.json({
    success: true,

    data: {
      commandId,
      destination: pendingDestination,
    },
  });
}