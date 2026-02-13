import { useUIStore, useAuthStore } from '@/store';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { InwardScreen } from '@/screens/InwardScreen';
import { InspectionScreen } from '@/screens/InspectionScreen';
import { RepairScreen } from '@/screens/RepairScreen';
import { InventoryScreen } from '@/screens/InventoryScreen';
import { MoreScreen, PaintShopScreen, QCScreen, OutwardScreen, UsersScreen, RolesScreen, SettingsScreen } from '@/screens/MoreScreen';
import { SparesScreen } from '@/screens/SparesScreen';
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  Wrench,
  Boxes,
  Paintbrush,
  ShieldCheck,
  UserCog, // Re-added missing import
  LogOut,
  Truck, // Updated icon
  User,
  MoreHorizontal
} from 'lucide-react';

type TabType = 'dashboard' | 'inward' | 'inspection' | 'spares' | 'repair' | 'paint' | 'qc' | 'inventory' | 'outward' | 'users' | 'roles' | 'more' | 'settings';

const menuItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inward', label: 'Inward', icon: Package },
  { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
  { id: 'spares', label: 'Spares', icon: Boxes },
  { id: 'repair', label: 'Repair', icon: Wrench },
  { id: 'paint', label: 'Paint', icon: Paintbrush },
  { id: 'qc', label: 'QC', icon: ShieldCheck },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'outward', label: 'Outward', icon: Truck },
  { id: 'users', label: 'User Management', icon: UserCog },
  { id: 'roles', label: 'Role Management', icon: ShieldCheck },
];

export function MainApp() {
  const { currentRoute, setCurrentRoute } = useUIStore();
  const { logout } = useAuthStore();
  const activeTab = currentRoute as TabType;

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen />;
      case 'inward': return <InwardScreen />;
      case 'inspection': return <InspectionScreen />;
      case 'spares': return <SparesScreen />;
      case 'repair': return <RepairScreen onBack={() => setCurrentRoute('more')} />;
      case 'inventory': return <InventoryScreen />;
      case 'paint': return <PaintShopScreen onBack={() => setCurrentRoute('more')} />;
      case 'qc': return <QCScreen onBack={() => setCurrentRoute('more')} />;
      case 'outward': return <OutwardScreen onBack={() => setCurrentRoute('more')} />;
      case 'users': return <UsersScreen onBack={() => setCurrentRoute('more')} />;
      case 'roles': return <RolesScreen onBack={() => setCurrentRoute('more')} />;
      case 'settings': return <SettingsScreen onBack={() => setCurrentRoute('more')} />;
      case 'more': return <MoreScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="h-full w-full flex bg-[#F9FBFF] dark:bg-gray-950 overflow-hidden">
      {/* Sidebar - Desktop Layout */}
      <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex flex-col items-center gap-2 mb-10">
            <img src="/logo.png" alt="COMPRINT" className="h-16 w-auto object-contain" />
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRoute(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
              SA
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-none">Super Admin</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-1">Super Administrator</p>
            </div>
            <User className="w-4 h-4 text-gray-300" />
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-all active:scale-95 group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <main className="flex-1 overflow-auto relative pb-[80px] lg:pb-0">
          <div key={activeTab} className="h-full animate-fade-in">
            {renderScreen()}
          </div>
        </main>

        {/* Mobile Navigation - Only visible on small screens */}
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden safe-area-bottom z-50">
          <div className="mx-3 mb-3 glass-morphism rounded-[1.25rem] shadow-2xl h-[68px] px-1 flex items-center justify-around border border-white/20">
            {menuItems.slice(0, 5).concat([{ id: 'more', label: 'More', icon: MoreHorizontal }]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentRoute(tab.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 flex-1 min-w-0 ${isActive
                    ? 'text-blue-600 bg-blue-50/80 dark:bg-blue-900/40 transform scale-105 shadow-inner'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-[8px] font-black uppercase tracking-tighter leading-none truncate w-full px-1 ${isActive ? 'text-blue-700' : ''}`}>
                    {tab.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
