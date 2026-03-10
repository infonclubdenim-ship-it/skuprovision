'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, Package, Search, Download } from 'lucide-react';

const steps = [
    {
        step: '01',
        icon: UserPlus,
        title: 'Sign Up Free',
        description: 'Create your account with Google in one click. No credit card required. Get 30 days free.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        step: '02',
        icon: Package,
        title: 'Add Products & SKUs',
        description: 'Add your products with parent SKU, child SKUs, and images. Import in bulk from Excel.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        step: '03',
        icon: Search,
        title: 'Search & Manage',
        description: 'Find any product or SKU instantly with smart search. View images, edit details, manage inventory.',
        color: 'from-amber-500 to-orange-500',
    },
    {
        step: '04',
        icon: Download,
        title: 'Export & Share',
        description: 'Export your catalog to Excel. Share with your team. Access from any device, anywhere.',
        color: 'from-green-500 to-emerald-500',
    },
];

export function HowItWorksSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="py-24 bg-gradient-to-b from-slate-950 to-blue-950/30 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
                        HOW IT WORKS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Up & Running in{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            4 Simple Steps
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        No complex setup. No technical knowledge needed.
                        Start managing your SKUs in under 2 minutes.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 40 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="relative text-center"
                            >
                                {/* Step number */}
                                <div className="relative mx-auto mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto shadow-lg`}
                                        style={{ boxShadow: `0 10px 30px -5px rgba(99, 102, 241, 0.2)` }}
                                    >
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                        {item.step}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
