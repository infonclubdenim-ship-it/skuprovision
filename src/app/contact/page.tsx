'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactMessageAction } from '@/actions/global';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const result = await submitContactMessageAction({
                name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                message: form.message,
            });
            if (result.error) throw new Error(result.error);
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch {
            toast.error('Failed to send message. Please try WhatsApp instead.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen">
            <section className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
                            CONTACT US
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Have questions? We&apos;d love to hear from you. Reach out via the form below or WhatsApp.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Contact form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-3"
                        >
                            <Card className="bg-white/[0.02] border-white/5">
                                <CardContent className="p-6 sm:p-8">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-400">Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    placeholder="Your name"
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-11"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-400">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="you@example.com"
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-11"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-400">Phone (optional)</Label>
                                            <Input
                                                id="phone"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-slate-400">Message *</Label>
                                            <Textarea
                                                id="message"
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder="Tell us how we can help..."
                                                rows={5}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact info sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 space-y-5"
                        >
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
                                <h3 className="text-lg font-semibold text-white">Other Ways to Reach Us</h3>

                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I have a question about SKUProvision.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">WhatsApp</div>
                                        <div className="text-xs text-green-400">Fastest response — usually within 1 hour</div>
                                    </div>
                                </a>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-white">Email</div>
                                            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                                {CONTACT_EMAIL}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-white">Phone</div>
                                            <div className="text-sm text-slate-400">+91 8700903037</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-white">Location</div>
                                            <div className="text-sm text-slate-400">Delhi, India</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <h3 className="text-sm font-semibold text-white mb-2">Response Time</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>WhatsApp</span><span className="text-green-400">~1 hour</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Email</span><span className="text-blue-400">~24 hours</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Contact Form</span><span className="text-blue-400">~24 hours</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
