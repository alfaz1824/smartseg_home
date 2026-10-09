import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

// Keep these thresholds aligned with src/lib/config/bin-thresholds.ts
function calculateBinStatus(fillPercentage: number) {
  if (fillPercentage >= 90) {
    return "CRITICAL" as const;
  }

  if (fillPercentage >= 70) {
    return "NEARLY_FULL" as const;
  }

  return "NORMAL" as const;
}

async function main() {
  console.log("Seeding SmartSeg database...");

  const bins = [
    {
      name: "Wet Waste",
      category: "WET" as const,
      fillPercentage: 42,
      distanceCm: 24.5,
      remainingCapacity: 58,
    },
    {
      name: "Dry Waste",
      category: "DRY" as const,
      fillPercentage: 78,
      distanceCm: 12.4,
      remainingCapacity: 22,
    },
    {
      name: "E-Waste / Hazardous",
      category: "E_WASTE_HAZARDOUS" as const,
      fillPercentage: 18,
      distanceCm: 31.2,
      remainingCapacity: 82,
    },
    {
      name: "Sanitary Waste",
      category: "SANITARY" as const,
      fillPercentage: 51,
      distanceCm: 19.8,
      remainingCapacity: 49,
    },
  ];

  for (const bin of bins) {
    const status = calculateBinStatus(
      bin.fillPercentage,
    );

    await prisma.bin.upsert({
      where: {
        category: bin.category,
      },

      update: {
        name: bin.name,
        fillPercentage: bin.fillPercentage,
        distanceCm: bin.distanceCm,
        remainingCapacity: bin.remainingCapacity,
        status,
      },

      create: {
        name: bin.name,
        category: bin.category,
        fillPercentage: bin.fillPercentage,
        distanceCm: bin.distanceCm,
        remainingCapacity: bin.remainingCapacity,
        status,
      },
    });

    console.log(
      `✓ ${bin.name} → ${bin.fillPercentage}% → ${status}`,
    );
  }

  console.log(
    "SmartSeg bins seeded successfully.",
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });