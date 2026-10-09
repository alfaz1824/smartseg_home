export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertType =
  | "BIN_NEARLY_FULL"
  | "BIN_CRITICAL"
  | "LOW_CONFIDENCE"
  | "SENSOR_ERROR"
  | "DEVICE_OFFLINE"
  | "CAMERA_OFFLINE"
  | "SYSTEM_ERROR";

export type AlertStatus =
  | "ACTIVE"
  | "ACKNOWLEDGED"
  | "RESOLVED";

export interface SmartAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  binId?: string;
  timestamp: string;
  status: AlertStatus;
}