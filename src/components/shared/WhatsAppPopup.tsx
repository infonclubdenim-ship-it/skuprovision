'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, CheckCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function WhatsAppPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Show the popup toggle button dynamically after a tiny delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Sqhelper!%20I%20have%20a%20question%20about%20SKU%20Vision%20Pro.`, '_blank');
        setIsOpen(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="mb-4 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#075e54] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Sqhelper&backgroundColor=e2e8f0"
                                            alt="Sqhelper"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">Sqhelper</h3>
                                    <p className="text-emerald-100 text-xs">Typically replies instantly</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="bg-[#e5ddd5] p-4 h-48 overflow-y-auto relative flex flex-col gap-3">
                            {/* WhatsApp background pattern (pseudo) */}
                            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }}></div>

                            <div className="flex justify-center">
                                <span className="bg-[#e1f3fb] text-slate-500 text-[10px] px-2 py-1 rounded-md shadow-sm">Today</span>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white text-slate-800 text-sm p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative self-start"
                            >
                                <p>Namaste 🙏 Main Sqhelper bol rahi hoon, SKU Vision Pro se.</p>
                                <span className="text-[10px] text-slate-400 absolute bottom-1 right-2">Now</span>
                                <div className="pb-3"></div> {/* spacer for time */}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                                className="bg-white text-slate-800 text-sm p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative self-start"
                            >
                                <p>Aap kaise hain? Batayiye, aapko software mein koi madad chahiye?</p>
                                <span className="text-[10px] text-slate-400 absolute bottom-1 right-2">Now</span>
                                <div className="pb-3"></div>
                            </motion.div>
                        </div>

                        {/* Footer / Action */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#25D366]/20 active:scale-[0.98]"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Start Chat via WhatsApp
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                                <CheckCheck className="w-3 h-3 text-emerald-500" /> End-to-end encrypted
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl shadow-[#25D366]/30 flex items-center justify-center relative group"
                        aria-label="Chat on WhatsApp"
                    >
                        <MessageCircle className="w-7 h-7" />

                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[8px] items-center justify-center font-bold">1</span>
                        </span>

                        {/* Tooltip */}
                        <span className="absolute left-full ml-4 whitespace-nowrap bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Chat with Sqhelper
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
