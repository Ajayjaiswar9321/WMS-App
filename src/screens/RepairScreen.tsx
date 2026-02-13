import { useState } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Wrench,
  Monitor,
  Battery,
  Cpu,
  Pause,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronRight,
  Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Device } from '@/types';

type RepairTab = 'all' | 'in_progress' | 'almost_done' | 'needs_spares';

interface RepairForm {
  diagnosis: string;
  actions: string;
  notes: string;
  sparePartsUsed: string[];
}

export function RepairScreen({ onBack }: { onBack: () => void }) {
  const { devices, updateDevice } = useDataStore();
  const [activeTab] = useState<RepairTab>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'work'>('list');
  const [repairForm, setRepairForm] = useState<RepairForm>({
    diagnosis: '',
    actions: '',
    notes: '',
    sparePartsUsed: []
  });

  // Get devices in repair workflow
  const repairDevices = devices.filter(d =>
    ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair', 'waiting_spares'].includes(d.status)
  );

  const getRepairTypeIcon = (status: string) => {
    switch (status) {
      case 'in_l3_repair': return <Cpu className="w-5 h-5" />;
      case 'in_display_repair': return <Monitor className="w-5 h-5" />;
      case 'in_battery_repair': return <Battery className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  const getRepairTypeLabel = (status: string) => {
    switch (status) {
      case 'in_l3_repair': return 'L3 Repair';
      case 'in_display_repair': return 'Display';
      case 'in_battery_repair': return 'Battery';
      case 'waiting_spares': return 'Needs Spares';
      default: return 'L2 Repair';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting_spares': return 'bg-[#FEFCE8] text-[#854D0E]';
      case 'in_l3_repair': return 'bg-[#FEF2F2] text-[#991B1B]';
      case 'in_display_repair': return 'bg-[#EFF6FF] text-[#1E40AF]';
      case 'in_battery_repair': return 'bg-[#F0FDF4] text-[#166534]';
      default: return 'bg-[#F5F3FF] text-[#5B21B6]';
    }
  };

  const filteredDevices = repairDevices.filter(d => {
    if (activeTab === 'all') return true;
    if (activeTab === 'needs_spares') return d.status === 'waiting_spares';
    if (activeTab === 'in_progress') return ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair'].includes(d.status);
    if (activeTab === 'almost_done') return false; // Would need completion percentage logic
    return true;
  });

  const handleStartRepair = (device: Device) => {
    setSelectedDevice(device);
    setView('work');
  };

  const handleCompleteRepair = () => {
    if (selectedDevice) {
      updateDevice(selectedDevice.id, {
        status: 'awaiting_qc'
      });
      setView('list');
      setSelectedDevice(null);
    }
  };

  if (view === 'work' && selectedDevice) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-4">
            <button
              onClick={() => (view === 'work' ? setView('list') : onBack())}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                {view === 'work' ? 'Repair Work' : 'Repair Station'}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">
                {view === 'work' ? selectedDevice.barcode : 'Manage device repairs'}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
          {/* Device Info */}
          <Card className="mobile-card shadow-3d animate-scale-in overflow-hidden border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-900/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float">
                  {getRepairTypeIcon(selectedDevice.status)}
                </div>
                <div>
                  <p className="font-black text-xl text-purple-900 dark:text-purple-100 leading-tight">
                    {selectedDevice.model}
                  </p>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">{selectedDevice.brand} • {selectedDevice.barcode}</p>
                  <Badge className={`${getStatusColor(selectedDevice.status)} shadow-sm font-bold border-none`}>
                    {getRepairTypeLabel(selectedDevice.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Repair Form */}
          <div className="space-y-4">
            {/* Diagnosis */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Diagnosis</label>
              <textarea
                placeholder="Describe the issue found..."
                value={repairForm.diagnosis}
                onChange={(e) => setRepairForm({ ...repairForm, diagnosis: e.target.value })}
                className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none"
              />
            </div>

            {/* Actions Taken */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions Taken</label>
              <textarea
                placeholder="Describe repair actions performed..."
                value={repairForm.actions}
                onChange={(e) => setRepairForm({ ...repairForm, actions: e.target.value })}
                className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none"
              />
            </div>

            {/* Spare Parts Used */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Spare Parts Used</label>
              <div className="space-y-2">
                {['Battery', 'Display Panel', 'Keyboard', 'RAM', 'SSD', 'Motherboard'].map((part) => (
                  <label key={part} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={repairForm.sparePartsUsed.includes(part)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRepairForm({
                            ...repairForm,
                            sparePartsUsed: [...repairForm.sparePartsUsed, part]
                          });
                        } else {
                          setRepairForm({
                            ...repairForm,
                            sparePartsUsed: repairForm.sparePartsUsed.filter(p => p !== part)
                          });
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">{part}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                placeholder="Add any additional notes..."
                value={repairForm.notes}
                onChange={(e) => setRepairForm({ ...repairForm, notes: e.target.value })}
                className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 pb-2">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => setView('list')}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button
              className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              onClick={handleCompleteRepair}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - Mobile First */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-4">
          <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Repair Station</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Devices needing repair</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-6 pb-24">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{repairDevices.length}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">NEEDING</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                    {repairDevices.filter(d => d.status === 'ready_repair').length}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">NEW</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">0</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">REWORK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Search - Mobile Optimized */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <Input
            placeholder="Search devices..."
            className="pl-11 h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-medium placeholder:font-bold placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          />
        </div>

        {/* Device Table - Desktop Only */}
        <Card className="rounded-2xl border-none bg-white dark:bg-gray-900 shadow-sm overflow-hidden hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-gray-800/50">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Device</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Rework</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Spares</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Paint</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{device.model}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{device.brand} • {device.barcode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-[10px] uppercase text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">{device.category}</span>
                    </td>
                    <td className="px-6 py-6">
                      <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-none font-black text-[9px] px-2.5 rounded-lg">NEW</Badge>
                    </td>
                    <td className="px-6 py-6">
                      <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-none font-black text-[9px] px-2.5 rounded-lg uppercase tracking-tight">
                        {device.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase">
                        <CheckCircle className="w-3.5 h-3.5" /> Issued
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {device.status === 'ready_repair' ? (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20"
                            onClick={() => handleStartRepair(device)}
                          >
                            <Wrench className="w-3.5 h-3.5 mr-2" /> Start
                          </Button>
                        ) : (
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20"
                            onClick={() => handleStartRepair(device)} // Re-using handleStart for now to show WORK view
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-2" /> Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex justify-center bg-[#F8FAFC] dark:bg-gray-800/30">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{filteredDevices.length} RESULTS</p>
          </div>
        </Card>

        {/* Device List - Mobile */}
        <div className="lg:hidden space-y-4">
          {filteredDevices.map((device, index) => (
            <Card
              key={device.id}
              className="rounded-[1.5rem] border-none bg-white dark:bg-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-inner">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 dark:text-white uppercase leading-none">{device.model}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{device.brand} • {device.barcode}</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-none font-black text-[8px] px-2 rounded-lg uppercase">
                    {device.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase">{device.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-1.5 h-4 uppercase">NEW</Badge>
                  </div>
                </div>

                <Button
                  className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${device.status === 'ready_repair' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-600 shadow-emerald-500/20'}`}
                  onClick={() => handleStartRepair(device)}
                >
                  {device.status === 'ready_repair' ? (
                    <><Wrench className="w-3.5 h-3.5 mr-2" /> Start Repair</>
                  ) : (
                    <><CheckCircle className="w-3.5 h-3.5 mr-2" /> Complete Repair</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredDevices.length === 0 && (
            <div className="py-20 text-center">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No devices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
