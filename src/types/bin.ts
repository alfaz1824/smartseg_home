export type BinCategory =
  | "WET"
  | "DRY"
  | "E_WASTE_HAZARDOUS"
  | "SANITARY";

export type BinStatus =
  | "NORMAL"
  | "NEARLY_FULL"
  | "CRITICAL"
  | "OFFLINE"
  | "SENSOR_ERROR";

export type SensorHealth =
  | "HEALTHY"
  | "WARNING"
  | "DISCONNECTED"
  | "INVALID_READING";

export interface BinTelemetry {
  id: string;
  category: BinCategory;
  fillPercentage: number;
  distanceCm: number;
  remainingCapacity: number;
  status: BinStatus;
  sensorHealth: SensorHealth;
  communicationStatus: "ONLINE" | "OFFLINE";
  lastUpdated: string;
}