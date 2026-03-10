'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { POPUP_DELAY_SECONDS } from '@/lib/constants';

export function SignupPopup() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const pathname = usePathname();

    // Don't show on auth, dashboard, or admin pages
    const hidePopup =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/auth');

    useEffect(() => {
        // Don't show if user is logged in, already dismissed, or on excluded pages
        if (user || hidePopup || dismissed) return;

        // Check if already dismissed in this session
        const wasDismissed = sessionStorage.getItem('popup_dismissed');
        if (wasDismissed) {
            setDismissed(true);
            return;
        }

        // Show popup after delay
        const timer = setTimeout(() => {
            setVisible(true);
            // Track popup shown
            trackInteraction('shown');
        }, (POPUP_DELAY_SECONDS || 8) * 1000);

        return () => clearTimeout(timer);
    }, [user, hidePopup, dismissed]);

    const trackInteraction = async (action: 'shown' | 'signed_up' | 'dismissed') => {
        try {
            const visitorId = sessionStorage.getItem('visitor_id') || Date.now().toString();
            sessionStorage.setItem('visitor_id', visitorId);
            // TODO: Replace with custom API call for interactions
            // await supabase.from('popup_interactions').insert({ visitor_id: visitorId, action });
        } catch {
            // Silent fail for tracking
        }
    };

    const handleDismiss = () => {
        setVisible(false);
        setDismissed(true);
        sessionStorage.setItem('popup_dismissed', 'true');
        trackInteraction('dismissed');
    };

    const handleSignup = async () => {
        setLoading(true);
        try {
            trackInteraction('signed_up');
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch {
            toast.error('Something went wrong');
            setLoading(false);
        }
    };

    if (hidePopup || user || dismissed) return null;

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden">
                            {/* Top decorative gradient */}
                            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />

                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="px-6 py-8 text-center">
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25"
                                >
                                    <Package className="w-8 h-8 text-white" />
                                </motion.div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    🎉 Claim Your Free Account!
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                    Get 30 days free access to manage all your e-commerce products and SKUs. No credit card needed.
                                </p>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                                    {['10 Products', '30 SKU IDs', 'Smart Search', 'Image Compress'].map((feat) => (
                                        <div
                                            key={feat}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg text-slate-300"
                                        >
                                            <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Button
                                    onClick={handleSignup}
                                    disabled={loading}
                                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.55c2.08-1.92 3.29-4.74 3.29-8.1z" />
                                            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    )}
                                    {loading ? 'Please wait...' : 'Sign Up with Google'}
                                </Button>

                                <p className="text-[10px] text-slate-600 mt-3">
                                    No credit card required · Cancel anytime
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
