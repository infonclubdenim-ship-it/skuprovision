'use client';

import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Refund Policy</h1>
                        <p className="text-sm text-slate-500 mb-8">Last updated: March 1, 2026</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Free Trial</h2>
                            <p className="text-slate-400 leading-relaxed">
                                SKUProvision offers a <strong className="text-white">30-day free trial</strong> for all new users.
                                During this period, you can use all features of the Free plan at no cost. No credit card is required
                                to start the trial. If you don&apos;t upgrade after 30 days, your account remains active in read-only mode.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Refund Eligibility</h2>
                            <p className="text-slate-400 leading-relaxed mb-3">
                                We offer a <strong className="text-white">7-day money-back guarantee</strong> on all paid plans:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                                <li>Request a refund within 7 days of your purchase.</li>
                                <li>No questions asked — we&apos;ll process it immediately.</li>
                                <li>Refunds are processed within 5-7 business days.</li>
                                <li>Refund will be credited to the original payment method.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">3. After 7 Days</h2>
                            <p className="text-slate-400 leading-relaxed">
                                After the 7-day window, refunds are evaluated on a case-by-case basis. If you experience
                                technical issues that prevent you from using the service, contact us and we&apos;ll work to
                                resolve the issue or provide a pro-rated refund.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Plan Downgrades</h2>
                            <p className="text-slate-400 leading-relaxed">
                                You can downgrade your plan at any time. The current plan remains active until the end
                                of the billing period. No partial refunds are issued for downgrades unless within the
                                7-day window.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">5. How to Request a Refund</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Contact us via WhatsApp at <strong className="text-white">+91 8700903037</strong> or email at{' '}
                                <a href="mailto:multiskillh@gmail.com" className="text-blue-400 hover:underline">multiskillh@gmail.com</a>{' '}
                                with your registered email and reason for refund. We&apos;ll process your request within 24 hours.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
