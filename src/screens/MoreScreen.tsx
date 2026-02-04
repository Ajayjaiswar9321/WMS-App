import { useState } from 'react';
import { useAuthStore, useDataStore, useUIStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Paintbrush,
  CheckSquare,
  Truck,
  Users,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Package,
  User as UserIcon,
  Moon,
  Sun,
  Database,
  Bell,
  HelpCircle,
  FileText,
  Edit2,
  Check
} from 'lucide-react';
import type { User, Role } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sub-screens
function PaintShopScreen({ onBack }: { onBack: () => void }) {
  const { devices } = useDataStore();
  const paintDevices = devices.filter(d =>
    d.status === 'in_paint_shop'
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Paint Shop</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-orange-600">0</p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{paintDevices.filter(d => d.status === 'in_paint_shop').length}</p>
              <p className="text-xs text-gray-500">In Paint</p>
            </CardContent>
          </Card>
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>
        {paintDevices.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-8 text-center">
              <Paintbrush className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No panels awaiting paint</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {paintDevices.map((device) => (
              <Card key={device.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{device.barcode}</p>
                      <p className="text-sm text-gray-500">{device.brand} {device.model}</p>
                    </div>
                    <Badge>{device.status.replace(/_/g, ' ')}</Badge>
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

function QCScreen({ onBack }: { onBack: () => void }) {
  const { devices } = useDataStore();
  const qcDevices = devices.filter(d =>
    d.status === 'awaiting_qc' || d.status === 'under_qc'
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Quality Control</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-orange-600">{qcDevices.filter(d => d.status === 'awaiting_qc').length}</p>
              <p className="text-xs text-gray-500">Awaiting QC</p>
            </CardContent>
          </Card>
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{qcDevices.filter(d => d.status === 'under_qc').length}</p>
              <p className="text-xs text-gray-500">Under QC</p>
            </CardContent>
          </Card>
        </div>
        {qcDevices.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No devices awaiting QC</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {qcDevices.map((device) => (
              <Card key={device.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{device.barcode}</p>
                      <p className="text-sm text-gray-500">{device.brand} {device.model}</p>
                    </div>
                    <Badge>{device.status.replace(/_/g, ' ')}</Badge>
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

function OutwardScreen({ onBack }: { onBack: () => void }) {
  const { dispatches } = useDataStore();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Outward</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-500">Available</p>
            </CardContent>
          </Card>
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{dispatches.filter(d => d.type === 'sales').length}</p>
              <p className="text-xs text-gray-500">Sales</p>
            </CardContent>
          </Card>
          <Card className="mobile-card">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-purple-600">{dispatches.filter(d => d.type === 'rental').length}</p>
              <p className="text-xs text-gray-500">Rental</p>
            </CardContent>
          </Card>
        </div>
        <Button
          className="w-full h-12 shadow-sm shadow-blue-500/20 font-bold"
          onClick={() => alert('New Dispatch feature coming soon!')}
        >
          <Truck className="w-4 h-4 mr-2" />
          New Dispatch
        </Button>
        {dispatches.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-8 text-center">
              <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No dispatches yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first dispatch</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dispatches.map((dispatch) => (
              <Card key={dispatch.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dispatch.id}</p>
                      <p className="text-sm text-gray-500">{dispatch.customerName}</p>
                    </div>
                    <Badge>{dispatch.type}</Badge>
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

function UsersScreen({ onBack }: { onBack: () => void }) {
  const { users, roles, addUser, updateUser } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', roleId: roles[0]?.id || '', status: 'active' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find(r => r.id === formData.roleId);
    if (!role) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: role,
        status: formData.status
      });
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: role,
        status: formData.status,
        createdAt: new Date().toISOString()
      };
      addUser(newUser);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">User Management</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="mobile-card shadow-3d border-none bg-blue-50/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-blue-600">{users.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-3d border-none bg-green-50/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-green-600">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active</p>
            </CardContent>
          </Card>
        </div>
        <Button
          className="w-full h-14 shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest btn-3d mb-6"
          onClick={handleOpenAdd}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New User
        </Button>
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="mobile-card shadow-3d border-none overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none font-bold text-[9px] tracking-widest uppercase py-0.5">
                        {user.role.name}
                      </Badge>
                      <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700 border-none text-[9px]' : 'bg-red-100 text-red-700 border-none text-[9px]'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenEdit(user)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assign Role</Label>
              <Select
                value={formData.roleId}
                onValueChange={value => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RolesScreen({ onBack }: { onBack: () => void }) {
  const { roles, addRole, updateRole } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningRole, setAssigningRole] = useState<Role | null>(null);
  const { users, updateUser } = useDataStore();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', code: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      code: role.code
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      updateRole(editingRole.id, {
        name: formData.name,
        description: formData.description,
        code: formData.code
      });
    } else {
      const newRole: Role = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        code: formData.code,
        permissions: [],
        type: 'custom',
        createdAt: new Date().toISOString()
      };
      addRole(newRole);
    }
    setIsDialogOpen(false);
  };

  const handleOpenAssign = (role: Role) => {
    setAssigningRole(role);
    setSelectedUserIds(users.filter(u => u.role.id === role.id).map(u => u.id));
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!assigningRole) return;
    // Update all selected users to this role
    users.forEach(user => {
      const isSelected = selectedUserIds.includes(user.id);
      const isCurrentlyInRole = user.role.id === assigningRole.id;

      if (isSelected && !isCurrentlyInRole) {
        updateUser(user.id, { role: assigningRole });
      } else if (!isSelected && isCurrentlyInRole && roles.length > 0) {
        // Option: if deselected, we could assign a default role, 
        // but typically you just want to add users to this role.
      }
    });
    setIsAssignDialogOpen(false);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUserIds(users.map(u => u.id));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Role Management</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4">
        <Button
          className="w-full h-14 shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest btn-3d mb-6"
          onClick={handleOpenAdd}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Role
        </Button>
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="mobile-card shadow-3d border-none overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${role.type === 'system' ? 'bg-purple-100' : 'bg-orange-100'} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <Shield className={`w-6 h-6 ${role.type === 'system' ? 'text-purple-600' : 'text-orange-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-gray-900 dark:text-white leading-tight">{role.name}</p>
                      <Badge className="text-[8px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 border-none">
                        {role.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{role.description}</p>
                    <code className="text-[10px] font-mono bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded text-blue-600">
                      {role.code}
                    </code>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-blue-600"
                      onClick={() => handleOpenEdit(role)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-green-600"
                      onClick={() => handleOpenAssign(role)}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Assign Users to Role
            </DialogTitle>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{assigningRole?.name}</p>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Users</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] font-black uppercase text-blue-600 h-7"
                onClick={selectAllUsers}
              >
                Select All
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollable-content">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => toggleUserSelection(user.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedUserIds.includes(user.id)
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedUserIds.includes(user.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black leading-tight">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                  {selectedUserIds.includes(user.id) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d"
              onClick={handleAssignSubmit}
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-[#1e293b]">
              {editingRole ? 'Edit Role' : 'Create Role'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sales Executive"
                className="h-12 rounded-xl focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Code</Label>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                placeholder="E.G. SALES_EXEC"
                className="h-12 rounded-xl font-mono text-sm focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</Label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the responsibilities..."
                className="w-full min-h-[100px] p-4 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 btn-3d">
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { theme, toggleTheme } = useUIStore();
  const { logout } = useAuthStore();

  const settingsItems = [
    { icon: Moon, label: 'Dark Mode', value: theme === 'dark', toggle: toggleTheme },
    { icon: Bell, label: 'Notifications', value: true },
    { icon: Database, label: 'Database', value: 'Connected' },
    { icon: FileText, label: 'Reports', value: null },
    { icon: HelpCircle, label: 'Help & Support', value: null },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
        {/* Database Status */}
        <Card className="mobile-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">Supabase</p>
                <p className="text-sm text-green-700 dark:text-green-300">PostgreSQL Database</p>
                <Badge className="bg-green-100 text-green-800 mt-1">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings List */}
        <Card className="mobile-card">
          <CardContent className="p-0">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${index !== settingsItems.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <button
                      onClick={item.toggle}
                      className={`w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                    </button>
                  ) : item.value ? (
                    <span className="text-sm text-gray-500">{item.value}</span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400">v1.0.0-beta</p>
      </div>
    </div>
  );
}

export function MoreScreen() {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const menuItems = [
    { id: 'paint', label: 'Paint Shop', icon: Paintbrush, color: 'bg-purple-500', count: 0 },
    { id: 'qc', label: 'Quality Control', icon: CheckSquare, color: 'bg-green-500', count: 0 },
    { id: 'outward', label: 'Outward', icon: Truck, color: 'bg-blue-500', count: 0 },
    { id: 'users', label: 'User Management', icon: Users, color: 'bg-orange-500', count: 0 },
    { id: 'roles', label: 'Role Management', icon: Shield, color: 'bg-red-500', count: 0 },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500', count: null },
  ];

  if (activeScreen === 'paint') {
    return <PaintShopScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'qc') {
    return <QCScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'outward') {
    return <OutwardScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'users') {
    return <UsersScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'roles') {
    return <RolesScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'settings') {
    return <SettingsScreen onBack={() => setActiveScreen(null)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">More</h1>
          <p className="text-xs text-gray-500">Additional Modules</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollable-content p-4 space-y-4">
        {/* User Profile */}
        <Card className="mobile-card shadow-3d animate-scale-in border-none glass-morphism overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 animate-float">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">{user?.name}</h2>
                <p className="text-sm font-medium text-gray-500 mb-2">{user?.email}</p>
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none font-black text-[10px] tracking-widest uppercase">
                  {user?.role.name}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="mobile-card shadow-3d border-none bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-black">5K+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Devices</p>
              </div>
            </CardContent>
          </Card>
          <Card className="mobile-card shadow-3d border-none bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-11 h-11 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shadow-inner">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-black">98%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">QC Pass</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className="relative flex flex-col items-center gap-2 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-3d btn-3d border border-gray-100/50 dark:border-gray-800"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10 animate-float`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tighter text-center leading-tight">{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <Badge className="absolute top-2 right-2 w-6 h-6 p-0 flex items-center justify-center bg-red-500 border-none shadow-lg animate-bounce">
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <Card className="mobile-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-500" />
                )}
                <span className="font-medium">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400">v1.0.0-beta</p>
      </div>
    </div>
  );
}
