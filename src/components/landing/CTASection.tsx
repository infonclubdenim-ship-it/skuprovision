'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Gradient border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 p-[1px]">
                        <div className="w-full h-full bg-slate-950 rounded-3xl" />
                    </div>

                    <div className="relative p-8 sm:p-12 lg:p-16 text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={inView ? { scale: 1 } : {}}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25"
                        >
                            <Sparkles className="w-7 h-7 text-white" />
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to Streamline Your{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                E-Commerce Workflow?
                            </span>
                        </h2>

                        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-lg">
                            Join 500+ Indian sellers who save 5+ hours every week with SKUProvision.
                            Start your free trial today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/signup/"
                                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-lg"
                            >
                                Start Free — 30 Days
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact/"
                                className="px-8 py-4 text-slate-400 hover:text-white transition-colors text-lg"
                            >
                                Talk to Sales →
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-slate-600">
                            No credit card required · Cancel anytime · Setup in 2 minutes
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
