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
  X
} from 'lucide-react';
import type { Device } from '@/types';

export function InspectionScreen() {
  const { devices, updateDevice } = useDataStore();
  const [view, setView] = useState<'scan' | 'inspect'>('scan');
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [notes, setNotes] = useState('');

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
                  <h2 className="text-sm font-black text-gray-900 dark:text-white leading-none">{scannedDevice.barcode}</h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase truncate max-w-[150px]">{scannedDevice.brand} {scannedDevice.model}</p>
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
                <p className="text-[11px] font-black text-white dark:text-black uppercase">Intel i5</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">RAM</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase">8GB</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Storage</p>
                <p className="text-[11px] font-black text-white dark:text-black uppercase">256GB</p>
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
                          {device.barcode}
                        </h3>
                        <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest mt-1.5">
                          {device.brand} {device.model}
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
