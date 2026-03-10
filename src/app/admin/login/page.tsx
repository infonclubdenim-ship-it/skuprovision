'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter your email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error(res.error || 'Invalid credentials');
                setLoading(false);
                return;
            }

            // At this point, login is successful.
            // Role checking will happen in the AdminGuard middleware anyway.
            toast.success('Welcome back!');
            router.push('/admin/');
        } catch {
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-sm px-4"
            >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="mx-auto"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                        </motion.div>
                        <div>
                            <CardTitle className="text-xl font-bold text-white">
                                Admin Access
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-xs mt-1">
                                Authorized personnel only
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-400 text-sm">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 h-11"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-400 text-sm">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 h-11"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Lock className="mr-2 h-4 w-4" />
                                )}
                                {loading ? 'Verifying...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <a
                                href="/"
                                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back to site
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
