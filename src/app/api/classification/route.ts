import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

function toLimit(value: string | null) {
  const parsed = Number(value ?? DEFAULT_LIMIT);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    MAX_LIMIT,
    Math.max(1, Math.floor(parsed)),
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = toLimit(url.searchParams.get("limit"));

    const rows = await prisma.classificationLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const data = rows.map((row) => ({
      id: row.id,
      predictedClass: row.predictedClass,
      // Dashboard/UI convention: confidence is 0..1.
      confidence: row.confidence,
      wasteCategory: row.wasteCategory,
      destinationBin: row.destinationBin,
      processingTime: row.processingTimeMs,
      processingTimeMs: row.processingTimeMs,
      // Current Prisma model does not contain a deviceId field.
      // Keep a truthful fixed identifier for this physical camera node.
      deviceId: "SMARTSEG-CAM-01",
      timestamp: row.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/classification failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load classification events.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const predictedClass =
      typeof body.predictedClass === "string"
        ? body.predictedClass.trim()
        : "";

    const wasteCategory =
      typeof body.wasteCategory === "string"
        ? body.wasteCategory.trim()
        : "";

    const destinationBin =
      typeof body.destinationBin === "string"
        ? body.destinationBin.trim()
        : "";

    const confidence = Number(body.confidence);
    const processingTimeMs = Number(body.processingTimeMs);

    if (
      !predictedClass ||
      !wasteCategory ||
      !destinationBin ||
      !Number.isFinite(confidence) ||
      confidence < 0 ||
      confidence > 1 ||
      !Number.isFinite(processingTimeMs) ||
      processingTimeMs < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid classification payload.",
        },
        { status: 400 },
      );
    }

    const allowedDestinations = new Set([
      "WET",
      "DRY",
      "E_WASTE",
      "SANITARY",
    ]);

    if (!allowedDestinations.has(destinationBin)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid destination: ${destinationBin}`,
        },
        { status: 400 },
      );
    }

    const row = await prisma.classificationLog.create({
      data: {
        predictedClass,
        confidence,
        wasteCategory,
        destinationBin,
        processingTimeMs: Math.round(processingTimeMs),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: row.id,
          predictedClass: row.predictedClass,
          confidence: row.confidence,
          wasteCategory: row.wasteCategory,
          destinationBin: row.destinationBin,
          processingTime: row.processingTimeMs,
          processingTimeMs: row.processingTimeMs,
          deviceId: "SMARTSEG-CAM-01",
          timestamp: row.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/classification failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to store classification event.",
      },
      { status: 500 },
    );
  }
}
