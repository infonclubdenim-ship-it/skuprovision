'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Terms of Service</h1>
                        <p className="text-sm text-slate-500 mb-8">Last updated: March 1, 2026</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                            <p className="text-slate-400 leading-relaxed">
                                By creating an account or using SKUProvision (&ldquo;the Service&rdquo;), you agree to these Terms of Service.
                                The Service is operated by MultiSkillHub (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), located in Delhi, India.
                                If you do not agree to these terms, please do not use the Service.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Account Responsibilities</h2>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                                <li>You must provide accurate information during registration.</li>
                                <li>You are responsible for maintaining the security of your account.</li>
                                <li>You must not share your login credentials with unauthorized users.</li>
                                <li>You must comply with the device limits of your subscription plan.</li>
                                <li>You must be at least 18 years old to create an account.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Acceptable Use</h2>
                            <p className="text-slate-400 leading-relaxed mb-3">You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                                <li>Use the Service for any illegal or unauthorized purpose.</li>
                                <li>Upload malicious content, viruses, or harmful files.</li>
                                <li>Attempt to access other users&apos; data or accounts.</li>
                                <li>Abuse or overload the Service infrastructure.</li>
                                <li>Resell or redistribute the Service without permission.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Subscription & Payments</h2>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                                <li>Free trial is available for 30 days with no payment required.</li>
                                <li>Paid plans are billed monthly via UPI or bank transfer.</li>
                                <li>Plan activations and upgrades are processed via WhatsApp.</li>
                                <li>Prices are in Indian Rupees (INR) and inclusive of applicable taxes.</li>
                                <li>We reserve the right to change prices with 30 days notice.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Data Ownership</h2>
                            <p className="text-slate-400 leading-relaxed">
                                You retain full ownership of all data you upload to SKUProvision, including product names,
                                SKU IDs, images, and descriptions. We do not claim any intellectual property rights over
                                your content. You can export your data at any time using the Excel export feature.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Service Availability</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We strive to maintain 99.9% uptime. However, we do not guarantee uninterrupted access.
                                Scheduled maintenance windows will be communicated in advance. We are not liable for
                                downtime caused by third-party services (Supabase, cloud providers).
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Account Termination</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We may suspend or terminate accounts that violate these terms. You may delete your account
                                at any time from the Account Settings page. Upon deletion, your data will be permanently
                                removed within 30 days.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
                            <p className="text-slate-400 leading-relaxed">
                                SKUProvision is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any
                                indirect, incidental, or consequential damages arising from your use of the Service. Our total
                                liability is limited to the amount you have paid us in the last 12 months.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We may update these terms from time to time. We will notify you of significant changes via
                                email or in-app notification. Continued use of the Service after changes constitutes acceptance
                                of the updated terms.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
                            <p className="text-slate-400 leading-relaxed">
                                For questions about these terms, contact us at{' '}
                                <a href="mailto:multiskillh@gmail.com" className="text-blue-400 hover:underline">multiskillh@gmail.com</a>{' '}
                                or WhatsApp at +91 8700903037.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-600">
                                Governing Law: These terms are governed by the laws of India. Any disputes shall be resolved
                                in the courts of Delhi, India.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
