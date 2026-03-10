'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { PLAN_LIMITS, WHATSAPP_NUMBER } from '@/lib/constants';

type PlanKey = 'free' | 'basic' | 'pro' | 'enterprise';

const plans: {
    name: string;
    slug: PlanKey;
    price: string;
    period: string;
    tagline: string;
    popular: boolean;
    features: string[];
    cta: string;
}[] = [
        {
            name: 'Free',
            slug: 'free',
            price: '₹0',
            period: '30 days',
            tagline: 'Perfect for getting started',
            popular: false,
            features: [
                `${PLAN_LIMITS.free.products} Products`,
                `${PLAN_LIMITS.free.skus} SKU IDs`,
                `${PLAN_LIMITS.free.images} Product Images`,
                `${PLAN_LIMITS.free.devices} Devices`,
                'Smart Search',
                'Image Compression',
            ],
            cta: 'Start Free Trial',
        },
        {
            name: 'Basic',
            slug: 'basic',
            price: '₹299',
            period: '/month',
            tagline: 'Great for growing sellers',
            popular: false,
            features: [
                `${PLAN_LIMITS.basic.products} Products`,
                `${PLAN_LIMITS.basic.skus} SKU IDs`,
                `${PLAN_LIMITS.basic.images} Product Images`,
                `${PLAN_LIMITS.basic.devices} Devices`,
                `${PLAN_LIMITS.basic.employees} Employees`,
                'Excel Import/Export',
                'Priority Support',
            ],
            cta: 'Request Plan',
        },
        {
            name: 'Pro',
            slug: 'pro',
            price: '₹499',
            period: '/month',
            tagline: 'Best for serious sellers',
            popular: true,
            features: [
                `${PLAN_LIMITS.pro.products} Products`,
                `${PLAN_LIMITS.pro.skus.toLocaleString()} SKU IDs`,
                `${PLAN_LIMITS.pro.images} Product Images`,
                `${PLAN_LIMITS.pro.devices} Devices`,
                `${PLAN_LIMITS.pro.employees} Employees`,
                'Excel Import/Export',
                'Advanced Analytics',
                'Priority Support',
            ],
            cta: 'Request Plan',
        },
        {
            name: 'Enterprise',
            slug: 'enterprise',
            price: '₹999',
            period: '/month',
            tagline: 'For large operations',
            popular: false,
            features: [
                'Unlimited Products',
                'Unlimited SKU IDs',
                `${PLAN_LIMITS.enterprise.images} Product Images`,
                `${PLAN_LIMITS.enterprise.devices} Devices`,
                `${PLAN_LIMITS.enterprise.employees} Employees`,
                'Excel Import/Export',
                'Advanced Analytics',
                'Dedicated Support',
                'Custom Features',
            ],
            cta: 'Contact Sales',
        },
    ];

export default function PricingPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
                            PRICING
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Simple, Transparent{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Pricing
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Start free. Upgrade when you need more. All plans include core features.
                        </p>
                    </motion.div>

                    {/* Plans grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`relative rounded-2xl p-6 flex flex-col ${plan.popular
                                        ? 'bg-gradient-to-b from-blue-500/10 to-cyan-500/5 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10'
                                        : 'bg-white/[0.02] border border-white/5'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-white" />
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                                    <p className="text-xs text-slate-500 mb-4">{plan.tagline}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-sm text-slate-500">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {plan.slug === 'free' ? (
                                    <Link
                                        href="/signup/"
                                        className={`block text-center py-3 rounded-xl font-medium text-sm transition-all ${plan.popular
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                ) : plan.slug === 'enterprise' ? (
                                    <a
                                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in the Enterprise plan for SKUProvision.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center py-3 rounded-xl font-medium text-sm bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        {plan.cta}
                                    </a>
                                ) : (
                                    <Link
                                        href="/signup/"
                                        className={`block text-center py-3 rounded-xl font-medium text-sm transition-all ${plan.popular
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'Can I upgrade or downgrade anytime?', a: 'Yes! Contact us via WhatsApp to change your plan. Changes take effect immediately.' },
                                { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade Supabase infrastructure with row-level security. Your data is encrypted and only accessible by you.' },
                                { q: 'What happens after the free trial?', a: 'After 30 days, your account remains active but in read-only mode. Upgrade to any paid plan to continue adding products.' },
                                { q: 'Do you offer refunds?', a: 'Yes, we offer a 7-day money-back guarantee on all paid plans. No questions asked.' },
                                { q: 'What payment methods do you accept?', a: 'We accept UPI, bank transfer, and all major payment methods via WhatsApp-based onboarding.' },
                            ].map((faq) => (
                                <div key={faq.q} className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                                    <h3 className="text-sm font-medium text-white mb-2">{faq.q}</h3>
                                    <p className="text-sm text-slate-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
