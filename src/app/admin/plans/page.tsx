'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPricingPlansAction, updatePricingPlanAction } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { PricingPlan } from '@/lib/types';

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<PricingPlan>>({});

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await getPricingPlansAction();
            setPlans(data);
        } catch {
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: PricingPlan) => {
        setEditingId(plan.id);
        setEditForm(plan);
    };

    const handleSave = async () => {
        if (!editingId) return;
        try {
            await updatePricingPlanAction(editingId, {
                price: editForm.price,
                max_products: editForm.max_products,
                max_skus: editForm.max_skus,
                max_images: editForm.max_images,
                max_devices: editForm.max_devices,
                max_employees: editForm.max_employees,
                is_active: editForm.is_active
            });

            setPlans(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as PricingPlan : p));
            setEditingId(null);
            toast.success('Plan updated successfully');
        } catch {
            toast.error('Failed to update plan');
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white tracking-tight">Plan Management</h2>
                <p className="text-slate-400 mt-1">Configure pricing tiers, limits, and feature access.</p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <Card key={i} className="bg-white/[0.02] border-white/5 h-64 animate-pulse" />
                    ))
                ) : plans.map((plan, i) => (
                    <motion.div key={plan.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="bg-white/[0.02] border-white/5 shadow-xl relative overflow-hidden group">
                            {/* Colored top border based on plan */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${plan.slug === 'enterprise' ? 'from-amber-500 to-orange-500' :
                                plan.slug === 'pro' ? 'from-purple-500 to-pink-500' :
                                    plan.slug === 'basic' ? 'from-blue-500 to-cyan-500' :
                                        'from-slate-500 to-slate-400'
                                }`} />

                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-white capitalize">{plan.name}</h3>
                                            {!plan.is_active && <Badge variant="destructive" className="text-[10px] h-5">Inactive</Badge>}
                                        </div>
                                        {editingId === plan.id ? (
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-slate-400">₹</span>
                                                <Input
                                                    type="number"
                                                    value={editForm.price || 0}
                                                    onChange={e => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                    className="w-24 h-8 bg-white/5 border-white/10 text-white text-sm"
                                                />
                                                <span className="text-slate-400">/ {plan.billing_period}</span>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-bold text-white mt-1">
                                                ₹{plan.price.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ {plan.billing_period}</span>
                                            </div>
                                        )}
                                    </div>

                                    {editingId === plan.id ? (
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" onClick={handleSave} className="h-8 w-8 bg-emerald-600 hover:bg-emerald-500 text-white">
                                                <Save className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(plan)} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { key: 'max_products', label: 'Products', val: plan.max_products },
                                        { key: 'max_skus', label: 'SKUs', val: plan.max_skus },
                                        { key: 'max_images', label: 'Images/Product', val: plan.max_images },
                                        { key: 'max_devices', label: 'Devices', val: plan.max_devices },
                                        { key: 'max_employees', label: 'Employees', val: plan.max_employees }
                                    ].map((limit) => (
                                        <div key={limit.key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 border-dashed">
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{limit.label}</div>
                                            {editingId === plan.id ? (
                                                <Input
                                                    type="number"
                                                    value={editForm[limit.key as keyof PricingPlan] as number}
                                                    onChange={e => setEditForm(prev => ({ ...prev, [limit.key]: Number(e.target.value) }))}
                                                    className="h-7 bg-white/5 border-none text-white text-sm px-2 w-full"
                                                />
                                            ) : (
                                                <div className="text-sm font-semibold text-white">
                                                    {limit.val === -1 ? 'Unlimited' : limit.val.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {editingId === plan.id && (
                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 border-dashed flex flex-col justify-center">
                                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                                                className={`h-7 w-full border-white/10 ${editForm.is_active ? 'text-emerald-400' : 'text-slate-400'}`}
                                            >
                                                {editForm.is_active ? 'Active' : 'Inactive'}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
