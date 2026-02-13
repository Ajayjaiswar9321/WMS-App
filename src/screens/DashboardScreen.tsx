import { useDashboardStats } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  RefreshCw,
  Clock,
  Box,
  TrendingUp,
  Truck,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function DashboardScreen() {
  const stats = useDashboardStats();

  const handleRefresh = () => {
    window.location.reload();
  };

  // Color mapping for Status Overview
  const statusColors = {
    'Received': 'bg-gray-50 text-gray-900 border-gray-100',
    'Pending Inspection': 'bg-yellow-50 text-yellow-800 border-yellow-100',
    'Under Inspection': 'bg-blue-50 text-blue-800 border-blue-100',
    'Inspected': 'bg-emerald-50 text-emerald-800 border-emerald-100',
    'Waiting for Spares': 'bg-orange-50 text-orange-800 border-orange-100',
    'Ready for Repair': 'bg-purple-50 text-purple-800 border-purple-100',
    'Under Repair': 'bg-blue-50 text-blue-800 border-blue-100',
    'In L3 Repair': 'bg-indigo-50 text-indigo-800 border-indigo-100',
    'In Display Repair': 'bg-sky-50 text-sky-800 border-sky-100',
    'In Battery Boost': 'bg-amber-50 text-amber-800 border-amber-100',
    'In Paint Shop': 'bg-pink-50 text-pink-800 border-pink-100',
    'In Repair Workflow': 'bg-blue-50 text-blue-800 border-blue-100',
  };

  const workflowData = [
    { name: 'Inward', value: 40, color: '#3B82F6' },
    { name: 'Outward', value: 30, color: '#10B981' },
    { name: 'QC Passed', value: 30, color: '#8B5CF6' },
  ];

  // Weekly flow data (mock)
  const weeklyData = [
    { day: 'Mon', inward: 12, outward: 8, qcPassed: 10 },
    { day: 'Tue', inward: 15, outward: 12, qcPassed: 14 },
    { day: 'Wed', inward: 8, outward: 15, qcPassed: 12 },
    { day: 'Thu', inward: 20, outward: 10, qcPassed: 16 },
    { day: 'Fri', inward: 18, outward: 18, qcPassed: 20 },
    { day: 'Sat', inward: 10, outward: 14, qcPassed: 12 },
    { day: 'Sun', inward: 5, outward: 8, qcPassed: 6 },
  ];

  const summaryStats = [
    { label: 'TOTAL DEVICES', value: stats.totalDevices, icon: Box, trend: '+ 12%', trendColor: 'text-emerald-500 bg-emerald-50' },
    { label: 'PENDING INSPECTION', value: stats.awaitingQC, icon: Clock, trend: null },
    { label: 'IN PAINT SHOP', value: stats.inPaintShop, icon: Truck, trend: null },
    { label: 'READY FOR STOCK', value: stats.readyStock, icon: CheckCircle, trend: '+ 18%', trendColor: 'text-emerald-500 bg-emerald-50' },
  ];

  const statusOverview = [
    { label: 'Received', value: 0 },
    { label: 'Pending Inspection', value: stats.awaitingQC },
    { label: 'Under Inspection', value: stats.underQC },
    { label: 'Inspected', value: 0 },
    { label: 'Waiting for Spares', value: stats.waitingSpares },
    { label: 'Ready for Repair', value: 0 },
    { label: 'Under Repair', value: 0 },
    { label: 'In L3 Repair', value: 0 },
    { label: 'In Display Repair', value: 0 },
    { label: 'In Battery Boost', value: 0 },
    { label: 'In Paint Shop', value: stats.inPaintShop },
    { label: 'In Repair Workflow', value: 0 },
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
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#64748B]" />
            </button>
            <div className="flex flex-col items-end gap-1 px-2 border-l border-gray-100 dark:border-gray-800 ml-1">
              <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest leading-none">Last Sync</p>
              <p className="text-[10px] font-black text-gray-900 dark:text-white leading-none mt-1">Just Now</p>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollable-content pb-24">
        <div className="px-4 py-4 space-y-6">
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        {stat.label}
                      </p>
                      <Icon className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                        {stat.value}
                      </p>
                      {stat.trend && (
                        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${stat.trendColor}`}>
                          <TrendingUp className="w-2.5 h-2.5" />
                          <span className="text-[9px] font-bold">{stat.trend}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Device Status Overview Grid */}
          <Card className="rounded-3xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Device Status Overview</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {statusOverview.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border border-transparent ${statusColors[item.label as keyof typeof statusColors] || 'bg-gray-50'} flex flex-col items-start justify-between min-h-[70px] transition-all active:scale-95`}
                  >
                    <p className="text-[10px] font-bold opacity-60 leading-tight">
                      {item.label}
                    </p>
                    <p className="text-xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Banner */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 flex flex-col gap-2 animate-slide-up">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <ShieldAlert className="w-4 h-4" />
              <p className="text-[11px] font-black uppercase tracking-widest">Waiting for Spares</p>
            </div>
            <p className="text-3xl font-black text-orange-600 dark:text-orange-400 leading-none">{stats.waitingSpares}</p>
            <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 font-medium">Devices pending spare parts</p>
          </div>

          <div className="grid gap-6">
            {/* Weekly Flow Chart */}
            <Card className="rounded-3xl border-none bg-white dark:bg-gray-900 shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Weekly Flow</h3>
                    <p className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Throughput overview</p>
                  </div>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: '900',
                        }}
                      />
                      <Area type="monotone" dataKey="inward" stroke="#3B82F6" fillOpacity={1} fill="url(#colorInward)" strokeWidth={3} />
                      <Area type="monotone" dataKey="outward" stroke="#10B981" fillOpacity={1} fill="url(#colorOutward)" strokeWidth={3} />
                      <Area type="monotone" dataKey="qcPassed" stroke="#8B5CF6" fillOpacity={0} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Inward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Outward</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Distribution */}
            <Card className="rounded-3xl border-none bg-white dark:bg-gray-900 shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-5">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Workflow Distribution</h3>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workflowData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {workflowData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center justify-center">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">100%</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
