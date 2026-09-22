export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'active' | 'investigating' | 'closed' | 'resolved';
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'responding' | 'contained' | 'resolved';
export type UnitStatus = 'patrol' | 'responding' | 'standby' | 'staging' | 'offline';
export type SignalStrength = 'strong' | 'medium' | 'weak';

export interface Incident {
  id: string;
  type: string;
  status: IncidentStatus;
  severity: Severity;
  date: string;
  location: string;
  victim: string;
  suspect: string;
  officer: string;
  evidence: number;
  witnesses: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  code: string;
  type: string;
  location: string;
  priority: AlertPriority;
  status: AlertStatus;
  units: string[];
  time: string;
  dispatchedAt: string;
  resolvedAt?: string;
}

export interface Unit {
  id: string;
  officer: string;
  status: UnitStatus;
  zone: string;
  battery: number;
  signal: SignalStrength;
  location?: { lat: number; lng: number };
  lastSeen?: string;
}

export interface Message {
  id: number;
  from: string;
  msg: string;
  time: string;
  priority: 'critical' | 'high' | 'normal';
}

export interface Stats {
  totalIncidents: number;
  clearanceRate: number;
  avgResponseTime: number;
  activeUnits: number;
  alertsActive: number;
  modelAccuracy: number;
  riskLevel: string;
  uptime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateIncidentInput {
  type: string;
  severity: Severity;
  location: string;
  victim: string;
  suspect?: string;
  description?: string;
}

export interface UpdateIncidentInput {
  type?: string;
  status?: IncidentStatus;
  severity?: Severity;
  location?: string;
  victim?: string;
  suspect?: string;
  officer?: string;
  description?: string;
}
