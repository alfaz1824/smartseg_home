import { prisma } from "@/lib/prisma";
import { calculateBinStatus } from "@/lib/bin-status";

import type {
  CreateTelemetryInput,
  CreateTelemetryResult,
} from "@/types/telemetry";

export class TelemetryServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "TelemetryServiceError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseTelemetryInput(
  value: unknown,
): CreateTelemetryInput {
  if (!isRecord(value)) {
    throw new TelemetryServiceError(
      "Request body must be a JSON object",
      400,
    );
  }

  const { binId, fillPercentage, distanceCm } = value;

  if (
    typeof binId !== "string" ||
    binId.trim().length === 0 ||
    typeof fillPercentage !== "number" ||
    typeof distanceCm !== "number"
  ) {
    throw new TelemetryServiceError(
      "binId, fillPercentage and distanceCm are required",
      400,
    );
  }

  if (
    !Number.isFinite(fillPercentage) ||
    fillPercentage < 0 ||
    fillPercentage > 100
  ) {
    throw new TelemetryServiceError(
      "fillPercentage must be a finite number between 0 and 100",
      400,
    );
  }

  if (!Number.isFinite(distanceCm) || distanceCm < 0) {
    throw new TelemetryServiceError(
      "distanceCm must be a finite non-negative number",
      400,
    );
  }

  return {
    binId: binId.trim(),
    fillPercentage,
    distanceCm,
  };
}

export async function createTelemetryReading(
  input: CreateTelemetryInput,
): Promise<CreateTelemetryResult> {
  const bin = await prisma.bin.findUnique({
    where: {
      id: input.binId,
    },
  });

  if (!bin) {
    throw new TelemetryServiceError("Bin not found", 404);
  }

  const remainingCapacity = 100 - input.fillPercentage;
  const status = calculateBinStatus(input.fillPercentage);

  const result = await prisma.$transaction(async (tx) => {
    const updatedBin = await tx.bin.update({
      where: {
        id: bin.id,
      },
      data: {
        fillPercentage: input.fillPercentage,
        distanceCm: input.distanceCm,
        remainingCapacity,
        status,
      },
    });

    const telemetry = await tx.binTelemetry.create({
      data: {
        binId: bin.id,
        fillPercentage: input.fillPercentage,
        distanceCm: input.distanceCm,
      },
    });

    return {
      updatedBin,
      telemetry,
    };
  });

  return {
    bin: {
      id: result.updatedBin.id,
      category: result.updatedBin.category,
      fillPercentage: result.updatedBin.fillPercentage,
      distanceCm: result.updatedBin.distanceCm,
      remainingCapacity: result.updatedBin.remainingCapacity,
      status: result.updatedBin.status,
      sensorHealth: result.updatedBin.sensorHealth,
      communicationStatus:
        result.updatedBin.communicationStatus,
      lastUpdated: result.updatedBin.updatedAt.toISOString(),
    },
    telemetry: {
      id: result.telemetry.id,
      binId: result.telemetry.binId,
      fillPercentage: result.telemetry.fillPercentage,
      distanceCm: result.telemetry.distanceCm,
      recordedAt: result.telemetry.recordedAt.toISOString(),
    },
  };
}
