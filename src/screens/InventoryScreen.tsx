import { useState } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Boxes,
  Search,
  ChevronRight,
  MoreVertical,
  Package,
  Download,
  QrCode
} from 'lucide-react';
import type { Device } from '@/types';

type FilterStatus = 'all' | 'in_stock' | 'ready' | 'out' | 'repair';

export function InventoryScreen() {
  const { devices } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_stock':
      case 'qc_passed':
        return 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]';
      case 'stock_out':
      case 'dispatched':
        return 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]';
      case 'under_repair':
      case 'in_l3_repair':
      case 'in_display_repair':
      case 'in_battery_repair':
      case 'waiting_spares':
        return 'bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]';
      case 'qc_failed':
        return 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]';
      default:
        return 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch =
      device.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'in_stock':
        return ['received', 'pending_inspection', 'under_inspection', 'ready_stock', 'qc_passed'].includes(device.status);
      case 'ready':
        return device.status === 'ready_stock' || device.status === 'qc_passed';
      case 'out':
        return device.status === 'stock_out' || device.status === 'dispatched';
      case 'repair':
        return ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair', 'waiting_spares'].includes(device.status);
      default:
        return true;
    }
  });

  // Inventory stats
  const stats = {
    total: devices.length,
    inStock: devices.filter(d => ['received', 'pending_inspection', 'under_inspection', 'ready_stock', 'qc_passed'].includes(d.status)).length,
    ready: devices.filter(d => d.status === 'ready_stock' || d.status === 'qc_passed').length,
    inRepair: devices.filter(d => ['under_repair', 'in_l3_repair', 'in_display_repair', 'in_battery_repair', 'waiting_spares'].includes(d.status)).length,
    dispatched: devices.filter(d => d.status === 'stock_out' || d.status === 'dispatched').length,
  };

  if (view === 'detail' && selectedDevice) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView('list')}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Device Details</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
          {/* Device Header */}
          <Card className="mobile-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{selectedDevice.barcode}</h2>
                    {selectedDevice.grade && (
                      <span className={`w-6 h-6 ${getGradeColor(selectedDevice.grade)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {selectedDevice.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{selectedDevice.brand} {selectedDevice.model}</p>
                  <Badge className={`mt-2 ${getStatusColor(selectedDevice.status)}`}>
                    {getStatusLabel(selectedDevice.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="mobile-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{selectedDevice.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Brand</p>
                  <p className="font-medium">{selectedDevice.brand}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="font-medium">{selectedDevice.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Serial Number</p>
                  <p className="font-medium">{selectedDevice.serialNumber}</p>
                </div>
                {selectedDevice.processor && (
                  <div>
                    <p className="text-xs text-gray-500">Processor</p>
                    <p className="font-medium">{selectedDevice.processor}</p>
                  </div>
                )}
                {selectedDevice.ram && (
                  <div>
                    <p className="text-xs text-gray-500">RAM</p>
                    <p className="font-medium">{selectedDevice.ram}</p>
                  </div>
                )}
                {selectedDevice.storage && (
                  <div>
                    <p className="text-xs text-gray-500">Storage</p>
                    <p className="font-medium">{selectedDevice.storage}</p>
                  </div>
                )}
                {selectedDevice.displaySize && (
                  <div>
                    <p className="text-xs text-gray-500">Display</p>
                    <p className="font-medium">{selectedDevice.displaySize}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Status */}
          <Card className="mobile-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Location & Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Location</span>
                  <span className="font-medium">{selectedDevice.location || 'Warehouse'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className={getStatusColor(selectedDevice.status)}>
                    {getStatusLabel(selectedDevice.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Added On</span>
                  <span className="font-medium">{new Date(selectedDevice.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="font-medium">{new Date(selectedDevice.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="mobile-card">
            <CardContent className="p-4 text-center">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Scan to view device details</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-semibold">Inventory</h1>
              <p className="text-xs text-gray-500">Device Management</p>
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <Card className="mobile-card shadow-sm border-none bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="p-3">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.total}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Total Stock</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-sm border-none bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-3">
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{stats.ready}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Ready Goods</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-sm border-none bg-orange-50/50 dark:bg-orange-900/10">
            <CardContent className="p-3">
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{stats.inRepair}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Under Repair</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-sm border-none bg-gray-50/50 dark:bg-gray-800/10">
            <CardContent className="p-3">
              <p className="text-2xl font-black text-gray-600 dark:text-gray-400">{stats.dispatched}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Dispatched</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2">
          {[
            { id: 'all', label: 'All', count: stats.total },
            { id: 'in_stock', label: 'In Stock', count: stats.inStock },
            { id: 'ready', label: 'Ready', count: stats.ready },
            { id: 'repair', label: 'Repair', count: stats.inRepair },
            { id: 'out', label: 'Sent', count: stats.dispatched },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterStatus)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === filter.id
                ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-gray-800 text-[#6B7280] border border-gray-100 dark:border-gray-700'
                }`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Devices List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-xs uppercase tracking-[0.15em] text-[#6B7280]">Device Assets</h3>
            <span className="text-[10px] font-bold text-[#9CA3AF]">
              {filteredDevices.length} ITEMS
            </span>
          </div>

          {filteredDevices.length === 0 ? (
            <Card className="mobile-card border-none shadow-sm">
              <CardContent className="p-10 text-center">
                <Boxes className="w-12 h-12 mx-auto text-gray-300 mb-3 opacity-20" />
                <p className="text-[#111827] font-black uppercase tracking-tight">No results</p>
                <p className="text-xs text-[#6B7280] font-medium mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDevices.map((device, index) => (
                <Card
                  key={device.id}
                  className="mobile-card cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98] border-none bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    setSelectedDevice(device);
                    setView('detail');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-inner">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-[#111827] dark:text-white leading-none uppercase tracking-tight">
                              {device.barcode}
                            </h3>
                            {device.grade && (
                              <span className={`w-5 h-5 ${getGradeColor(device.grade)} rounded-lg flex items-center justify-center text-white text-[10px] font-black`}>
                                {device.grade}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#6B7280] font-bold mt-1 uppercase tracking-wider">
                            {device.brand} {device.model}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(device.status)} border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider`}>
                        {getStatusLabel(device.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-bold border-gray-200 text-gray-500 uppercase tracking-widest px-2">
                          {device.category}
                        </Badge>
                        <p className="text-[9px] font-mono text-gray-400">SN: {device.serialNumber}</p>
                      </div>
                      <div className="flex items-center text-[#3B82F6] font-bold text-[10px] uppercase tracking-wider">
                        DETAILS <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
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
