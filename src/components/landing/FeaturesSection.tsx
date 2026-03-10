'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Search, Image, FileSpreadsheet, Users, Shield, Smartphone,
    Zap, BarChart3, Globe,
} from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Smart SKU Search',
        description: 'Search across parent and child SKUs with partial matching. Find any product in milliseconds.',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
    },
    {
        icon: Image,
        title: 'Image Compression',
        description: 'Auto-compress images to WebP. Reduce size by 80% without losing visual quality.',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        icon: FileSpreadsheet,
        title: 'Excel Import/Export',
        description: 'Bulk import products from Excel. Export your entire catalog in one click.',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10',
    },
    {
        icon: Users,
        title: 'Team Access',
        description: 'Add employees with read-only access. Perfect for warehouses and fulfillment teams.',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10',
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Enterprise-grade security with row-level access control. Your data stays yours.',
        color: 'from-red-500 to-pink-500',
        bgColor: 'bg-red-500/10',
    },
    {
        icon: Smartphone,
        title: 'Device Management',
        description: 'Control how many devices can access your account. Monitor active sessions in real-time.',
        color: 'from-teal-500 to-cyan-500',
        bgColor: 'bg-teal-500/10',
    },
    {
        icon: Globe,
        title: 'Multi-Platform Ready',
        description: 'Works with Flipkart, Amazon, Meesho, and any marketplace. Manage all platforms in one place.',
        color: 'from-indigo-500 to-blue-500',
        bgColor: 'bg-indigo-500/10',
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Track product counts, SKU usage, and storage savings. Make data-driven decisions.',
        color: 'from-cyan-500 to-blue-500',
        bgColor: 'bg-cyan-500/10',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Built for speed. Sub-second search results even with thousands of products.',
        color: 'from-yellow-500 to-amber-500',
        bgColor: 'bg-yellow-500/10',
    },
];

export function FeaturesSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="features" className="py-24 bg-slate-950 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                        FEATURES
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Everything You Need to{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Scale Your Business
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Built specifically for Indian e-commerce sellers. Every feature designed
                        to save you time and grow your business.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} [&>*]:fill-none`} style={{ color: 'var(--tw-gradient-from)' }} />
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
