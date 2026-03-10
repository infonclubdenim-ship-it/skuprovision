'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Link from 'next/link';

interface AnimatedLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

export function AnimatedLogo({ size = 'md', showText = true, className = '' }: AnimatedLogoProps) {
    const sizes = {
        sm: { icon: 'w-7 h-7', iconInner: 'w-4 h-4', text: 'text-lg' },
        md: { icon: 'w-9 h-9', iconInner: 'w-5 h-5', text: 'text-xl' },
        lg: { icon: 'w-12 h-12', iconInner: 'w-6 h-6', text: 'text-2xl' },
    };

    const s = sizes[size];

    return (
        <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
            <motion.div
                className={`${s.icon} rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                <Package className={`${s.iconInner} text-white`} />
            </motion.div>
            {showText && (
                <span className={`${s.text} font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent`}>
                    SKU<span className="text-blue-400">Provision</span>
                </span>
            )}
        </Link>
    );
}
