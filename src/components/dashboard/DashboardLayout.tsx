'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLogo } from '@/components/layout/AnimatedLogo';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { DASHBOARD_SIDEBAR } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    LayoutDashboard, Package, PlusCircle, FileSpreadsheet,
    Users, Settings, CreditCard, LogOut, Menu, X, ChevronLeft, Bell,
} from 'lucide-react';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard, Package, PlusCircle, FileSpreadsheet, Users, Settings, CreditCard,
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, profile } = useAuth();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
        } catch {
            toast.error('Failed to sign out');
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
                {!collapsed && <AnimatedLogo size="sm" />}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {DASHBOARD_SIDEBAR.map((item) => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="px-3 py-4 border-t border-white/5">
                {!collapsed ? (
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <Avatar className="h-9 w-9 border border-white/10">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs">
                                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{profile?.plan || 'Free'} Plan</p>
                        </div>
                    </div>
                ) : null}
                <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Sign Out' : undefined}
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:flex flex-col shrink-0 bg-slate-950 border-r border-white/5 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-64'
                    }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-white/5 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="shrink-0 h-14 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-medium text-slate-300">
                            {DASHBOARD_SIDEBAR.find((s) => pathname === s.href || (s.href !== '/dashboard' && pathname?.startsWith(s.href)))?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors relative">
                            <Bell className="w-4 h-4" />
                        </button>
                        <Link href="/" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors text-xs">
                            ← Site
                        </Link>
                    </div>
                </header>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
