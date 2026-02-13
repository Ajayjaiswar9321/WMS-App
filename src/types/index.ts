// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  type: 'system' | 'custom';
  createdAt: string;
}

// Device Types
export interface Device {
  id: string;
  barcode: string;
  serialNumber: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  processor?: string;
  ram?: string;
  storage?: string;
  displaySize?: string;
  status: DeviceStatus;
  grade?: DeviceGrade;
  location?: string;
  batchId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeviceCategory =
  | 'Laptop'
  | 'Desktop'
  | 'Workstation'
  | 'Server'
  | 'Monitor'
  | 'Storage'
  | 'Networking'
  | 'Other';

export type DeviceStatus =
  | 'received'
  | 'pending_inspection'
  | 'under_inspection'
  | 'waiting_spares'
  | 'ready_repair'
  | 'under_repair'
  | 'in_l3_repair'
  | 'in_display_repair'
  | 'in_battery_repair'
  | 'in_paint_shop'
  | 'awaiting_qc'
  | 'under_qc'
  | 'qc_passed'
  | 'qc_failed'
  | 'ready_stock'
  | 'stock_out'
  | 'dispatched';

export type DeviceGrade = 'A' | 'B' | 'C' | 'D';

// Batch Types
export interface Batch {
  id: string;
  batchNumber: string;
  type: 'refurb' | 'rental_return';
  status: 'pending' | 'in_progress' | 'completed';
  customerName: string;
  rentalInvoiceNumber?: string;
  vehicleNumber: string;
  driverName: string;
  courierPartner: string;
  challanUrl?: string;
  batchDate: string;
  notes?: string;
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

// Inspection Types
export interface Inspection {
  id: string;
  deviceId: string;
  inspectorId: string;
  findings: InspectionFinding[];
  notes?: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface InspectionFinding {
  category: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

// Spare Part Types
export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  location: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
}

export interface SparePartUsage {
  id: string;
  sparePartId: string;
  deviceId: string;
  quantity: number;
  usedBy: string;
  usedAt: string;
}

// Repair Types
export interface Repair {
  id: string;
  deviceId: string;
  type: 'l2' | 'l3' | 'display' | 'battery';
  status: 'pending' | 'in_progress' | 'completed' | 'needs_spares';
  technicianId: string;
  diagnosis?: string;
  actions?: string;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

// Paint Shop Types
export interface PaintJob {
  id: string;
  deviceId: string;
  panelType: string;
  status: 'pending' | 'in_paint' | 'completed';
  vendor?: string;
  sentAt?: string;
  receivedAt?: string;
  notes?: string;
}

// QC Types
export interface QualityCheck {
  id: string;
  deviceId: string;
  inspectorId: string;
  status: 'pending' | 'passed' | 'failed';
  checks: QCCheckItem[];
  notes?: string;
  createdAt: string;
}

export interface QCCheckItem {
  name: string;
  passed: boolean;
  notes?: string;
}

// Outward Types
export interface Dispatch {
  id: string;
  type: 'sales' | 'rental';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  devices: string[];
  status: 'pending' | 'dispatched' | 'delivered';
  trackingNumber?: string;
  courierPartner?: string;
  dispatchDate?: string;
  notes?: string;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalDevices: number;
  pendingInspection: number;
  underInspection: number;
  waitingSpares: number;
  readyForRepair: number;
  underRepair: number;
  inL3Repair: number;
  inDisplayRepair: number;
  inBatteryRepair: number;
  inPaintShop: number;
  awaitingQC: number;
  underQC: number;
  qcPassed: number;
  readyStock: number;
  inRepairWorkflow: number;
}

export interface WeeklyFlow {
  inward: number[];
  outward: number[];
  qcPassed: number[];
}

// App State
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  currentRoute: string;
}
