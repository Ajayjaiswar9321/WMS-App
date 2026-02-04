import { useState, useRef } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Camera,
  Search,
  ClipboardCheck,
  CheckCircle,
  Scan,
  FileImage,
  Save,
  ChevronRight
} from 'lucide-react';
import type { Device } from '@/types';

interface InspectionForm {
  physicalCondition: string;
  displayCondition: string;
  keyboardCondition: string;
  touchpadCondition: string;
  portsCondition: string;
  batteryHealth: string;
  findings: string[];
  notes: string;
}

export function InspectionScreen() {
  const { devices, updateDevice } = useDataStore();
  const [view, setView] = useState<'scan' | 'inspect' | 'detail'>('scan');
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [inspectionForm, setInspectionForm] = useState<InspectionForm>({
    physicalCondition: '',
    displayCondition: '',
    keyboardCondition: '',
    touchpadCondition: '',
    portsCondition: '',
    batteryHealth: '',
    findings: [],
    notes: ''
  });
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get devices pending inspection
  const pendingDevices = devices.filter(d =>
    d.status === 'pending_inspection' || d.status === 'received'
  );

  const handleScan = () => {
    const device = devices.find(d => d.barcode === barcodeInput || d.serialNumber === barcodeInput);
    if (device) {
      setScannedDevice(device);
      setView('inspect');
    }
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

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock processing - pick a random device or first pending
      const randomDevice = pendingDevices[Math.floor(Math.random() * pendingDevices.length)];
      if (randomDevice) {
        setScannedDevice(randomDevice);
        setView('inspect');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock processing
      const randomDevice = pendingDevices[Math.floor(Math.random() * pendingDevices.length)];
      if (randomDevice) {
        setScannedDevice(randomDevice);
        setView('inspect');
      }
    }
  };

  const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];

  if (view === 'inspect' && scannedDevice) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setView('scan')}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Inspect Device</h1>
              <p className="text-xs text-gray-500">{scannedDevice.barcode}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
          {/* Device Info */}
          <Card className="mobile-card bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900 shadow-3d animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-100 text-lg leading-tight">{scannedDevice.brand} {scannedDevice.model}</p>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{scannedDevice.category}</p>
                  <p className="text-[10px] font-mono tracking-widest text-blue-600 dark:text-blue-500 uppercase">S/N: {scannedDevice.serialNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspection Form */}
          <div className="space-y-4">
            {/* Physical Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Physical Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {conditionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setInspectionForm({ ...inspectionForm, physicalCondition: option })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${inspectionForm.physicalCondition === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {conditionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setInspectionForm({ ...inspectionForm, displayCondition: option })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${inspectionForm.displayCondition === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Condition */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Keyboard Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {conditionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setInspectionForm({ ...inspectionForm, keyboardCondition: option })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${inspectionForm.keyboardCondition === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Health */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Battery Health</label>
              <div className="grid grid-cols-3 gap-2">
                {['Excellent (>80%)', 'Good (60-80%)', 'Poor (<60%)', 'Dead', 'N/A'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setInspectionForm({ ...inspectionForm, batteryHealth: option })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${inspectionForm.batteryHealth === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Issues Found</label>
              <div className="space-y-2">
                {[
                  'Display Damage',
                  'Keyboard Issue',
                  'Touchpad Not Working',
                  'Battery Issue',
                  'Port Damage',
                  'Physical Damage',
                  'Motherboard Issue',
                  'No Power'
                ].map((issue) => (
                  <label key={issue} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={inspectionForm.findings.includes(issue)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setInspectionForm({
                            ...inspectionForm,
                            findings: [...inspectionForm.findings, issue]
                          });
                        } else {
                          setInspectionForm({
                            ...inspectionForm,
                            findings: inspectionForm.findings.filter(f => f !== issue)
                          });
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Additional Notes</label>
              <textarea
                placeholder="Add any additional observations..."
                value={inspectionForm.notes}
                onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                className="w-full min-h-[120px] p-4 rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm shadow-3d focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 pb-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-bold border-gray-200 dark:border-gray-800"
              onClick={() => setView('scan')}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              onClick={handleSubmitInspection}
            >
              <Save className="w-5 h-5 mr-2" />
              Save
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
          <h1 className="text-lg font-semibold">Inspection</h1>
          <p className="text-xs text-gray-500">Scan and inspect devices</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
        {/* Scan Section */}
        <Card className="mobile-card shadow-3d animate-scale-in">
          <CardContent className="p-8">
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <div className="w-18 h-18 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-3d animate-float">
                  <Scan className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h3 className="font-black text-3xl tracking-tight text-gray-900 dark:text-white mb-2">Scan Device</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enter barcode or scan to begin</p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Enter barcode or serial number..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="h-14 pr-14 text-base border-gray-200 dark:border-gray-800 rounded-xl"
                />
                <button
                  onClick={handleScan}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan from Camera
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage className="w-5 h-5 mr-2" />
                Scan from Image/PDF
              </Button>

              {/* Hidden Inputs */}
              <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleCapture}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending Inspections */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Inspection</h3>
            <Badge variant="secondary">{pendingDevices.length}</Badge>
          </div>

          {pendingDevices.length === 0 ? (
            <Card className="mobile-card">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                <p className="text-gray-500">No devices pending inspection</p>
                <p className="text-sm text-gray-400 mt-1">All devices have been inspected</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingDevices.map((device, index) => (
                <Card
                  key={device.id}
                  className="mobile-card cursor-pointer shadow-3d animate-slide-up hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    setScannedDevice(device);
                    setView('inspect');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center shadow-inner">
                          <ClipboardCheck className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{device.barcode}</p>
                          <p className="text-xs font-medium text-gray-500">{device.brand} {device.model}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shadow-sm">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
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
