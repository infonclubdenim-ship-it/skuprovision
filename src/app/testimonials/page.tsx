'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';

const testimonials = [
    { name: 'Rajesh Kumar', role: 'Flipkart Seller, Delhi', content: 'SKUProvision saved me hours every week. I used to search through Excel sheets for SKU IDs. Now I find any product in seconds. The image compression feature alone has saved me so much storage.', rating: 5, avatar: 'RK' },
    { name: 'Priya Sharma', role: 'Amazon FBA Seller, Mumbai', content: 'The image compression alone is worth it. I was paying ₹500/month for a separate tool. SKUProvision does it all in one place. The dashboard is really clean and easy to use.', rating: 5, avatar: 'PS' },
    { name: 'Ankit Gupta', role: 'Multi-platform Seller, Jaipur', content: 'I manage 300+ products across 3 platforms. The Excel import feature let me migrate everything in minutes. Absolutely love it! Customer support on WhatsApp is super quick.', rating: 5, avatar: 'AG' },
    { name: 'Sneha Patel', role: 'Meesho Seller, Ahmedabad', content: 'The employee access feature is perfect for my warehouse team. They can search products but can\'t edit anything. Exactly what I needed. Will definitely recommend to other sellers.', rating: 5, avatar: 'SP' },
    { name: 'Vikram Singh', role: 'Wholesale Seller, Noida', content: 'Best SKU management tool for Indian sellers. The team understands our exact pain points. I used to use Google Sheets — SKUProvision is 100x better.', rating: 5, avatar: 'VS' },
    { name: 'Meera Reddy', role: 'Fashion Seller, Hyderabad', content: 'We switched from Google Sheets to SKUProvision. The smart search alone makes it 10x faster. Our operations team loves it. The Pro plan is great value.', rating: 4, avatar: 'MR' },
    { name: 'Arjun Nair', role: 'Electronics Seller, Bangalore', content: 'As someone with 1000+ SKUs, finding the right one used to take minutes. Now it takes less than a second. The parent-child SKU structure is exactly how we think about products.', rating: 5, avatar: 'AN' },
    { name: 'Pooja Verma', role: 'Home Decor Seller, Pune', content: 'I love how I can add multiple images per product and they get automatically compressed. My Flipkart listing images are now perfectly optimized without any extra effort.', rating: 5, avatar: 'PV' },
    { name: 'Ravi Agarwal', role: 'Textile Seller, Surat', content: 'The Excel export feature makes GST filing so much easier. I export my product catalog every month for accounting. Such a time saver! Highly recommend SKUProvision.', rating: 5, avatar: 'RA' },
];

export default function TestimonialsPage() {
    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6">
                            TESTIMONIALS
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            What Our{' '}
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Sellers Say</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Real stories from real Indian e-commerce sellers who use SKUProvision daily.
                        </p>
                    </motion.div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                            >
                                <Quote className="w-8 h-8 text-white/5 absolute top-4 right-4" />
                                <div className="flex items-center gap-0.5 mb-4">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Ready to join them?</h2>
                        <Link href="/signup/" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                            Start Free Trial <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
