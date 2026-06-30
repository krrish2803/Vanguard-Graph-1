export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum AlertType {
  HIGH_RISK_SCORE = 'HIGH_RISK_SCORE',
  VELOCITY_BREACH = 'VELOCITY_BREACH',
  FRAUD_RING = 'FRAUD_RING',
  GEO_MISMATCH = 'GEO_MISMATCH',
  BLOCKED_TRANSACTION = 'BLOCKED_TRANSACTION',
}

export interface Alert {
  id: string;
  transactionId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  riskScore: number;
  triggeredRules: string[];
  description: string;
  assignedTo?: string;       // analyst id
  resolution?: string;       // resolve/dismiss karte waqt note
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  transactionId: string;
  type: AlertType;
  riskScore: number;
  triggeredRules: string[];
  description?: string;
}

export interface AlertFilters {
  status?: AlertStatus;
  severity?: AlertSeverity;
}