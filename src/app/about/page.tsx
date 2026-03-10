'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Target, Eye, Heart, Users, Zap, Globe, ArrowRight } from 'lucide-react';

const values = [
    { icon: Target, title: 'Built for India', description: 'Designed for Flipkart, Amazon, Meesho, and Jio sellers. We understand your workflow.' },
    { icon: Eye, title: 'Simplicity First', description: 'No bloat, no complexity. Every feature solves a real problem Indian sellers face daily.' },
    { icon: Heart, title: 'Customer Obsessed', description: 'WhatsApp support, faster than email. We treat every seller like a partner, not a ticket.' },
    { icon: Zap, title: 'Speed Matters', description: 'Sub-second search. Instant image compression. Because your time is money.' },
];

const team = [
    { name: 'Anupam Kumar', role: 'Founder & Lead Developer', bio: 'E-commerce seller turned developer. Built SKUProvision to solve his own pain points.' },
    { name: 'MultiSkillHub Team', role: 'Development & Support', bio: 'A passionate team of developers and support engineers based in Delhi, India.' },
];

export default function AboutPage() {
    const valuesRef = useRef(null);
    const teamRef = useRef(null);
    const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
    const teamInView = useInView(teamRef, { once: true, margin: '-100px' });

    return (
        <div className="bg-slate-950 min-h-screen">
            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                            ABOUT US
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            We&apos;re Building the{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Future of SKU Management
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            SKUProvision was born from a simple frustration: managing thousands of SKU IDs
                            across multiple e-commerce platforms shouldn&apos;t be this hard. We built the tool
                            we wished existed.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-semibold text-white">Our Story</h2>
                        </div>
                        <div className="space-y-4 text-slate-400 leading-relaxed">
                            <p>
                                In 2024, while managing a multi-platform e-commerce business on Flipkart, Amazon,
                                and Meesho, our founder Anupam realized something: he was spending <strong className="text-white">hours
                                    every week</strong> searching through messy spreadsheets for SKU IDs.
                            </p>
                            <p>
                                Every product had a parent SKU, multiple child SKUs for sizes and colors, and images
                                scattered across folders. Finding the right SKU for a customer query or marketplace
                                listing was a nightmare.
                            </p>
                            <p>
                                <strong className="text-white">SKUProvision was born to solve this problem.</strong> A clean,
                                fast, and intuitive platform where you can search any SKU in milliseconds, manage
                                product images with auto-compression, and share access with your team — all from
                                one dashboard.
                            </p>
                            <p>
                                Today, <strong className="text-blue-400">500+ Indian sellers</strong> trust SKUProvision to
                                manage their product catalogs. And we&apos;re just getting started.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16" ref={valuesRef}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                        className="text-2xl sm:text-3xl font-bold text-white text-center mb-12"
                    >
                        What Drives Us
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                    <v.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{v.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16" ref={teamRef}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={teamInView ? { opacity: 1, y: 0 } : {}}
                        className="text-2xl sm:text-3xl font-bold text-white text-center mb-12"
                    >
                        Meet the Team
                    </motion.h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                <p className="text-sm text-blue-400 mb-3">{member.role}</p>
                                <p className="text-sm text-slate-400">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 pb-24">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to join us?</h2>
                    <p className="text-slate-400 mb-8">Start your free trial and see why 500+ sellers choose SKUProvision.</p>
                    <Link
                        href="/signup/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                        Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
