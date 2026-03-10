'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ADMIN_SIDEBAR } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShieldAlert, Zap, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

// Map icon strings to actual Lucide components dynamically or statically
import * as Icons from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/admin/login' });
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0a0f1c] border-r border-white/5 relative z-20">
            {/* Brand */}
            <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} shrink-0`}>
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    {!isCollapsed && <span className="font-bold text-white tracking-tight">SuperAdmin</span>}
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
                <div className="mb-4 px-2">
                    {!isCollapsed && <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Management</p>}
                </div>
                {ADMIN_SIDEBAR.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = (Icons as Record<string, any>)[item.icon] || Icons.LayoutDashboard;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${isActive ? 'bg-red-500/10 text-red-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            {isActive && (
                                <motion.div layoutId="admin-active-nav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full" />
                            )}
                            <Icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 shrink-0">
                <button onClick={handleLogout} className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-xl hover:bg-white/5 transition-colors group text-slate-400 hover:text-white`}>
                    <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-xs">A</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="text-left min-w-0">
                                <p className="text-sm font-medium truncate">{profile?.full_name || 'Admin'}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Badge variant="outline" className="text-[9px] h-4 px-1 border-red-500/30 text-red-400 bg-red-500/10 uppercase">Super Admin</Badge>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && <LogOut className="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-500 transition-opacity" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] flex">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 260 }}
                className="hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300"
            >
                <SidebarContent />
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-lg z-40"
                >
                    {isCollapsed ? <Icons.ChevronRight className="w-3 h-3" /> : <Icons.ChevronLeft className="w-3 h-3" />}
                </button>
            </motion.aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[260px] z-50 lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[260px]'}`}>

                {/* Top Header */}
                <header className="h-16 shrink-0 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-medium">
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span>SuperAdmin Workspace</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
                            Customer View <Icons.ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 relative">
                    {/* Subtle background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-red-500/5 blur-[100px] pointer-events-none rounded-full" />

                    <div className="relative z-10 max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
