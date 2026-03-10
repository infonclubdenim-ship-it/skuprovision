'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                        <p className="text-sm text-slate-500 mb-8">Last updated: March 1, 2026</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-400 prose-li:text-slate-400 prose-strong:text-white prose-a:text-blue-400"
                    >
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                                <p className="text-slate-400 leading-relaxed mb-3">When you use SKUProvision, we collect the following information:</p>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li><strong className="text-white">Account Information:</strong> Name, email address, and profile picture (via Google OAuth).</li>
                                    <li><strong className="text-white">Product Data:</strong> Product names, SKU IDs, descriptions, MRP, and images you upload.</li>
                                    <li><strong className="text-white">Device Information:</strong> Device type, browser, IP address for session management.</li>
                                    <li><strong className="text-white">Usage Data:</strong> Pages visited, search queries, feature usage for analytics.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li>To provide and maintain the SKUProvision service.</li>
                                    <li>To manage your account and subscriptions.</li>
                                    <li>To send service-related notifications and updates.</li>
                                    <li>To improve our product based on usage patterns.</li>
                                    <li>To respond to your support requests and messages.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage & Security</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    Your data is stored on Supabase (powered by PostgreSQL) with enterprise-grade security. All data is encrypted in transit (TLS 1.3) and at rest. We implement Row Level Security (RLS) policies to ensure your data is only accessible by you and your authorized team members.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    We do <strong className="text-white">NOT</strong> sell, trade, or share your personal data or product information with third parties. Your product catalog and SKU data remain strictly confidential.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">5. Cookies & Tracking</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    We use essential cookies for authentication and session management. We may use analytics tools (Google Analytics, Meta Pixel) to understand usage patterns. You can opt out of non-essential tracking at any time.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li>Access, update, or delete your account data at any time.</li>
                                    <li>Export your product data via the Excel export feature.</li>
                                    <li>Request complete data deletion by contacting us.</li>
                                    <li>Opt out of marketing communications.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    For privacy-related concerns, contact us at{' '}
                                    <a href="mailto:multiskillh@gmail.com" className="text-blue-400 hover:underline">multiskillh@gmail.com</a>{' '}
                                    or via WhatsApp at +91 8700903037.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
