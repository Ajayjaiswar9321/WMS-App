import { useState } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  Truck,
  ChevronRight,
  Upload,
  MoreVertical
} from 'lucide-react';
import type { Batch } from '@/types';

export function InwardScreen() {
  const { batches, devices, addBatch } = useDataStore();
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create batch form state
  const [batchForm, setBatchForm] = useState({
    type: 'refurb' as 'refurb' | 'rental_return',
    vehicleNumber: '',
    driverName: '',
    courierPartner: '',
    batchDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.courierPartner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBatch = () => {
    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber: `BATCH-${new Date().getFullYear()}-${String(batches.length + 1).padStart(4, '0')}`,
      type: batchForm.type,
      status: 'pending',
      vehicleNumber: batchForm.vehicleNumber,
      driverName: batchForm.driverName,
      courierPartner: batchForm.courierPartner,
      batchDate: batchForm.batchDate,
      notes: batchForm.notes,
      deviceCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addBatch(newBatch);
    setView('list');
    setBatchForm({
      type: 'refurb',
      vehicleNumber: '',
      driverName: '',
      courierPartner: '',
      batchDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'refurb'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
  };

  if (view === 'create') {
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
            <h1 className="text-lg font-semibold">Create New Batch</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
          {/* Batch Type */}
          <div className="space-y-2">
            <Label>Batch Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBatchForm({ ...batchForm, type: 'refurb' })}
                className={`p-4 rounded-xl border-2 transition-all ${batchForm.type === 'refurb'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <Package className={`w-6 h-6 mx-auto mb-2 ${batchForm.type === 'refurb' ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${batchForm.type === 'refurb' ? 'text-blue-700' : 'text-gray-600'}`}>Refurb Purchase</p>
              </button>
              <button
                onClick={() => setBatchForm({ ...batchForm, type: 'rental_return' })}
                className={`p-4 rounded-xl border-2 transition-all ${batchForm.type === 'rental_return'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
                  }`}
              >
                <Truck className={`w-6 h-6 mx-auto mb-2 ${batchForm.type === 'rental_return' ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${batchForm.type === 'rental_return' ? 'text-blue-700' : 'text-gray-600'}`}>Rental Return</p>
              </button>
            </div>
          </div>

          {/* Vehicle Number */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle Number *</Label>
            <Input
              id="vehicle"
              placeholder="e.g., MH03CL 8085"
              value={batchForm.vehicleNumber}
              onChange={(e) => setBatchForm({ ...batchForm, vehicleNumber: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Driver Name */}
          <div className="space-y-2">
            <Label htmlFor="driver">Driver Name *</Label>
            <Input
              id="driver"
              placeholder="Enter driver name"
              value={batchForm.driverName}
              onChange={(e) => setBatchForm({ ...batchForm, driverName: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Courier Partner */}
          <div className="space-y-2">
            <Label htmlFor="courier">Courier Partner *</Label>
            <Input
              id="courier"
              placeholder="e.g., DTDC, BlueDart"
              value={batchForm.courierPartner}
              onChange={(e) => setBatchForm({ ...batchForm, courierPartner: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Batch Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Batch Date *</Label>
            <Input
              id="date"
              type="date"
              value={batchForm.batchDate}
              onChange={(e) => setBatchForm({ ...batchForm, batchDate: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Challan Upload */}
          <div className="space-y-2">
            <Label>Upload Challan (Image/PDF) *</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload challan</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={batchForm.notes}
              onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
              className="w-full min-h-[100px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 pb-2">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => setView('list')}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12"
              onClick={handleCreateBatch}
              disabled={!batchForm.vehicleNumber || !batchForm.driverName || !batchForm.courierPartner}
            >
              Create Batch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedBatch) {
    const batchDevices = devices.filter(d => d.batchId === selectedBatch.id);

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
              <h1 className="text-lg font-semibold">{selectedBatch.batchNumber}</h1>
              <p className="text-xs text-gray-500">Batch Details</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
          {/* Batch Info Card */}
          <Card className="mobile-card shadow-3d animate-scale-in overflow-hidden border-none glass-morphism">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${getTypeColor(selectedBatch.type)} px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                  {selectedBatch.type === 'refurb' ? 'Refurb' : 'Rental'}
                </Badge>
                <Badge className={`${getStatusColor(selectedBatch.status)} px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                  {selectedBatch.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Vehicle</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{selectedBatch.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Driver</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{selectedBatch.driverName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Carrier</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{selectedBatch.courierPartner}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{new Date(selectedBatch.batchDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {selectedBatch.notes && (
                <div className="pt-4 border-t border-gray-100/50 dark:border-gray-800/50">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Notes</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{selectedBatch.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Count */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-500">Devices ({batchDevices.length})</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-bold border-gray-200 dark:border-gray-800 shadow-3d btn-3d"
                onClick={() => alert('Bulk upload feature coming soon!')}
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Bulk
              </Button>
              <Button
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 btn-3d"
                onClick={() => alert('Add Device feature coming soon!')}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add
              </Button>
            </div>
          </div>

          {/* Devices List */}
          {batchDevices.length === 0 ? (
            <Card className="mobile-card shadow-3d animate-scale-in">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-700">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold">No devices found</p>
                <p className="text-xs text-gray-400 mt-1">Add devices to start processing</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {batchDevices.map((device, index) => (
                <Card
                  key={device.id}
                  className="mobile-card shadow-3d animate-slide-up hover:scale-[1.01] overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shadow-inner">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{device.barcode}</p>
                          <p className="text-xs text-gray-500">{device.brand} {device.model}</p>
                          <p className="text-[10px] font-mono tracking-tighter text-gray-400">{device.serialNumber}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 font-bold text-[10px]">
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

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-semibold">Inward</h1>
              <p className="text-xs text-gray-500">Batch Management</p>
            </div>
            <Button onClick={() => setView('create')} size="sm" className="h-9">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      </header>

      {/* Batches List */}
      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-3">
        {filteredBatches.length === 0 ? (
          <Card className="mobile-card shadow-3d animate-scale-in">
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No batches found</p>
              <p className="text-sm text-gray-400 mt-1">Create your first batch to get started</p>
              <Button onClick={() => setView('create')} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBatches.map((batch, index) => (
            <Card
              key={batch.id}
              className="mobile-card cursor-pointer shadow-3d animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => {
                setSelectedBatch(batch);
                setView('detail');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{batch.batchNumber}</p>
                      <Badge className={getTypeColor(batch.type)}>
                        {batch.type === 'refurb' ? 'Refurb' : 'Rental'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {batch.courierPartner}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {batch.deviceCount} devices
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(batch.batchDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
