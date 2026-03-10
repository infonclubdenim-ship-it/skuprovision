'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { NAV_LINKS } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Menu,
    LogOut,
    LayoutDashboard,
    User,
    ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
    const { user, profile, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Don't show header on dashboard, admin, login, signup, or auth callback pages
    const hideHeader =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/auth');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' });
            toast.success('Signed out successfully');
        } catch {
            toast.error('Failed to sign out');
        }
    };

    if (hideHeader) return null;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-18">
                    {/* Logo */}
                    <AnimatedLogo size="md" />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-blue-400 bg-blue-500/10'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side: Auth buttons or User menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                            <div className="w-20 h-9 rounded-lg bg-white/5 animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors group outline-none">
                                    <Avatar className="h-8 w-8 border border-white/10">
                                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs">
                                            {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors max-w-[120px] truncate">
                                        {profile?.full_name || 'Account'}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-slate-900 border-white/10 text-slate-300"
                                >
                                    <DropdownMenuItem className="cursor-pointer" onSelect={() => window.location.href = '/dashboard/'}>
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onSelect={() => window.location.href = '/dashboard/account/'}>
                                        <User className="w-4 h-4 mr-2" />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="text-red-400 cursor-pointer focus:text-red-400"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login/"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup/"
                                    className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 rounded-xl transition-all duration-200"
                                >
                                    Sign Up Free
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                            <Menu className="w-5 h-5" />
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72 bg-slate-950 border-white/10"
                        >
                            <div className="flex flex-col gap-6 mt-8">
                                <AnimatedLogo size="sm" />

                                <nav className="flex flex-col gap-1">
                                    {NAV_LINKS.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                    ? 'text-blue-400 bg-blue-500/10'
                                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                                    {user ? (
                                        <>
                                            <Link
                                                href="/dashboard/"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login/"
                                                onClick={() => setMobileOpen(false)}
                                                className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/signup/"
                                                onClick={() => setMobileOpen(false)}
                                                className="px-4 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-center"
                                            >
                                                Sign Up Free
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
