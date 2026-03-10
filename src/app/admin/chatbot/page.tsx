'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Save, Webhook, Bot, Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminChatbotPage() {
    const [config, setConfig] = useState({
        enabled: true,
        name: 'SKUVision Assistant',
        greeting: 'Hi there! 👋 How can I help you regarding your plans or API setup?',
        themeColor: '#ef4444',
        provider: 'openai',
        apiKey: '••••••••••••••••••••••••••••••',
        model: 'gpt-4o-mini',
        contextPrompt: 'You are a helpful assistant for SKU Vision Pro...',
        ragEnabled: true,
    });

    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Chatbot configuration saved globally');
        }, 800);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">AI Chatbot Configuration</h2>
                    <p className="text-slate-400 mt-1">Manage widget appearance, AI model, and data training context.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                    <Save className="w-4 h-4" /> Save Config
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Settings Side */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4 text-blue-400" /> General Settings
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">{config.enabled ? 'Active' : 'Disabled'}</span>
                                    <Switch
                                        checked={config.enabled}
                                        onCheckedChange={c => setConfig({ ...config, enabled: c })}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Bot Name</Label>
                                    <Input
                                        value={config.name}
                                        onChange={e => setConfig({ ...config, name: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Primary Theme Color (Hex)</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded border border-white/10 shrink-0" style={{ backgroundColor: config.themeColor }} />
                                        <Input
                                            value={config.themeColor}
                                            onChange={e => setConfig({ ...config, themeColor: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Initial Greeting Message</Label>
                                <Input
                                    value={config.greeting}
                                    onChange={e => setConfig({ ...config, greeting: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                <Bot className="w-4 h-4 text-purple-400" /> Model & Provider
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">LLM Provider</Label>
                                    <select
                                        value={config.provider}
                                        onChange={e => setConfig({ ...config, provider: e.target.value })}
                                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    >
                                        <option value="openai">OpenAI</option>
                                        <option value="anthropic">Anthropic</option>
                                        <option value="gemini">Google Gemini</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 text-xs">Model Version</Label>
                                    <Input
                                        value={config.model}
                                        onChange={e => setConfig({ ...config, model: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">API Key <span className="text-rose-400 text-[10px] ml-1">Encrypted</span></Label>
                                <Input
                                    type="password"
                                    value={config.apiKey}
                                    onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white font-mono"
                                />
                            </div>

                            <div className="pt-4 mt-2 border-t border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <Label className="text-slate-300 font-medium">Use Documentation Context (RAG)</Label>
                                    </div>
                                    <Switch
                                        checked={config.ragEnabled}
                                        onCheckedChange={c => setConfig({ ...config, ragEnabled: c })}
                                        className="data-[state=checked]:bg-amber-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">When enabled, the bot will search through uploaded documentation and previous support tickets before answering.</p>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview Side */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Live Preview
                        </h3>

                        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-full max-w-[320px] mx-auto sm:mx-0 flex flex-col h-[480px]">
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between shrink-0" style={{ backgroundColor: config.themeColor }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold text-sm leading-tight">{config.name}</h4>
                                        <span className="text-white/70 text-[10px] flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 bg-slate-50 p-4 relative overflow-hidden">
                                {!config.enabled && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                        <Badge variant="secondary" className="bg-slate-800 text-white">Widget Offline</Badge>
                                    </div>
                                )}

                                <div className="text-[10px] text-center text-slate-400 mb-4">Today, 10:42 AM</div>

                                <div className="flex items-end gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.themeColor }}>
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-sm text-sm text-slate-700 max-w-[85%] shadow-sm">
                                        {config.greeting}
                                    </div>
                                </div>

                                <div className="flex items-end justify-end gap-2 mb-4">
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-br-sm text-sm text-white max-w-[85%] shadow-sm">
                                        How do I upgrade to the Enterprise plan?
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input Area */}
                            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="w-full h-10 pl-3 pr-10 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 focus:outline-none focus:border-slate-300"
                                        disabled
                                    />
                                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-not-allowed" style={{ backgroundColor: config.themeColor }}>
                                        <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center mt-2 text-[9px] text-slate-400">
                                    Powered by {config.provider === 'openai' ? 'OpenAI' : config.provider === 'anthropic' ? 'Anthropic' : 'Gemini'}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
