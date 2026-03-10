'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleGoogleSignup = async () => {
        if (!agreedToTerms) {
            toast.error('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch {
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreedToTerms) {
            toast.error('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setEmailLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Something went wrong');
                setEmailLoading(false);
                return;
            }

            // Auto-login after successful signup
            const loginRes = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (loginRes?.error) {
                toast.success('Account created! Please sign in.');
                router.push('/login');
            } else {
                toast.success('Welcome to SKUProvision!');
                router.push('/dashboard');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
            setEmailLoading(false);
        }
    };

    const benefits = [
        'Free 30-day trial — no credit card needed',
        'Manage up to 10 products with 30 SKUs',
        'Smart search across all your SKU IDs',
        'Auto image compression (save storage)',
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="mx-auto"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Create Your Account
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-1">
                                Start managing your SKUs in 30 seconds
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-4">
                        {/* Benefits */}
                        <div className="space-y-2.5">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-2.5 text-sm text-slate-300"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                    {benefit}
                                </motion.div>
                            ))}
                        </div>

                        {/* Terms checkbox */}
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                            <div className="mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50"
                                />
                            </div>
                            <span className="text-xs text-slate-400 leading-relaxed">
                                I agree to the{' '}
                                <Link href="/terms/" className="text-indigo-400 hover:text-indigo-300 underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy-policy/" className="text-indigo-400 hover:text-indigo-300 underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Google Sign Up Button */}
                        <Button
                            onClick={handleGoogleSignup}
                            disabled={loading || !agreedToTerms}
                            className="w-full h-12 bg-white hover:bg-gray-100 text-gray-800 font-medium text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50"
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
                            {loading ? 'Creating account...' : 'Sign Up with Google'}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-slate-500">
                                    or sign up with email
                                </span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        {!showEmailForm ? (
                            <Button
                                onClick={() => setShowEmailForm(true)}
                                disabled={!agreedToTerms}
                                variant="outline"
                                className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white font-medium text-base rounded-xl transition-all duration-200 disabled:opacity-50"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Sign up with Email & Password
                            </Button>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleEmailSignup}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-400 text-sm">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-11"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-slate-400 text-sm">
                                        Email
                                    </Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-11"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-slate-400 text-sm">
                                        Password
                                    </Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 h-11"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={emailLoading}
                                    className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20"
                                >
                                    {emailLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    {emailLoading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </motion.form>
                        )}

                        {/* Trust badge */}
                        <p className="text-center text-xs text-slate-500">
                            🔒 Your data is protected with enterprise-grade security
                        </p>

                        {/* Links */}
                        <div className="text-center space-y-3 pt-1">
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link href="/login/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Sign In
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
