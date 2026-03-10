'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const WELCOME_MESSAGES = [
    "👋 Hi! I'm SKUBot. How can I help?",
    "🤔 Got questions about SKU management?",
    "🚀 Ask me about our pricing plans!",
    "📦 Need help with your products?",
];

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [welcomeIndex, setWelcomeIndex] = useState<number>(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // Rotate welcome messages
    useEffect(() => {
        const interval = setInterval(() => {
            setWelcomeIndex((prev) => (prev + 1) % WELCOME_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Hide widget while scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (!isOpen) {
                setIsScrolling(true);
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1000);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const webhookUrl = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL;
            if (!webhookUrl || webhookUrl.includes('your-n8n-url')) {
                // Fallback response when webhook is not configured
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Thanks for your message! Our chatbot is being configured. In the meantime, feel free to reach us via WhatsApp or email on the Contact page. 😊",
                    timestamp: new Date(),
                };
                setTimeout(() => {
                    setMessages((prev) => [...prev, botMsg]);
                    setLoading(false);
                }, 800);
                return;
            }

            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    session_id: sessionStorage.getItem('chatbot_session') || Date.now().toString(),
                }),
            });

            if (!res.ok) throw new Error('Failed to get response');

            const data = await res.json();
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || data.message || "I'm not sure how to help with that. Try asking about our features or pricing!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again later or contact us via WhatsApp! 🙏",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    // Save session ID
    useEffect(() => {
        if (!sessionStorage.getItem('chatbot_session')) {
            sessionStorage.setItem('chatbot_session', Date.now().toString());
        }
    }, []);

    return (
        <>
            {/* Floating button */}
            <AnimatePresence>
                {!isOpen && !isScrolling && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        {/* Tooltip */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={welcomeIndex}
                                initial={{ opacity: 0, y: 5, x: 5 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-white/10 pointer-events-none"
                            >
                                {WELCOME_MESSAGES[welcomeIndex]}
                                <div className="absolute bottom-0 right-5 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-white/10" />
                            </motion.div>
                        </AnimatePresence>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 flex items-center justify-center"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/20 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">SKUBot</h3>
                                    <span className="text-[10px] text-blue-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Messages area */}
                        <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                                        <Bot className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <p className="text-sm text-slate-400 mb-1">Hi there! 👋</p>
                                    <p className="text-xs text-slate-500 max-w-[200px]">
                                        Ask me anything about SKUProvision, features, or pricing.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-white/5 text-slate-300 border border-white/5 rounded-bl-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input area */}
                        <div className="px-3 pb-3 pt-1 border-t border-white/5 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-10 text-sm"
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={loading || !input.trim()}
                                    className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 shrink-0"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
