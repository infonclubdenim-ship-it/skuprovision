'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Package, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
            // If successful, the browser will redirect to Google OAuth
        } catch {
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-2">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="mx-auto"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-1">
                                Sign in to your SKUProvision account
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        {/* Google Sign In Button */}
                        <Button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-12 bg-white hover:bg-gray-100 text-gray-800 font-medium text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.55c2.08-1.92 3.29-4.74 3.29-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-slate-500">
                                    secure login via Google
                                </span>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                256-bit SSL
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                SOC2 Compliant
                            </span>
                        </div>

                        {/* Links */}
                        <div className="text-center space-y-3 pt-2">
                            <p className="text-sm text-slate-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup/" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                    Sign Up Free
                                </Link>
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back to Home
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
