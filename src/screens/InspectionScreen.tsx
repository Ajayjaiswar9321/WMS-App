import { useState } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Search,
  ClipboardCheck,
  ChevronRight,
  Check,
  X,
  Plus,
  Package,
  Truck,
  Upload
} from 'lucide-react';
import type { Device, Batch } from '@/types';
import { parseCSV } from '@/utils/csvParser';

export function InspectionScreen() {
  const { devices, batches, updateDevice, addBatch, addDevice } = useDataStore();
  const [view, setView] = useState<'scan' | 'inspect' | 'create-batch'>('scan');
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Batch Form State
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

  const checklistItems = [
    'AB Panel Damage',
    'CD Panel Damage',
    'Display White Spot',
    'Display Line / Color Patch',
    'Keyboard Working',
    'Touchpad Working',
    'Battery Health Check',
    'Ports Working',
    'Camera Working',
    'Speaker Working'
  ];

  const [checklist, setChecklist] = useState<Record<string, 'pass' | 'fail' | null>>(
    Object.fromEntries(checklistItems.map(item => [item, null]))
  );

  // Get devices pending inspection
  const pendingDevices = devices.filter(d =>
    d.status === 'pending_inspection' || d.status === 'received'
  );

  const handleScan = () => {
    const device = devices.find(d => d.barcode === barcodeInput || d.serialNumber === barcodeInput);
    if (device) {
      setScannedDevice(device);
      setView('inspect');
      // Reset checklist
      setChecklist(Object.fromEntries(checklistItems.map(item => [item, null])));
      setNotes('');
    }
  };

  const toggleChecklist = (item: string, status: 'pass' | 'fail') => {
    setChecklist(prev => ({
      ...prev,
      [item]: prev[item] === status ? null : status
    }));
  };

  const handleSubmitInspection = () => {
    if (scannedDevice) {
      updateDevice(scannedDevice.id, {
        status: 'under_inspection'
      });
      setView('scan');
      setBarcodeInput('');
      setScannedDevice(null);
    }
  };

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
    setView('scan');
    // Reset form
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

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const devices = await parseCSV(file);

        // Add parsed devices to store
        // If a batch was just created, we might want to associate them, but for now 
        // we'll just add them as 'received' status
        devices.forEach(device => {
          addDevice({
            ...device,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Device);
        });

        alert(`Successfully uploaded ${devices.length} devices.`);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to parse CSV file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (view === 'create-batch') {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Create New Batch</h1>
            <button
              onClick={() => setView('scan')}
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
              onClick={() => setView('scan')}
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

  if (view === 'inspect' && scannedDevice) {
    const passedCount = Object.values(checklist).filter(v => v === 'pass').length;
    const totalCount = checklistItems.length;

    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView('scan')}
              className="p-2.5 -ml-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>Inspection</h1>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1">Checklist Audit</p>
            </div>
          </div>
          <div className="px-5 pb-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white leading-none">{scannedDevice.model}</h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase truncate max-w-[150px]">{scannedDevice.brand} • {scannedDevice.barcode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue-600 leading-none">{passedCount}/{totalCount}</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">PASSED</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-5">
          {/* Specs Bar - Responsive Grid */}
          <Card className="rounded-2xl border-none bg-black dark:bg-white shadow-xl overflow-hidden animate-scale-in">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Category</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase truncate">{scannedDevice.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Processor</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase">{scannedDevice.processor || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">RAM</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase">{scannedDevice.ram || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Storage</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase">{scannedDevice.storage || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Station */}
          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <Card
                key={item}
                className="rounded-[1.25rem] border-none shadow-sm bg-white dark:bg-gray-800 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] transition-colors ${checklist[item] === 'pass' ? 'bg-emerald-50 text-emerald-600' :
                      checklist[item] === 'fail' ? 'bg-red-50 text-red-600' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                      {index + 1}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate pr-2 uppercase tracking-tight">{item}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleChecklist(item, 'fail')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${checklist[item] === 'fail'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        : 'bg-gray-50 text-gray-400 dark:bg-gray-900'
                        }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleChecklist(item, 'pass')}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${checklist[item] === 'pass'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-gray-50 text-gray-400 dark:bg-gray-900'
                        }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Observations */}
          <div className="space-y-3 pt-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Additional Observations</Label>
            <textarea
              placeholder="Enter any other issues or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[140px] p-5 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] resize-none focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>

          {/* Final Action */}
          <div className="flex gap-4 pt-4 pb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              variant="outline"
              className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] border-gray-100 dark:border-gray-800 text-gray-400 bg-white dark:bg-gray-800"
              onClick={() => setView('scan')}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-black dark:bg-white dark:text-black text-white shadow-2xl hover:opacity-90 active:scale-95 transition-all"
              onClick={handleSubmitInspection}
              disabled={Object.values(checklist).some(v => v === null)}
            >
              Finish Inspection
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
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Inspection</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Scan and verify inventory</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-5 space-y-6">
        {/* Search Bar Direct Access */}
        <div className="space-y-4">
          <div className="relative group">
            <Input
              placeholder="Enter Barcode"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="h-16 pr-16 text-sm border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-4 focus:ring-blue-500/5 transition-all font-bold placeholder:text-gray-400/50 placeholder:text-[10px] placeholder:tracking-wider placeholder:font-black"
            />
            <button
              onClick={handleScan}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center group-focus-within:scale-110 active:scale-90"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => document.getElementById('bulk-upload-input')?.click()}
            className="h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <input
              type="file"
              id="bulk-upload-input"
              className="hidden"
              accept=".csv"
              onChange={handleBulkUpload}
              disabled={isUploading}
            />
            <Upload className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
              {isUploading ? 'Uploading...' : 'Bulk Upload'}
            </span>
          </button>
          <button
            onClick={() => setView('create-batch')}
            className="h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Create Batch</span>
          </button>
        </div>


        {/* Pending Devices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">Recently Received</h3>
            <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] px-3 py-1 rounded-full">{pendingDevices.length} TOTAL</Badge>
          </div>

          <div className="space-y-4 pb-12">
            {pendingDevices.map((device, index) => (
              <Card
                key={device.id}
                className="rounded-3xl border-none bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all active:scale-[0.98] animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  setScannedDevice(device);
                  setView('inspect');
                  setChecklist(Object.fromEntries(checklistItems.map(item => [item, null])));
                  setNotes('');
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shadow-inner">
                        <ClipboardCheck className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none tracking-tight">
                          {device.model}
                        </h3>
                        <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest mt-1.5">
                          {device.brand} • {device.barcode}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] px-2.5 py-1 rounded-lg uppercase tracking-tight">
                      Ready
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <span className="text-[9px] font-black text-gray-500 uppercase">{device.category}</span>
                      </div>
                      <p className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-tighter">SN: {device.serialNumber}</p>
                    </div>
                    <div className="flex items-center text-blue-600 font-black text-[10px] uppercase tracking-widest group">
                      INS <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
