export type SystemStatus = "ONLINE" | "OFFLINE" | "DEGRADED";
export type ServiceStatus = "READY" | "CONNECTED" | "OFFLINE" | "ERROR";

export interface SystemHealth {
  systemStatus: SystemStatus;
  connectedDevices: number;
  totalDevices: number;
  healthySensors: number;
  totalSensors: number;
  aiStatus: ServiceStatus;
  cameraStatus: ServiceStatus;
  lastEventAt: string;
}