'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, Image, FileSpreadsheet, Sparkles } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-950">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-8"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trusted by 500+ Indian E-Commerce Sellers</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                >
                    Manage Your Products.
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Find Any SKU Instantly.
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    The all-in-one platform for Flipkart, Amazon, and Meesho sellers.
                    Smart search, image compression, Excel import/export, and team access —
                    everything you need to streamline your e-commerce workflow.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link
                        href="/signup/"
                        className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-lg"
                    >
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/pricing/"
                        className="px-8 py-4 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20 rounded-2xl transition-all duration-200 text-lg"
                    >
                        View Pricing
                    </Link>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    {[
                        { icon: Search, text: 'Smart SKU Search' },
                        { icon: Image, text: 'Auto Image Compress' },
                        { icon: FileSpreadsheet, text: 'Excel Import/Export' },
                    ].map((pill, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-400"
                        >
                            <pill.icon className="w-4 h-4 text-blue-400" />
                            {pill.text}
                        </div>
                    ))}
                </motion.div>

                {/* Mock dashboard preview */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="mt-16 relative"
                >
                    <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                        {/* Fake browser chrome */}
                        <div className="bg-slate-900/80 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="bg-white/5 rounded-lg px-3 py-1 text-xs text-slate-500 text-center">
                                    skuprovision.multiskillhub.com/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Dashboard mockup */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                {[
                                    { label: 'Products', value: '248', color: 'from-blue-500 to-cyan-500' },
                                    { label: 'SKU IDs', value: '1,847', color: 'from-purple-500 to-pink-500' },
                                    { label: 'Images', value: '496', color: 'from-amber-500 to-orange-500' },
                                    { label: 'Storage Saved', value: '2.3 GB', color: 'from-green-500 to-emerald-500' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-24 sm:h-32 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center">
                                <span className="text-slate-600 text-sm">📊 Product Analytics</span>
                            </div>
                        </div>
                    </div>

                    {/* Glow effect under preview */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/20 blur-[80px] rounded-full" />
                </motion.div>

                {/* No credit card text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-xs text-slate-600"
                >
                    No credit card required · 30-day free trial · Cancel anytime
                </motion.p>
            </div>
        </section>
    );
}
