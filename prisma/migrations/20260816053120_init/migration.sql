-- CreateEnum
CREATE TYPE "BinCategory" AS ENUM ('WET', 'DRY', 'E_WASTE_HAZARDOUS', 'SANITARY');

-- CreateEnum
CREATE TYPE "BinStatus" AS ENUM ('NORMAL', 'NEARLY_FULL', 'CRITICAL', 'OFFLINE', 'SENSOR_ERROR');

-- CreateEnum
CREATE TYPE "SensorHealth" AS ENUM ('HEALTHY', 'WARNING', 'DISCONNECTED', 'INVALID_READING');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "Bin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BinCategory" NOT NULL,
    "status" "BinStatus" NOT NULL DEFAULT 'NORMAL',
    "sensorHealth" "SensorHealth" NOT NULL DEFAULT 'HEALTHY',
    "communicationStatus" "CommunicationStatus" NOT NULL DEFAULT 'ONLINE',
    "fillPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distanceCm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remainingCapacity" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BinTelemetry" (
    "id" TEXT NOT NULL,
    "binId" TEXT NOT NULL,
    "fillPercentage" DOUBLE PRECISION NOT NULL,
    "distanceCm" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BinTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bin_category_key" ON "Bin"("category");

-- CreateIndex
CREATE INDEX "BinTelemetry_binId_recordedAt_idx" ON "BinTelemetry"("binId", "recordedAt");

-- AddForeignKey
ALTER TABLE "BinTelemetry" ADD CONSTRAINT "BinTelemetry_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
