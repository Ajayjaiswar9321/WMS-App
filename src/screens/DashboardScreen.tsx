import { useState } from 'react';
import { useAuthStore, useDashboardStats, useUIStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  ClipboardCheck,
  Wrench,
  Paintbrush,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  LogOut,
  Monitor,
  Battery,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const { setCurrentRoute } = useUIStore();
  const stats = useDashboardStats();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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

  // Workflow distribution data
  const workflowData = [
    { name: 'Inspection', value: stats.underInspection + stats.pendingInspection, color: COLORS[0] },
    { name: 'Repair', value: stats.underRepair + stats.inL3Repair, color: COLORS[1] },
    { name: 'Paint', value: stats.inPaintShop, color: COLORS[2] },
    { name: 'QC', value: stats.awaitingQC + stats.underQC, color: COLORS[3] },
    { name: 'Ready', value: stats.readyStock, color: COLORS[4] },
  ].filter(d => d.value > 0);

  const quickStats = [
    {
      label: 'Total Devices',
      value: stats.totalDevices,
      icon: Package,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      label: 'Pending Insp.',
      value: stats.pendingInspection,
      icon: ClipboardCheck,
      color: 'bg-yellow-500',
      trend: '2 new'
    },
    {
      label: 'In Paint',
      value: stats.inPaintShop,
      icon: Paintbrush,
      color: 'bg-purple-500',
      trend: '3 due'
    },
    {
      label: 'Ready Stock',
      value: stats.readyStock,
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+5'
    },
  ];

  const workflowStatuses = [
    { label: 'Waiting Spares', value: stats.waitingSpares, icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'L3 Repair', value: stats.inL3Repair, icon: Wrench, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Display', value: stats.inDisplayRepair, icon: Monitor, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Battery', value: stats.inBatteryRepair, icon: Battery, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">COMPRINT</h1>
              <p className="text-xs text-gray-500">Operations Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollable-content pb-4">
        <div className="px-4 py-3 space-y-3">
          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</p>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Just Now
            </Badge>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="mobile-card overflow-hidden shadow-3d animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Weekly Flow Chart */}
          <Card className="mobile-card shadow-3d animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Flow</h3>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  View All <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="inward" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="outward" fill="#10B981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="qcPassed" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-[10px] text-gray-500">Inward</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] text-gray-500">Outward</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-[10px] text-gray-500">QC</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Distribution */}
          {workflowData.length > 0 && (
            <Card className="mobile-card shadow-3d animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Workflow Distribution</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workflowData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {workflowData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {workflowData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflow Status */}
          <Card className="mobile-card shadow-3d animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Workflow Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {workflowStatuses.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <div key={index} className={`flex items-center gap-2 p-2.5 rounded-lg ${status.bgColor}`}>
                      <Icon className={`w-4 h-4 ${status.color}`} />
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">{status.value}</p>
                        <p className="text-[10px] text-gray-500">{status.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mobile-card shadow-3d animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardContent className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCurrentRoute('inward')}
                  className="quick-action shadow-3d p-4 rounded-2xl bg-white dark:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-2 mx-auto animate-float" style={{ animationDelay: '0.1s' }}>
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">New Batch</span>
                </button>
                <button
                  onClick={() => setCurrentRoute('inspection')}
                  className="quick-action shadow-3d p-4 rounded-2xl bg-white dark:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-2 mx-auto animate-float" style={{ animationDelay: '0.2s' }}>
                    <ClipboardCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Inspect</span>
                </button>
                <button
                  onClick={() => setCurrentRoute('repair')}
                  className="quick-action shadow-3d p-4 rounded-2xl bg-white dark:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-2 mx-auto animate-float">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Repair</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacer */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
