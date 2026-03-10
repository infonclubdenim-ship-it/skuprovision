'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPlanRequestsAction, approvePlanRequestAction, rejectPlanRequestAction } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PlanRequest {
    id: string;
    user_id: string;
    requested_plan: string;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<PlanRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getPlanRequestsAction();
            setRequests(data);
        } catch {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const req = requests.find(r => r.id === id);
            if (!req) return;

            if (newStatus === 'approved') {
                await approvePlanRequestAction(id, req.user_id, req.requested_plan);
            } else {
                await rejectPlanRequestAction(id, ''); // no notes for now
            }

            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            toast.success(`Request ${newStatus}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const statusColors = {
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white tracking-tight">Plan Requests</h2>
                <p className="text-slate-400 mt-1">Manage Enterprise and custom plan upgrades.</p>
            </motion.div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Card key={i} className="bg-white/[0.02] border-white/5 h-32 animate-pulse" />)}
                </div>
            ) : requests.length === 0 ? (
                <Card className="bg-white/[0.02] border-white/5 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <ShieldAlert className="w-12 h-12 text-slate-700 mb-4" />
                        <p className="text-lg font-medium text-white">No active requests</p>
                        <p className="text-sm text-slate-500">When users request enterprise or custom plans, they will appear here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map((request, i) => (
                        <motion.div key={request.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                                <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">

                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between sm:justify-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    {request.name}
                                                    <Badge variant="outline" className={`capitalize ${statusColors[request.status]}`}>
                                                        {request.status}
                                                    </Badge>
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {request.email}</span>
                                                    {request.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {request.phone}</span>}
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(request.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5 inline-block w-full text-sm text-slate-300">
                                                {request.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions & Target Plan */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Requested Plan</p>
                                            <Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/10 text-sm font-semibold capitalize px-3 py-1">
                                                {request.requested_plan}
                                            </Badge>
                                        </div>

                                        {request.status === 'pending' && (
                                            <div className="flex items-center gap-2">
                                                <Button onClick={() => updateStatus(request.id, 'rejected')} variant="outline" size="sm" className="h-9 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                                    <X className="w-4 h-4 mr-1.5" /> Reject
                                                </Button>
                                                <Button onClick={() => updateStatus(request.id, 'approved')} size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white">
                                                    <Check className="w-4 h-4 mr-1.5" /> Approve
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
