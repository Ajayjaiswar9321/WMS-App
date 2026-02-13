import { useState } from 'react';
import { useAuthStore, useDataStore, useUIStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Paintbrush,
  CheckSquare,
  Truck,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  User as UserIcon,
  ArrowLeft,
  Plus,
  Edit2,
  Check,
  Bell,
  Database,
  FileText,
  HelpCircle,
  Boxes,
  Wrench,
  Package,
  Upload
} from 'lucide-react';
import type { User, Role } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



// Sub-screens
export function PaintShopScreen({ onBack }: { onBack: () => void }) {
  const { devices } = useDataStore();
  const paintDevices = devices.filter(d =>
    d.status === 'in_paint_shop'
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Paint Shop</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Refurbishment Station</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-5 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-none bg-orange-50/50 dark:bg-orange-900/10 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-orange-600 leading-none mb-1">0</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#64748B]">PENDING</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-blue-600 leading-none mb-1">{paintDevices.length}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#64748B]">IN PAINT</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-green-50/50 dark:bg-green-900/10 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-green-600 leading-none mb-1">0</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#64748B]">DONE</p>
            </CardContent>
          </Card>
        </div>

        {paintDevices.length === 0 ? (
          <Card className="rounded-[2.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-800 font-black">
                <Paintbrush className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[#111827] dark:text-white font-black uppercase tracking-tight leading-none mb-1.5">No panels await paint</p>
              <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest">Station is currently idle</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 pb-10">
            {paintDevices.map((device, index) => (
              <Card
                key={device.id}
                className="rounded-[1.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center shadow-inner">
                        <Paintbrush className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-base uppercase tracking-tight text-[#111827] dark:text-white leading-none mb-1.5">{device.model}</h4>
                        <p className="text-[9px] text-[#64748B] font-black uppercase tracking-[0.15em]">{device.brand} • {device.barcode}</p>
                      </div>
                    </div>
                    <Badge className="bg-[#EFF6FF] text-[#1D4ED8] dark:bg-blue-900/40 dark:text-blue-400 border-none rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">
                      {device.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function QCScreen({ onBack }: { onBack: () => void }) {
  const { devices } = useDataStore();
  const qcDevices = devices.filter(d =>
    d.status === 'awaiting_qc' || d.status === 'under_qc'
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Quality Control</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Final Verification</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-2xl border-none bg-orange-50/50 dark:bg-orange-900/10 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-orange-600 leading-none mb-1">{qcDevices.filter(d => d.status === 'awaiting_qc').length}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#64748B]">AWAITING</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-blue-600 leading-none mb-1">{qcDevices.filter(d => d.status === 'under_qc').length}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#64748B]">UNDER QC</p>
            </CardContent>
          </Card>
        </div>

        {qcDevices.length === 0 ? (
          <Card className="rounded-[2.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-800 font-black">
                <CheckSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[#111827] dark:text-white font-black uppercase tracking-tight leading-none mb-1.5">No devices in QC</p>
              <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest">Inventory is fully verified</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 pb-10">
            {qcDevices.map((device, index) => (
              <Card
                key={device.id}
                className="rounded-[1.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center shadow-inner">
                        <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-base uppercase tracking-tight text-[#111827] dark:text-white leading-none mb-1.5">{device.model}</h4>
                        <p className="text-[9px] text-[#64748B] font-black uppercase tracking-[0.15em]">{device.brand} • {device.barcode}</p>
                      </div>
                    </div>
                    <Badge className={`border-none rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${device.status === 'under_qc' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}>
                      {device.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function OutwardScreen({ onBack }: { onBack: () => void }) {
  const { dispatches, addDispatch } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sales' as 'sales' | 'rental',
    customerName: '',
    invoiceNumber: '',
    invoiceAttachmentUrl: '',
    poNumber: '',
    poAttachmentUrl: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) return;
    if (!formData.invoiceNumber && !formData.invoiceAttachmentUrl && !formData.poNumber && !formData.poAttachmentUrl) {
      alert('Either Invoice Number/Upload or PO Number/Upload is required');
      return;
    }

    const newDispatch = {
      id: `DIS-${Date.now().toString().slice(-4)}`,
      type: formData.type,
      status: 'pending' as const,
      customerName: formData.customerName,
      invoiceNumber: formData.invoiceNumber,
      invoiceAttachmentUrl: formData.invoiceAttachmentUrl,
      poNumber: formData.poNumber,
      poAttachmentUrl: formData.poAttachmentUrl,
      notes: formData.notes,
      dispatchDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      devices: []
    };

    addDispatch(newDispatch);
    setIsDialogOpen(false);
    setFormData({
      type: 'sales',
      customerName: '',
      invoiceNumber: '',
      invoiceAttachmentUrl: '',
      poNumber: '',
      poAttachmentUrl: '',
      notes: ''
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Outward</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Dispatch Management</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4 pb-24 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">0</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">AVAILABLE</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{dispatches.filter(d => d.type === 'sales').length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">SALES</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{dispatches.filter(d => d.type === 'rental').length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">RENTAL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          className="w-full h-12 rounded-2xl shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-xs bg-blue-600"
          onClick={() => setIsDialogOpen(true)}
        >
          <Truck className="w-4 h-4 mr-2" />
          New Dispatch
        </Button>

        {dispatches.length === 0 ? (
          <Card className="rounded-[2.5rem] border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-800 font-black">
                <Truck className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[#111827] dark:text-white font-black uppercase tracking-tight leading-none mb-1.5">No dispatches yet</p>
              <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest">Start by creating a new dispatch</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {dispatches.map((dispatch, index) => (
              <Card
                key={dispatch.id}
                className="rounded-[1.5rem] border-none bg-white dark:bg-gray-800 shadow-sm animate-slide-up group overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center shadow-inner">
                        <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-tight text-[#111827] dark:text-white leading-none mb-1.5">{dispatch.customerName}</h4>
                        <p className="text-[9px] text-[#64748B] font-black uppercase tracking-[0.15em]">{dispatch.id} • {new Date(dispatch.dispatchDate || '').toLocaleDateString('en-GB')}</p>
                      </div>
                    </div>
                    <Badge className={`border-none rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${dispatch.type === 'sales' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#F3E8FF] text-[#7E22CE]'}`}>
                      {dispatch.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">INV: {dispatch.invoiceNumber || 'DOC'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">PO: {dispatch.poNumber || 'DOC'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Create Dispatch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4 pb-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dispatch Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'sales' | 'rental') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Name *</Label>
              <Input
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="h-12 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Invoice Number</Label>
                <Input
                  value={formData.invoiceNumber}
                  onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="INV-..."
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Invoice</Label>
                <div
                  onClick={() => setFormData({ ...formData, invoiceAttachmentUrl: 'inv.pdf' })}
                  className={`h-12 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${formData.invoiceAttachmentUrl ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">PO Number</Label>
                <Input
                  value={formData.poNumber}
                  onChange={e => setFormData({ ...formData, poNumber: e.target.value })}
                  placeholder="PO-..."
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload PO</Label>
                <div
                  onClick={() => setFormData({ ...formData, poAttachmentUrl: 'po.pdf' })}
                  className={`h-12 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${formData.poAttachmentUrl ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notes</Label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full min-h-[80px] p-3 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Optional notes..."
              />
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
              Complete Dispatch
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function UsersScreen({ onBack }: { onBack: () => void }) {
  const { users, roles, addUser, updateUser } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', roleId: roles[0]?.id || '', status: 'active' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find(r => r.id === formData.roleId);
    if (!role) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: role,
        status: formData.status
      });
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name: formData.name,
        email: formData.email,
        role: role,
        status: formData.status,
        createdAt: new Date().toISOString()
      };
      addUser(newUser);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">User Management</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Manage system users</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4 pb-24 space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="mobile-card shadow-3d border-none bg-blue-50/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-blue-600">{users.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-3d border-none bg-green-50/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-green-600">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active</p>
            </CardContent>
          </Card>
        </div>
        <Button
          className="w-full h-14 shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest btn-3d mb-6"
          onClick={handleOpenAdd}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New User
        </Button>
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="mobile-card shadow-3d border-none overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none font-bold text-[9px] tracking-widest uppercase py-0.5">
                        {user.role.name}
                      </Badge>
                      <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700 border-none text-[9px]' : 'bg-red-100 text-red-700 border-none text-[9px]'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenEdit(user)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assign Role</Label>
              <Select
                value={formData.roleId}
                onValueChange={value => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RolesScreen({ onBack }: { onBack: () => void }) {
  const { roles, addRole, updateRole } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningRole, setAssigningRole] = useState<Role | null>(null);
  const { users, updateUser } = useDataStore();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', code: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      code: role.code
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      updateRole(editingRole.id, {
        name: formData.name,
        description: formData.description,
        code: formData.code
      });
    } else {
      const newRole: Role = {
        id: Math.random().toString(36).substring(2, 11),
        name: formData.name,
        description: formData.description,
        code: formData.code,
        permissions: [],
        type: 'custom',
        createdAt: new Date().toISOString()
      };
      addRole(newRole);
    }
    setIsDialogOpen(false);
  };

  const handleOpenAssign = (role: Role) => {
    setAssigningRole(role);
    setSelectedUserIds(users.filter(u => u.role.id === role.id).map(u => u.id));
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!assigningRole) return;
    // Update all selected users to this role
    users.forEach(user => {
      const isSelected = selectedUserIds.includes(user.id);
      const isCurrentlyInRole = user.role.id === assigningRole.id;

      if (isSelected && !isCurrentlyInRole) {
        updateUser(user.id, { role: assigningRole });
      } else if (!isSelected && isCurrentlyInRole && roles.length > 0) {
        // Option: if deselected, we could assign a default role, 
        // but typically you just want to add users to this role.
      }
    });
    setIsAssignDialogOpen(false);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUserIds(users.map(u => u.id));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Role Management</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Manage user roles</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4 pb-24 space-y-4">
        <Button
          className="w-full h-14 shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest btn-3d mb-6"
          onClick={handleOpenAdd}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Role
        </Button>
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="mobile-card shadow-3d border-none overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${role.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <Shield className={`w-6 h-6 ${role.type === 'system' ? 'text-purple-600' : 'text-orange-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-gray-900 dark:text-white leading-tight">{role.name}</p>
                      <Badge className="text-[8px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 border-none">
                        {role.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{role.description}</p>
                    <code className="text-[10px] font-mono bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded text-blue-600">
                      {role.code}
                    </code>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-blue-600"
                      onClick={() => handleOpenEdit(role)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-green-600"
                      onClick={() => handleOpenAssign(role)}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Assign Users to Role
            </DialogTitle>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{assigningRole?.name}</p>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Users</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] font-black uppercase text-blue-600 h-7"
                onClick={selectAllUsers}
              >
                Select All
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollable-content">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => toggleUserSelection(user.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedUserIds.includes(user.id)
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedUserIds.includes(user.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-tight">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                  {selectedUserIds.includes(user.id) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d"
              onClick={handleAssignSubmit}
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-[#1e293b]">
              {editingRole ? 'Edit Role' : 'Create Role'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sales Executive"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Code</Label>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                placeholder="E.G. SALES_EXEC"
                className="h-12 rounded-xl font-mono text-sm focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</Label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the responsibilities..."
                className="w-full min-h-[100px] p-4 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d">
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { logout } = useAuthStore();

  const settingsItems = [
    { icon: Bell, label: 'Notifications', value: true },
    { icon: Database, label: 'Database', value: 'Connected' },
    { icon: FileText, label: 'Reports', value: null },
    { icon: HelpCircle, label: 'Help & Support', value: null },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Settings</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">App preferences</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4 pb-24 space-y-4">
        {/* Database Status */}
        <Card className="mobile-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Supabase</p>
                <p className="text-sm text-green-700 dark:text-green-300">PostgreSQL Database</p>
                <Badge className="bg-green-100 text-green-800 mt-1">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings List */}
        <Card className="mobile-card">
          <CardContent className="p-0">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${index !== settingsItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.value ? (
                    <span className="text-sm text-gray-500">{item.value}</span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400">v1.0.0-beta</p>
      </div>
    </div>
  );
}

export function MoreScreen() {
  const { user, logout } = useAuthStore();
  const { setCurrentRoute } = useUIStore();

  const menuItems = [
    { id: 'spares', label: 'Spares', icon: Boxes, color: 'bg-indigo-500', count: 0 },
    { id: 'repair', label: 'Repair', icon: Wrench, color: 'bg-blue-500', count: 0 },
    { id: 'paint', label: 'Paint Shop', icon: Paintbrush, color: 'bg-purple-500', count: 0 },
    { id: 'qc', label: 'QC', icon: CheckSquare, color: 'bg-teal-500', count: 0 },
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'bg-green-500', count: 0 },
    { id: 'outward', label: 'Outward', icon: Truck, color: 'bg-blue-600', count: 0 },
    { id: 'users', label: 'User Management', icon: Users, color: 'bg-orange-500', count: 0 },
    { id: 'roles', label: 'Role Management', icon: Shield, color: 'bg-rose-500', count: 0 },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500', count: null },
  ];



  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-4">
          <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">More</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Additional Modules</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 pb-24 space-y-6">
        {/* Profile Card */}
        <Card className="mobile-card border-none bg-white dark:bg-gray-900 shadow-sm overflow-hidden rounded-[2rem] animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md animate-bounce-subtle">
                  <div className="w-4 h-4 bg-[#10B981] rounded-full border-2 border-white dark:border-gray-800" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight leading-tight mb-1 uppercase">{user?.name}</h2>
                <Badge className="bg-[#ECFDF5] text-[#047857] border-none font-black text-[10px] tracking-widest uppercase py-0.5 px-3 rounded-full">
                  {user?.role.name}
                </Badge>
                <p className="text-xs text-[#6B7280] font-medium mt-2">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button variant="outline" className="h-10 rounded-xl border-gray-100 text-[#374151] font-bold text-[10px] uppercase tracking-wider">
                Edit Profile
              </Button>
              <Button variant="outline" className="h-10 rounded-xl border-gray-100 text-[#EF4444] font-bold text-[10px] uppercase tracking-wider" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Grid */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-[0.15em] text-[#6B7280] px-1">Management Console</h3>
          <div className="grid grid-cols-3 gap-3">
            {menuItems.filter(item => item.id !== 'settings').map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRoute(item.id as any)}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.95] border border-gray-100 dark:border-gray-800 group"
                >
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tight text-[#374151] dark:text-gray-300 text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setCurrentRoute('settings' as any)}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.95] border border-gray-100 dark:border-gray-800 group"
            >
              <div className="w-11 h-11 bg-gray-500 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/10 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight text-[#374151] dark:text-gray-300 text-center leading-tight">Settings</span>
            </button>
          </div>
        </div>


        {/* Version */}
        <div className="pt-4 pb-2">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Nexus WMS • Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
