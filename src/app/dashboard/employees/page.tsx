'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getEmployeesAction, addEmployeeAction, removeEmployeeAction } from '@/actions/employees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Eye, Loader2, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
    id: string;
    employee_email: string;
    employee_name: string | null;
    is_active: boolean;
    created_at: string;
}

export default function EmployeesPage() {
    const { user, profile } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const maxEmployees = profile?.plan === 'enterprise' ? 20 : profile?.plan === 'pro' ? 5 : profile?.plan === 'basic' ? 2 : 0;

    useEffect(() => {
        if (!user) return;
        fetchEmployees();
    }, [user]);

    const fetchEmployees = async () => {
        try {
            const data = await getEmployeesAction();
            setEmployees(data);
        } catch {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const addEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;
        if (employees.length >= maxEmployees) {
            toast.error(`Max ${maxEmployees} employees on your plan. Upgrade for more.`);
            return;
        }

        setAdding(true);
        try {
            await addEmployeeAction(newEmail.trim().toLowerCase(), newName.trim() || null);
            toast.success('Employee added');
            setNewEmail('');
            setNewName('');
            fetchEmployees();
        } catch {
            toast.error('Failed to add employee. Check if email already exists.');
        } finally {
            setAdding(false);
        }
    };

    const removeEmployee = async (id: string) => {
        if (!confirm('Remove this employee?')) return;
        try {
            await removeEmployeeAction(id);
            toast.success('Employee removed');
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch {
            toast.error('Failed to remove');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-white">Employees</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Give your team read-only access · {employees.length}/{maxEmployees} used
                </p>
            </motion.div>

            {/* Add form */}
            {maxEmployees > 0 ? (
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                            <Plus className="w-4 h-4 text-blue-400" /> Add Employee
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={addEmployee} className="flex flex-col sm:flex-row items-end gap-3">
                            <div className="flex-1 space-y-1.5 w-full">
                                <Label className="text-xs text-slate-400">Email *</Label>
                                <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="employee@gmail.com" type="email" required className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
                            </div>
                            <div className="flex-1 space-y-1.5 w-full">
                                <Label className="text-xs text-slate-400">Name</Label>
                                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Employee name" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
                            </div>
                            <Button type="submit" disabled={adding || employees.length >= maxEmployees} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 px-6 shrink-0">
                                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                                Add
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-white/[0.02] border-white/5">
                    <CardContent className="p-6 text-center">
                        <Shield className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 mb-2">Employee access requires a paid plan</p>
                        <Button onClick={() => window.location.href = '/dashboard/account'} variant="outline" size="sm" className="text-blue-400 border-blue-500/20">
                            Upgrade Plan
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Employee list */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" /> Team Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No employees added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {employees.map((emp) => (
                                <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <Mail className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-white truncate">{emp.employee_name || emp.employee_email}</p>
                                            <p className="text-xs text-slate-500 truncate">{emp.employee_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-400 bg-green-500/5 flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> Read-only
                                        </Badge>
                                        <button onClick={() => removeEmployee(emp.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
