import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bins = await prisma.bin.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const data = bins.map((bin) => ({
      id: bin.id,
      category: bin.category,
      fillPercentage: bin.fillPercentage,
      distanceCm: bin.distanceCm,
      remainingCapacity: bin.remainingCapacity,
      status: bin.status,
      sensorHealth: bin.sensorHealth,
      communicationStatus: bin.communicationStatus,
      lastUpdated: bin.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch bins:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch SmartBin data",
      },
      { status: 500 },
    );
  }
}