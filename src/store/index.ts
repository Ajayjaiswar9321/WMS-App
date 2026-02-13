import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Role, Device, Batch, Inspection, SparePart,
  Repair, PaintJob, QualityCheck, Dispatch
} from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface DataState {
  // Data
  users: User[];
  roles: Role[];
  devices: Device[];
  batches: Batch[];
  inspections: Inspection[];
  spareParts: SparePart[];
  repairs: Repair[];
  paintJobs: PaintJob[];
  qualityChecks: QualityCheck[];
  dispatches: Dispatch[];

  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  setDevices: (devices: Device[]) => void;
  setBatches: (batches: Batch[]) => void;
  addBatch: (batch: Batch) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  addSparePart: (part: SparePart) => void;
  updateSparePart: (id: string, updates: Partial<SparePart>) => void;
  addRepair: (repair: Repair) => void;
  updateRepair: (id: string, updates: Partial<Repair>) => void;
  addPaintJob: (job: PaintJob) => void;
  updatePaintJob: (id: string, updates: Partial<PaintJob>) => void;
  addQualityCheck: (qc: QualityCheck) => void;
  updateQualityCheck: (id: string, updates: Partial<QualityCheck>) => void;
  addDispatch: (dispatch: Dispatch) => void;
  updateDispatch: (id: string, updates: Partial<Dispatch>) => void;
}

interface UIState {
  theme: 'light' | 'dark';
  currentRoute: string;
  bottomNavVisible: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentRoute: (route: string) => void;
  setBottomNavVisible: (visible: boolean) => void;
  toggleTheme: () => void;
}

// Mock data for initial state
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@comprint.in',
    name: 'System Administrator',
    role: {
      id: '1',
      name: 'Super Administrator',
      code: 'SUPERADMIN',
      description: 'Full system access with all permissions',
      permissions: ['*'],
      type: 'system',
      createdAt: new Date().toISOString()
    },
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Administrator',
    code: 'SUPERADMIN',
    description: 'Full system access with all permissions',
    permissions: ['*'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Inspection Engineer',
    code: 'INSPECTION_ENGINEER',
    description: 'Device inspection and initial assessment',
    permissions: ['inspection:read', 'inspection:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'L2 Repair Engineer',
    code: 'L2_ENGINEER',
    description: 'Standard repairs and repair workflow coordination',
    permissions: ['repair:read', 'repair:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'L3 Repair Specialist',
    code: 'L3_ENGINEER',
    description: 'Complex repairs (motherboard, BIOS, domain locks)',
    permissions: ['repair:read', 'repair:write', 'l3:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Display Technician',
    code: 'DISPLAY_TECHNICIAN',
    description: 'Display and screen repairs',
    permissions: ['display:read', 'display:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Battery Technician',
    code: 'BATTERY_TECHNICIAN',
    description: 'Battery reconditioning and boosting',
    permissions: ['battery:read', 'battery:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Paint Shop Technician',
    code: 'PAINT_SHOP_TECHNICIAN',
    description: 'Panel painting and cosmetic repairs',
    permissions: ['paint:read', 'paint:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'QC Engineer',
    code: 'QC_ENGINEER',
    description: 'Quality control and final inspection',
    permissions: ['qc:read', 'qc:write'],
    type: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'MIS Warehouse Executive',
    code: 'MIS_WAREHOUSE_EXECUTIVE',
    description: 'Manages warehouse inward and inventory operations',
    permissions: ['inward:read', 'inward:write', 'inventory:read'],
    type: 'system',
    createdAt: new Date().toISOString()
  }
];

const mockBatches: Batch[] = [
  {
    id: '1',
    batchNumber: 'BATCH-2026-0001',
    customerName: 'Standard Customer',
    type: 'refurb',
    status: 'completed',
    vehicleNumber: 'MH03CL 8085',
    driverName: 'Sameer',
    courierPartner: 'DTDC',
    batchDate: '2026-02-03',
    notes: 'First batch of the year',
    deviceCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockDevices: Device[] = [
  {
    id: '1',
    barcode: 'L-APP-1925',
    serialNumber: 'ASDFrgt',
    category: 'Laptop',
    brand: 'Apple',
    model: 'wsdfg',
    status: 'stock_out',
    batchId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    barcode: 'L-DEL-4268',
    serialNumber: 'WASQ1234',
    category: 'Laptop',
    brand: 'Dell',
    model: 'asdfg',
    status: 'stock_out',
    batchId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        if (password !== '123456') return false;

        const roleMap: Record<string, string> = {
          'admin@user.com': 'ADMIN',
          'storemanager@gmail.com': 'MIS_WAREHOUSE_EXECUTIVE',
          'qcuser@gmail.com': 'QC_ENGINEER',
          'l2engineer@gmail.com': 'L2_ENGINEER',
          'inward@gmail.com': 'MIS_WAREHOUSE_EXECUTIVE',
          'outward@gmail.com': 'MIS_WAREHOUSE_EXECUTIVE',
          'superadmin@gmail.com': 'SUPERADMIN'
        };

        const roleCode = roleMap[email];
        if (roleCode) {
          const role = mockRoles.find(r => r.code === roleCode) || mockRoles[0];
          set({
            user: {
              id: Math.random().toString(36).substr(2, 9),
              email,
              name: email.split('@')[0],
              role,
              status: 'active',
              createdAt: new Date().toISOString()
            },
            isAuthenticated: true
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'nexus-auth-storage'
    }
  )
);

// Data Store
export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      users: mockUsers,
      roles: mockRoles,
      devices: mockDevices,
      batches: mockBatches,
      inspections: [],
      spareParts: [],
      repairs: [],
      paintJobs: [],
      qualityChecks: [],
      dispatches: [],

      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      setRoles: (roles) => set({ roles }),
      addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),
      updateRole: (id, updates) => set((state) => ({
        roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      setDevices: (devices) => set({ devices }),
      setBatches: (batches) => set({ batches }),

      addBatch: (batch) => set((state) => ({
        batches: [...state.batches, batch]
      })),

      addDevice: (device) => set((state) => ({
        devices: [...state.devices, device]
      })),

      updateDevice: (id, updates) => set((state) => ({
        devices: state.devices.map(d =>
          d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
        )
      })),

      addSparePart: (part) => set((state) => ({
        spareParts: [...state.spareParts, part]
      })),

      updateSparePart: (id, updates) => set((state) => ({
        spareParts: state.spareParts.map(p =>
          p.id === id ? { ...p, ...updates } : p
        )
      })),

      addRepair: (repair) => set((state) => ({
        repairs: [...state.repairs, repair]
      })),

      updateRepair: (id, updates) => set((state) => ({
        repairs: state.repairs.map(r =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),

      addPaintJob: (job) => set((state) => ({
        paintJobs: [...state.paintJobs, job]
      })),

      updatePaintJob: (id, updates) => set((state) => ({
        paintJobs: state.paintJobs.map(j =>
          j.id === id ? { ...j, ...updates } : j
        )
      })),

      addQualityCheck: (qc) => set((state) => ({
        qualityChecks: [...state.qualityChecks, qc]
      })),

      updateQualityCheck: (id, updates) => set((state) => ({
        qualityChecks: state.qualityChecks.map(q =>
          q.id === id ? { ...q, ...updates } : q
        )
      })),

      addDispatch: (dispatch) => set((state) => ({
        dispatches: [...state.dispatches, dispatch]
      })),

      updateDispatch: (id, updates) => set((state) => ({
        dispatches: state.dispatches.map(d =>
          d.id === id ? { ...d, ...updates } : d
        )
      }))
    }),
    {
      name: 'nexus-data-storage'
    }
  )
);

// UI Store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      currentRoute: 'dashboard',
      bottomNavVisible: true,
      setTheme: (theme) => set({ theme }),
      setCurrentRoute: (route) => set({ currentRoute: route }),
      setBottomNavVisible: (visible) => set({ bottomNavVisible: visible }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      }))
    }),
    {
      name: 'nexus-ui-storage'
    }
  )
);

// Dashboard Stats Selector
export const useDashboardStats = () => {
  const { devices } = useDataStore();

  return {
    totalDevices: devices.length,
    pendingInspection: devices.filter(d => d.status === 'pending_inspection').length,
    underInspection: devices.filter(d => d.status === 'under_inspection').length,
    waitingSpares: devices.filter(d => d.status === 'waiting_spares').length,
    readyForRepair: devices.filter(d => d.status === 'ready_repair').length,
    underRepair: devices.filter(d => d.status === 'under_repair').length,
    inL3Repair: devices.filter(d => d.status === 'in_l3_repair').length,
    inDisplayRepair: devices.filter(d => d.status === 'in_display_repair').length,
    inBatteryRepair: devices.filter(d => d.status === 'in_battery_repair').length,
    inPaintShop: devices.filter(d => d.status === 'in_paint_shop').length,
    awaitingQC: devices.filter(d => d.status === 'awaiting_qc').length,
    underQC: devices.filter(d => d.status === 'under_qc').length,
    qcPassed: devices.filter(d => d.status === 'qc_passed').length,
    readyStock: devices.filter(d => d.status === 'ready_stock').length,
    inRepairWorkflow: devices.filter(d =>
      ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair'].includes(d.status)
    ).length
  };
};
