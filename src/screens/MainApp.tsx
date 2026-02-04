import { useUIStore } from '@/store';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { InwardScreen } from '@/screens/InwardScreen';
import { InspectionScreen } from '@/screens/InspectionScreen';
import { RepairScreen } from '@/screens/RepairScreen';
import { InventoryScreen } from '@/screens/InventoryScreen';
import { MoreScreen } from '@/screens/MoreScreen';
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  Wrench,
  Boxes,
  MoreHorizontal
} from 'lucide-react';

type TabType = 'dashboard' | 'inward' | 'inspection' | 'repair' | 'inventory' | 'more';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'inward', label: 'Inward', icon: Package },
  { id: 'inspection', label: 'Inspect', icon: ClipboardCheck },
  { id: 'repair', label: 'Repair', icon: Wrench },
  { id: 'inventory', label: 'Stock', icon: Boxes },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export function MainApp() {
  const { currentRoute, setCurrentRoute } = useUIStore();
  const activeTab = currentRoute as TabType;

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'inward':
        return <InwardScreen />;
      case 'inspection':
        return <InspectionScreen />;
      case 'repair':
        return <RepairScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Main Content - takes remaining space */}
      <main className="flex-1 overflow-hidden relative">
        <div
          key={activeTab}
          className="h-full w-full animate-slide-up"
        >
          {renderScreen()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 z-50">
        <div className="mx-4 mb-4 glass-morphism rounded-2xl shadow-3d h-[70px] px-2 flex items-center justify-around transition-all duration-300">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentRoute(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-[50px] btn-3d ${isActive
                  ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <Icon className={`w-5 h-5 mb-1 transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`} />
                <span className={`text-[10px] font-bold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
