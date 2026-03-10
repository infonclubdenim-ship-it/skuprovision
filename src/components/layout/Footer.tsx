'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatedLogo } from './AnimatedLogo';
import { NewsletterForm } from '@/components/shared/NewsletterForm';
import { SocialLinks } from '@/components/shared/SocialLinks';
import { FOOTER_QUICK_LINKS, FOOTER_LEGAL_LINKS, CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();

    // Don't show footer on dashboard, admin, login, signup, or callback pages
    const hideFooter =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/auth');

    if (hideFooter) return null;

    return (
        <footer className="bg-gradient-to-b from-slate-950 to-black border-t border-white/5">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Column 1: Brand + Tagline */}
                    <div className="space-y-5">
                        <AnimatedLogo size="md" />
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Streamline your e-commerce workflow. Manage products, SKU IDs, and images across all your selling platforms.
                        </p>
                        <SocialLinks className="text-slate-400" />
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {FOOTER_QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2.5">
                            {FOOTER_LEGAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Contact info */}
                        <div className="mt-6 space-y-2.5">
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                {CONTACT_EMAIL}
                            </a>
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                +91 8700903037
                            </a>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-3.5 h-3.5" />
                                Delhi, India
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-slate-400 mb-4">
                            Get tips, updates, and special offers directly in your inbox.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} SKUProvision by MultiSkillHub. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
