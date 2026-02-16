import { useDashboardStats, useUIStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardCheck,
  Boxes,
  Wrench,
  Paintbrush,
  ShieldCheck,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function DashboardScreen() {
  const stats = useDashboardStats();

  const { setCurrentRoute } = useUIStore();

  const statusOverview = [
    {
      label: 'Pending Inspection',
      value: stats.pendingInspection,
      route: 'inspection',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-100',
      iconBg: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Inspected',
      value: stats.inspected,
      route: 'inspection',
      icon: ClipboardCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600'
    },
    {
      label: 'Waiting for Spares',
      value: stats.waitingSpares,
      route: 'spares',
      icon: Boxes,
      color: 'bg-orange-50 text-orange-800 border-orange-100',
      iconBg: 'bg-orange-100 text-orange-600'
    },
    {
      label: 'In Paint',
      value: stats.inPaint,
      route: 'paint',
      icon: Paintbrush,
      color: 'bg-pink-50 text-pink-800 border-pink-100',
      iconBg: 'bg-pink-100 text-pink-600'
    },
    {
      label: 'In Repair',
      value: stats.inRepair,
      route: 'repair',
      icon: Wrench,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'In QC',
      value: stats.inQC,
      route: 'qc',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100',
      iconBg: 'bg-indigo-100 text-indigo-600'
    },
    {
      label: 'Ready for Stock',
      value: stats.readyForStock,
      route: 'inventory',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100 shadow-emerald-100/20',
      iconBg: 'bg-emerald-500 text-white'
    },
    {
      label: 'In Stock',
      value: stats.inStock,
      route: 'inventory',
      icon: Package,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100 shadow-indigo-100/20',
      iconBg: 'bg-indigo-600 text-white'
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - Only visible on mobile/tablet because desktop has Sidebar */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 lg:hidden safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="COMPRINT" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-1">
            {/* Refresh removed as requested */}
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollable-content pb-24">
        <div className="px-4 py-4 space-y-6">
          <Card className="rounded-3xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Status Overview</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {statusOverview.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentRoute(item.route as any)}
                      className={`p-4 rounded-2xl border ${item.color} flex flex-col items-start gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group relative overflow-hidden`}
                    >
                      <div className="flex w-full items-start justify-between">
                        <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black tracking-tight">{item.value}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-tight leading-tight">
                          {item.label}
                        </p>
                        <p className="text-[8px] font-bold opacity-50 uppercase tracking-widest">Tap to view</p>
                      </div>

                      {/* Decorative background element */}
                      <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Icon className="w-16 h-16" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
