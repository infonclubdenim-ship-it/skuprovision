'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { updateSettingsAction } from '@/actions/settings';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Loader2, Save, User, Bell, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, profile } = useAuth();
    const { update } = useSession();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        company_name: '',
        phone: '',
    });

    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.full_name || '',
                company_name: profile.company_name || '',
                phone: profile.phone || '',
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateSettingsAction({
                full_name: form.full_name.trim() || null,
                company_name: form.company_name.trim() || null,
                phone: form.phone.trim() || null,
            });
            // Update the local session JWT
            await update({
                name: form.full_name.trim() || null,
                company_name: form.company_name.trim() || null,
                phone: form.phone.trim() || null,
            });
            toast.success('Settings saved');
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your profile and preferences.</p>
            </motion.div>

            {/* Profile */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" /> Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white/10">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-lg">
                                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-white">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Full Name</Label>
                            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Company Name</Label>
                            <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Your company" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-slate-400">Phone</Label>
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10" />
                    </div>

                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>

            {/* Email */}
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" /> Account Email
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <p className="text-sm text-white">{user?.email}</p>
                        <p className="text-xs text-slate-500 mt-1">Linked via Google OAuth — cannot be changed directly.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
