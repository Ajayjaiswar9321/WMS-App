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
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import type { Device } from '@/types';

type RepairTab = 'all' | 'in_progress' | 'almost_done' | 'needs_spares';

interface RepairForm {
  diagnosis: string;
  actions: string;
  notes: string;
  sparePartsUsed: string[];
}

export function RepairScreen() {
  const { devices, updateDevice } = useDataStore();
  const [activeTab, setActiveTab] = useState<RepairTab>('all');
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
      case 'waiting_spares': return 'bg-orange-100 text-orange-800';
      case 'in_l3_repair': return 'bg-red-100 text-red-800';
      case 'in_display_repair': return 'bg-blue-100 text-blue-800';
      case 'in_battery_repair': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
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
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView('list')}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Repair Work</h1>
              <p className="text-xs text-gray-500">{selectedDevice.barcode}</p>
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
                    {selectedDevice.brand} {selectedDevice.model}
                  </p>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">{selectedDevice.category}</p>
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
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">Repair Station</h1>
          <p className="text-xs text-gray-500">Manage device repairs</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <Card className="mobile-card shadow-3d border-none bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{repairDevices.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">In Prep</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-3d border-none bg-orange-50/50 dark:bg-orange-900/10">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                {devices.filter(d => d.status === 'waiting_spares').length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Spares</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-3d border-none bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-green-600 dark:text-green-400">0</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Fixed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: 'All', count: repairDevices.length },
            { id: 'in_progress', label: 'In Progress', count: repairDevices.filter(d => ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair'].includes(d.status)).length },
            { id: 'almost_done', label: 'Almost Done', count: 0 },
            { id: 'needs_spares', label: 'Needs Spares', count: devices.filter(d => d.status === 'waiting_spares').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RepairTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-400 text-white' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          {[
            { type: 'under_repair', label: 'L2', icon: Wrench, color: 'bg-purple-600 shadow-purple-500/20' },
            { type: 'in_l3_repair', label: 'L3', icon: Cpu, color: 'bg-red-600 shadow-red-500/20' },
            { type: 'in_display_repair', label: 'Display', icon: Monitor, color: 'bg-blue-600 shadow-blue-500/20' },
            { type: 'in_battery_repair', label: 'Battery', icon: Battery, color: 'bg-green-600 shadow-green-500/20' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => setActiveTab('in_progress')}
                className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-3d btn-3d"
              >
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Devices List */}
        <div>
          <h3 className="font-semibold mb-3">Devices in Repair</h3>

          {filteredDevices.length === 0 ? (
            <Card className="mobile-card">
              <CardContent className="p-8 text-center">
                <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No devices in repair workflow</p>
                <p className="text-sm text-gray-400 mt-1">Devices will appear here after inspection</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDevices.map((device, index) => (
                <Card
                  key={device.id}
                  className="mobile-card shadow-3d animate-slide-up hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${getStatusColor(device.status)}`}>
                          {getRepairTypeIcon(device.status)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{device.barcode}</p>
                          <p className="text-xs font-medium text-gray-500 mb-1">{device.brand} {device.model}</p>
                          <Badge className={`text-[10px] font-bold border-none shadow-sm ${getStatusColor(device.status)}`}>
                            {getRepairTypeLabel(device.status)}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 btn-3d"
                        onClick={() => handleStartRepair(device)}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
