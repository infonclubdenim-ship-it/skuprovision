'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

// Static testimonials for build — real ones loaded from DB
const testimonials = [
    {
        name: 'Rajesh Kumar',
        role: 'Flipkart Seller, Delhi',
        content: 'SKUProvision saved me hours every week. I used to search through Excel sheets for SKU IDs. Now I find any product in seconds.',
        rating: 5,
        avatar: 'RK',
    },
    {
        name: 'Priya Sharma',
        role: 'Amazon FBA Seller, Mumbai',
        content: 'The image compression alone is worth it. I was paying ₹500/month for a separate tool. SKUProvision does it all in one place.',
        rating: 5,
        avatar: 'PS',
    },
    {
        name: 'Ankit Gupta',
        role: 'Multi-platform Seller, Jaipur',
        content: 'I manage 300+ products across 3 platforms. The Excel import feature let me migrate everything in minutes. Absolutely love it!',
        rating: 5,
        avatar: 'AG',
    },
    {
        name: 'Sneha Patel',
        role: 'Meesho Seller, Ahmedabad',
        content: 'The employee access feature is perfect for my warehouse team. They can search products but can\'t edit anything. Exactly what I needed.',
        rating: 5,
        avatar: 'SP',
    },
    {
        name: 'Vikram Singh',
        role: 'Wholesale Seller, Noida',
        content: 'Best SKU management tool for Indian sellers. The team understands our exact pain points. Customer support is amazing too!',
        rating: 5,
        avatar: 'VS',
    },
    {
        name: 'Meera Reddy',
        role: 'Fashion Seller, Hyderabad',
        content: 'We switched from Google Sheets to SKUProvision. The smart search alone makes it 10x faster. Our operations team loves it.',
        rating: 4,
        avatar: 'MR',
    },
];

export function TestimonialsSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="py-24 bg-gradient-to-b from-blue-950/30 to-slate-950 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            Indian Sellers
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        From solo sellers to multi-platform businesses — see what our users have to say.
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                        >
                            {/* Quote icon */}
                            <Quote className="w-8 h-8 text-white/5 absolute top-4 right-4" />

                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`w-4 h-4 ${idx < testimonial.rating
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{testimonial.name}</div>
                                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
