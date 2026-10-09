
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ binId: string }> },
) {
  try {
    const { binId } = await context.params;

    const { searchParams } = new URL(request.url);

    const limitParam = searchParams.get("limit");

    const limit = Math.min(
      Math.max(Number(limitParam) || 50, 1),
      500,
    );

    const bin = await prisma.bin.findUnique({
      where: {
        id: binId,
      },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    if (!bin) {
      return NextResponse.json(
        {
          success: false,
          error: "Bin not found",
        },
        { status: 404 },
      );
    }

    const telemetry = await prisma.binTelemetry.findMany({
      where: {
        binId,
      },
      orderBy: {
        recordedAt: "asc",
      },
      take: limit,
      select: {
        id: true,
        fillPercentage: true,
        distanceCm: true,
        recordedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        bin,
        telemetry: telemetry.map((reading) => ({
          ...reading,
          recordedAt: reading.recordedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch telemetry history:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch telemetry history",
      },
      { status: 500 },
    );
  }
}