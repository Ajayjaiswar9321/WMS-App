import { useState } from 'react';
import { useDataStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Package,
    Search,
    CheckCircle,
    Boxes,
    Badge
} from 'lucide-react';

export function SparesScreen() {
    const { devices } = useDataStore();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock stats matching user image
    const stats = {
        waiting: devices.filter(d => d.status === 'waiting_spares').length,
        partially: 0,
        completed: 16 // Matching the image's "16" for fully completed
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header - Mobile First */}
            <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 safe-area-top">
                <div className="px-4 py-4">
                    <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">Spares Management</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mt-1">Spare parts inventory</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto scrollable-content px-4 py-4 pb-24 space-y-6">
                {/* Stats Grid - Mobile First */}
                <div className="grid grid-cols-3 gap-3">
                    <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                                    <Boxes className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.waiting}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">WAITING</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.partially}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">PARTIAL</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.completed}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">DONE</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar - Mobile Optimized */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                        placeholder="Search devices..."
                        className="h-12 pl-11 rounded-2xl bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-sm font-medium placeholder:text-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Table Content - Desktop Only */}
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm overflow-hidden hidden lg:block">
                    <div className="grid grid-cols-5 bg-gray-50/50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Device</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Category</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Requested By</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Waiting Since</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {devices.filter(d => d.status === 'waiting_spares').concat([
                            { id: 'demo1', barcode: 'L-APP-1925', brand: 'Apple', model: 'MacBook Pro M1', serialNumber: 'SN12345', status: 'waiting_spares', category: 'Laptop', createdAt: '', updatedAt: '' }
                        ] as any).map((device) => (
                            <div key={device.id} className="grid grid-cols-5 p-4 items-center">
                                <div className="text-center">
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{device.model}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{device.barcode}</p>
                                </div>
                                <div className="text-center text-[10px] font-black text-gray-500 uppercase">{device.category}</div>
                                <div className="text-center text-[10px] font-black text-gray-500 uppercase">Technician A</div>
                                <div className="text-center text-[10px] font-black text-gray-500 uppercase">2 Days</div>
                                <div className="text-center">
                                    <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] uppercase">Waiting</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card Content - Mobile */}
                <div className="lg:hidden">
                    <Card className="rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">No waiting spares</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">All devices fulfilled</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
