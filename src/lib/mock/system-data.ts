import type { SystemHealth } from "@/types/system";

export const mockSystemHealth: SystemHealth = {
  systemStatus: "ONLINE",
  connectedDevices: 1,
  totalDevices: 1,
  healthySensors: 4,
  totalSensors: 4,
  aiStatus: "READY",
  cameraStatus: "CONNECTED",
  lastEventAt: "2026-08-15T15:00:00.000Z",
};