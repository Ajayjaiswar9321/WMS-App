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
  MoreVertical,
  X,
  User,
  FileText
} from 'lucide-react';
import type { Batch } from '@/types';

export function InwardScreen() {
  const { batches, devices, addBatch, addDevice } = useDataStore();
  const [view, setView] = useState<'list' | 'create' | 'detail' | 'add-device'>('list');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create batch form state
  const [batchForm, setBatchForm] = useState({
    type: 'refurb' as 'refurb' | 'rental_return',
    customerName: '',
    rentalInvoiceNumber: '',
    vehicleNumber: '',
    driverName: '',
    courierPartner: '',
    poNumber: '',
    poAttachmentUrl: '',
    batchDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.courierPartner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [deviceForm, setDeviceForm] = useState({
    category: 'Laptop' as any,
    brand: '',
    model: '',
    serialNumber: '',
    barcode: ''
  });

  const handleCreateBatch = () => {
    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber: `BATCH-${new Date().getFullYear()}-${String(batches.length + 1).padStart(4, '0')}`,
      type: batchForm.type,
      status: 'pending',
      customerName: batchForm.customerName,
      rentalInvoiceNumber: batchForm.type === 'rental_return' ? batchForm.rentalInvoiceNumber : undefined,
      vehicleNumber: batchForm.vehicleNumber,
      driverName: batchForm.driverName,
      courierPartner: batchForm.courierPartner,
      poNumber: batchForm.poNumber,
      poAttachmentUrl: batchForm.poAttachmentUrl,
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
      customerName: '',
      rentalInvoiceNumber: '',
      vehicleNumber: '',
      driverName: '',
      courierPartner: '',
      poNumber: '',
      poAttachmentUrl: '',
      batchDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  if (view === 'create') {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Create New Batch</h1>
            <button
              onClick={() => setView('list')}
              className="p-2 -mr-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-6">
          {/* Batch Type Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBatchForm({ ...batchForm, type: 'refurb' })}
              className={`py-3 px-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${batchForm.type === 'refurb'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'
                }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${batchForm.type === 'refurb' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                <Package className="w-5 h-5" />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${batchForm.type === 'refurb' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`}>Refurb Purchase</p>
            </button>
            <button
              onClick={() => setBatchForm({ ...batchForm, type: 'rental_return' })}
              className={`py-3 px-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${batchForm.type === 'rental_return'
                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'
                }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${batchForm.type === 'rental_return' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                <Truck className="w-5 h-5" />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${batchForm.type === 'rental_return' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-400'}`}>Rental Return</p>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {/* Customer Name */}
            <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
              <Label htmlFor="customer" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">
                {batchForm.type === 'refurb' ? 'Customer *' : 'Customer / Company Name *'}
              </Label>
              <Input
                id="customer"
                placeholder={batchForm.type === 'refurb' ? 'Enter customer name' : 'Enter customer / company name'}
                value={batchForm.customerName}
                onChange={(e) => setBatchForm({ ...batchForm, customerName: e.target.value })}
                className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] focus:border-blue-500/50 transition-all font-medium text-sm"
              />
            </div>

            {/* Rental Invoice Number - Conditional */}
            {batchForm.type === 'rental_return' && (
              <div className="space-y-1.5 animate-slide-up focus-within:translate-x-1 transition-transform">
                <Label htmlFor="invoice" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Rental Invoice Number *</Label>
                <Input
                  id="invoice"
                  placeholder="Enter rental invoice number"
                  value={batchForm.rentalInvoiceNumber}
                  onChange={(e) => setBatchForm({ ...batchForm, rentalInvoiceNumber: e.target.value })}
                  className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] focus:border-purple-500/50 transition-all font-medium text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Vehicle Number */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <Label htmlFor="vehicle" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Vehicle Number *</Label>
                <Input
                  id="vehicle"
                  placeholder="e.g. KA01AB1234"
                  value={batchForm.vehicleNumber}
                  onChange={(e) => setBatchForm({ ...batchForm, vehicleNumber: e.target.value })}
                  className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all font-medium text-sm"
                />
              </div>

              {/* Driver Name */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <Label htmlFor="driver" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Driver Name *</Label>
                <Input
                  id="driver"
                  placeholder="Enter driver name"
                  value={batchForm.driverName}
                  onChange={(e) => setBatchForm({ ...batchForm, driverName: e.target.value })}
                  className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* PO Number */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <Label htmlFor="poNumber" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">PO Number (Optional if Uploaded)</Label>
                <Input
                  id="poNumber"
                  placeholder="Enter PO number"
                  value={batchForm.poNumber}
                  onChange={(e) => setBatchForm({ ...batchForm, poNumber: e.target.value })}
                  className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all font-medium text-sm"
                />
              </div>

              {/* Batch Date */}
              <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Batch Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={batchForm.batchDate}
                  onChange={(e) => setBatchForm({ ...batchForm, batchDate: e.target.value })}
                  className="h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* PO Upload */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Upload PO (Optional if number provided)</Label>
              <div
                onClick={() => setBatchForm({ ...batchForm, poAttachmentUrl: 'po-uploaded.pdf' })}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all hover:bg-gray-50 dark:hover:bg-gray-900 group cursor-pointer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ${batchForm.poAttachmentUrl ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110 ${batchForm.poAttachmentUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}>
                  <Upload className="w-4 h-4" />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${batchForm.poAttachmentUrl ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {batchForm.poAttachmentUrl ? 'PO Uploaded' : 'Click to upload PO'}
                </p>
              </div>
            </div>

            {/* Challan Upload */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Upload Challan *</Label>
              <div className="border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center bg-white dark:bg-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-900 group cursor-pointer shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Click to upload document</p>
              </div>
            </div>

            {/* Notes - Only for Refurb Purchase */}
            {batchForm.type === 'refurb' && (
              <div className="space-y-1.5 animate-slide-up focus-within:translate-x-1 transition-transform">
                <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Notes</Label>
                <textarea
                  id="notes"
                  placeholder="Additional information..."
                  value={batchForm.notes}
                  onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
                  className="w-full min-h-[100px] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] resize-none focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 pb-12">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 bg-white"
              onClick={() => setView('list')}
            >
              Cancel
            </Button>
            <Button
              className={`flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 ${!batchForm.customerName || !batchForm.vehicleNumber || !batchForm.driverName || (!batchForm.poNumber && !batchForm.poAttachmentUrl)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black dark:bg-white dark:text-black text-white hover:opacity-90'
                }`}
              onClick={handleCreateBatch}
              disabled={!batchForm.customerName || !batchForm.vehicleNumber || !batchForm.driverName || (!batchForm.poNumber && !batchForm.poAttachmentUrl)}
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

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        alert(`Successfully uploaded ${file.name}. Processing Excel data...`);
      }
    };

    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView('list')}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
                {selectedBatch.batchNumber}
              </h1>
              <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest mt-1">Batch Details</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-6">
          {/* Batch Info Card - High Fidelity Matching Screenshot */}
          <Card className="rounded-[2rem] border-none bg-white dark:bg-gray-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <Badge className="bg-[#F3E8FF] text-[#7E22CE] border-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {selectedBatch.type === 'refurb' ? 'REFURB' : 'RENTAL'}
                  </Badge>
                  <Badge className="bg-[#DCFCE7] text-[#15803D] border-none px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    COMPLETED
                  </Badge>
                </div>
                {/* Desktop-only action buttons could go here */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-6 gap-x-8">
                <div className="flex items-center justify-between sm:block space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] font-black">Vehicle</p>
                  <p className="text-[15px] font-black text-[#111827] dark:text-white uppercase tracking-tight">{selectedBatch.vehicleNumber || 'MH03CL 8085'}</p>
                </div>
                <div className="flex items-center justify-between sm:block space-y-1 border-t sm:border-none pt-2 sm:pt-0 border-gray-50">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] font-black">Driver</p>
                  <p className="text-[15px] font-black text-[#111827] dark:text-white uppercase tracking-tight">{selectedBatch.driverName || 'Sameer'}</p>
                </div>
                <div className="flex items-center justify-between sm:block space-y-1 border-t sm:border-none pt-2 sm:pt-0 border-gray-50">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] font-black">PO Number</p>
                  <p className="text-[15px] font-black text-[#111827] dark:text-white uppercase tracking-tight">{selectedBatch.poNumber || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between sm:block space-y-1 border-t sm:border-none pt-2 sm:pt-0 border-gray-50">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] font-black">PO Attachment</p>
                  <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight truncate">
                    {selectedBatch.poAttachmentUrl ? <span className="underline cursor-pointer">View Attachment</span> : 'No File'}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:block space-y-1 border-t sm:border-none pt-2 sm:pt-0 border-gray-50">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] font-black">Date</p>
                  <p className="text-[15px] font-black text-[#111827] dark:text-white uppercase tracking-tight">
                    {new Date(selectedBatch.batchDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              {selectedBatch.notes && (
                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700/50">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#94A3B8] font-black mb-1.5">Notes</p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium italic leading-relaxed max-w-3xl">
                    "{selectedBatch.notes}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#475569]">Devices ({batchDevices.length || 2})</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="file"
                    id="excel-upload"
                    className="hidden"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleBulkUpload}
                  />
                  <Button
                    variant="outline"
                    className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-[#111827] dark:text-white shadow-sm hover:bg-gray-50"
                    onClick={() => document.getElementById('excel-upload')?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    Bulk Upload
                  </Button>
                </div>
                <Button
                  onClick={() => setView('add-device')}
                  className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#2563EB] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>


            {/* Devices List - Matching Screenshot 2 */}
            <div className="pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {(batchDevices.length > 0 ? batchDevices : [
                  { id: '1', barcode: 'L-APP-1925', brand: 'Apple', model: 'wsdfg', serialNumber: 'ASDF rgt', status: 'stock_out' },
                  { id: '2', barcode: 'L-DEL-4268', brand: 'Dell', model: 'asdfg', serialNumber: 'WASQ1234', status: 'stock_out' },
                  { id: '3', barcode: 'L-HP-9988', brand: 'HP', model: 'EliteBook', serialNumber: 'HPEB840', status: 'received' }
                ]).map((device, index) => (
                  <Card
                    key={device.id}
                    className="rounded-[1.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden animate-slide-up hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#EFF6FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-inner shrink-0 leading-none">
                              <Package className="w-6 h-6 text-[#2563EB]" />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-[#111827] dark:text-white leading-none uppercase tracking-tight truncate max-w-[150px]">
                                {device.model}
                              </h4>
                              <p className="text-[10px] text-[#64748B] font-black mt-1.5 uppercase tracking-wide">
                                {device.brand} • {device.barcode}
                              </p>
                              <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest mt-0.5">{device.serialNumber}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-[#DBEAFE] text-[#2563EB] bg-[#EFF6FF]/50 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter shrink-0 whitespace-nowrap">
                            {device.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Outward Dispatch History */}
                        <div className="mt-auto border-t border-gray-50 dark:border-gray-700/50 pt-4">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Outward Dispatch History</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center shrink-0">
                                <Truck className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase leading-none truncate">DISPATCHED TO RENTAL</p>
                                  <p className="text-[9px] font-bold text-gray-400 shrink-0">12 FEB</p>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium mt-1 truncate">Ref: DIS-2026-0045</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (view === 'add-device') {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-950">
        <header className="flex-shrink-0 border-b border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4">
          <button onClick={() => setView('detail')} className="p-2 hover:bg-gray-50 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase">Add New Product</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manual Device Entry</p>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</Label>
              <select
                className="w-full h-12 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={deviceForm.category}
                onChange={(e) => setDeviceForm({ ...deviceForm, category: e.target.value })}
              >
                <option>Laptop</option>
                <option>Desktop</option>
                <option>Server</option>
                <option>Monitor</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</Label>
              <Input
                placeholder="e.g. Dell, HP, Apple"
                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 font-bold"
                value={deviceForm.brand}
                onChange={(e) => setDeviceForm({ ...deviceForm, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Model Name / Number</Label>
            <Input
              placeholder="e.g. Latitude 5420, MacBook Pro"
              className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 font-bold"
              value={deviceForm.model}
              onChange={(e) => setDeviceForm({ ...deviceForm, model: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Serial Number</Label>
              <Input
                placeholder="Enter Serial No."
                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 font-bold"
                value={deviceForm.serialNumber}
                onChange={(e) => setDeviceForm({ ...deviceForm, serialNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Barcode</Label>
              <Input
                placeholder="Scan or Enter Barcode"
                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 font-bold"
                value={deviceForm.barcode}
                onChange={(e) => setDeviceForm({ ...deviceForm, barcode: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-8">
            <Button
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              onClick={() => {
                const newDevice: any = {
                  id: Date.now().toString(),
                  barcode: deviceForm.barcode,
                  serialNumber: deviceForm.serialNumber,
                  category: deviceForm.category,
                  brand: deviceForm.brand,
                  model: deviceForm.model,
                  status: 'received',
                  batchId: selectedBatch?.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                addDevice(newDevice);
                setView('detail');
                // Reset form
                setDeviceForm({
                  category: 'Laptop',
                  brand: '',
                  model: '',
                  serialNumber: '',
                  barcode: ''
                });
              }}
            >
              Add Device to Batch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>Inward</h1>
              {/* OPERATION text removed as requested */}
            </div>
            <Button
              onClick={() => setView('create')}
              size="sm"
              className="h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[9px] px-4 shadow-xl active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Batch
            </Button>
          </div>
          <div className="relative group">
            <Input
              placeholder="SEARCH BATCHES, CUSTOMERS OR COURIER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 pr-16 text-sm border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-4 focus:ring-blue-500/5 transition-all font-bold placeholder:text-gray-400/50 placeholder:text-[10px] placeholder:tracking-wider placeholder:font-black"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center group-focus-within:scale-110 active:scale-90"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Batches List */}
      <div className="flex-1 overflow-y-auto scrollable-content p-5 space-y-4">
        {filteredBatches.length === 0 ? (
          <Card className="rounded-[2.5rem] border-none bg-white dark:bg-gray-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden animate-scale-in">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white mb-2 uppercase">No batches found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-8">Create your first batch to start</p>
              <Button
                onClick={() => setView('create')}
                className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Batch
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5 pb-10">
            {filteredBatches.map((batch, index) => (
              <Card
                key={batch.id}
                className="rounded-3xl border-none bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] overflow-hidden animate-slide-up group border-l-4 border-l-transparent hover:border-l-blue-500"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  setSelectedBatch(batch);
                  setView('detail');
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-gray-900 dark:text-white tracking-tight">{batch.batchNumber}</span>
                      <Badge className={`rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-none ${batch.type === 'refurb'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                        : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20'
                        }`}>
                        {batch.type === 'refurb' ? 'Refurb' : 'Rental'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-md uppercase tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {batch.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400">
                        <User className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{batch.customerName || 'Standard Customer'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{batch.deviceCount} Items</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PO: {batch.poNumber || 'Uploaded'}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
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
