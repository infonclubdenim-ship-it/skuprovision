'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllUsersAction, updateUserProfileAction, createUserAction } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, ArrowUpDown, MessageSquare, Edit2, ShieldAlert, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    plan: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<keyof UserProfile>('created_at');
    const [sortAsc, setSortAsc] = useState(false);
    
    const [modalState, setModalState] = useState<{ type: 'create' | 'edit' | null, user: UserProfile | null }>({ type: null, user: null });
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<{ name: string; email: string; password?: string; role: string; plan: string }>({ name: '', email: '', password: '', role: 'user', plan: 'free' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsersAction();
            const mappedUsers: UserProfile[] = data.map(user => ({
                id: user.id,
                email: user.email || '',
                full_name: user.name,
                phone: user.phone,
                role: user.role,
                plan: user.plan || 'free',
                is_active: user.status === 'active',
                created_at: user.createdAt.toISOString(),
                updated_at: user.updatedAt.toISOString(),
            }));
            setUsers(mappedUsers);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus ? 'active' : 'suspended';
            await updateUserProfileAction(id, { status: newStatus });

            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, is_active: !currentStatus } : u
            ));
            toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleSort = (field: keyof UserProfile) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleOpenCreate = () => {
        setFormData({ name: '', email: '', password: '', role: 'user', plan: 'free' });
        setModalState({ type: 'create', user: null });
    };

    const handleOpenEdit = (user: UserProfile) => {
        setFormData({ name: user.full_name || '', email: user.email, password: '', role: user.role || 'user', plan: user.plan || 'free' });
        setModalState({ type: 'edit', user });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, user: null });
    };

    const handleSaveUser = async () => {
        if (!formData.email) {
            toast.error('Email is required');
            return;
        }
        
        setSaving(true);
        try {
            if (modalState.type === 'create') {
                await createUserAction({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password || undefined,
                    role: formData.role,
                    plan: formData.plan
                });
                toast.success('User created successfully');
            } else if (modalState.type === 'edit' && modalState.user) {
                const updates: any = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    plan: formData.plan
                };
                // Only send password if we are resetting it
                // Note: Implement password change safely via bcrypt if desired. For now, we only update other fields. 
                // Creating a reset password specifically is better for security but we can skip checking password strictly here or handle later.
                await updateUserProfileAction(modalState.user.id, updates);
                toast.success('User updated successfully');
            }
            fetchUsers(); // Refresh the list
            handleCloseModal();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    const filteredUsers = users
        .filter(u =>
            (u.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
            (u.full_name?.toLowerCase().includes(search.toLowerCase()) || false)
        )
        .sort((a, b) => {
            const valA = a[sortField] || '';
            const valB = b[sortField] || '';
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

    const planColors: Record<string, string> = {
        enterprise: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        pro: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        basic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        free: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-slate-400 mt-1">Manage platform users, roles, plans and status.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search email or name..."
                            className="pl-9 h-10 bg-white/5 border-white/10 text-white rounded-xl focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <Button onClick={handleOpenCreate} className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </motion.div>

            <Card className="bg-white/[0.02] border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('email')}>
                                    <div className="flex items-center gap-2">User <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('plan')}>
                                    <div className="flex items-center gap-2">Plan <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('role')}>
                                    <div className="flex items-center gap-2">Role <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('created_at')}>
                                    <div className="flex items-center gap-2">Joined <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td className="px-6 py-4"><div className="h-5 w-48 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-20 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-5 w-16 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-white/5 rounded animate-pulse ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{user.full_name || '—'}</div>
                                            <div className="text-slate-500 text-xs">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`capitalize border ${planColors[user.plan] || planColors.free}`}>
                                                {user.plan}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'super_admin' ? (
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> Super Admin
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 capitalize">{user.role}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                disabled={user.role === 'super_admin'}
                                                className={`px-3 py-1 rounded-full text-[10px] font-medium border transition-colors ${user.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
                                                    } ${user.role === 'super_admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={modalState.type !== null} onOpenChange={(open) => !open && handleCloseModal()}>
                <DialogContent className="bg-slate-900 border-white/10 text-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>{modalState.type === 'create' ? 'Add New User' : 'Edit User'}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {modalState.type === 'create' ? 'Create a local user with email, password, and specific plan access.' : "Update an existing user's role, plan, and details manually."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                placeholder="John Doe" 
                                className="bg-white/5 border-white/10 text-white" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-red-400">*</span></Label>
                            <Input 
                                id="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                disabled={modalState.type === 'edit'}
                                placeholder="john@example.com" 
                                className="bg-white/5 border-white/10 text-white" 
                            />
                        </div>

                        {modalState.type === 'create' && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Temporary Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                    placeholder="Leave blank to skip" 
                                    className="bg-white/5 border-white/10 text-white" 
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">User Role</Label>
                                <Select value={(formData.role as string) || 'user'} onValueChange={(val) => setFormData({ ...formData, role: val || 'user' })}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="plan">Subscription Plan</Label>
                                <Select value={(formData.plan as string) || 'free'} onValueChange={(val) => setFormData({ ...formData, plan: val || 'free' })}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select plan" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        <SelectItem value="free">Free</SelectItem>
                                        <SelectItem value="basic">Basic (Paid)</SelectItem>
                                        <SelectItem value="pro">Pro (Paid)</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal} className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser} disabled={saving} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-md">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {modalState.type === 'create' ? 'Create User' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
