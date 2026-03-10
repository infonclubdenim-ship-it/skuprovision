'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSeoSettingsAction, updateSeoSettingsAction } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe, Search, Save, Loader2, Link as LinkIcon, Code } from 'lucide-react';
import { toast } from 'sonner';
import type { SEOSettings } from '@/lib/types';

export default function AdminSEOPage() {
    const [pages, setPages] = useState<SEOSettings[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Partial<SEOSettings>>({});

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const data = await getSeoSettingsAction();
            setPages(data);
        } catch {
            toast.error('Failed to load SEO settings');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (page: SEOSettings) => {
        setEditingId(page.id);
        setForm(page);
    };

    const handleSave = async () => {
        if (!editingId) return;
        try {
            await updateSeoSettingsAction(editingId, {
                meta_title: form.meta_title?.trim() || null,
                meta_description: form.meta_description?.trim() || null,
                og_title: form.og_title?.trim() || null,
                og_description: form.og_description?.trim() || null,
                og_image: form.og_image?.trim() || null,
                facebook_pixel_id: form.facebook_pixel_id?.trim() || null,
                ga4_id: form.ga4_id?.trim() || null,
                custom_head_tags: form.custom_head_tags?.trim() || null,
            });

            setPages(prev => prev.map(p => p.id === editingId ? { ...p, ...form } as SEOSettings : p));
            setEditingId(null);
            toast.success('SEO settings saved successfully');
        } catch {
            toast.error('Failed to save settings');
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white tracking-tight">SEO Manager</h2>
                <p className="text-slate-400 mt-1">Configure metadata, OpenGraph tags, and tracking pixels per page.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Page List Side */}
                <div className="md:col-span-1 space-y-3">
                    <Card className="bg-white/[0.02] border-white/5">
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-400" /> Pages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-full bg-white/5 rounded-lg mb-2 animate-pulse" />)
                            ) : (
                                pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => handleEdit(page)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${editingId === page.id
                                            ? 'bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                    >
                                        <span className="truncate pr-2">{page.page_path === '/' ? 'Home ( / )' : page.page_path}</span>
                                        <Search className={`w-3.5 h-3.5 ${editingId === page.id ? 'opacity-100 text-blue-400' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Side */}
                <div className="md:col-span-2">
                    {!editingId ? (
                        <Card className="bg-white/[0.02] border-white/5 h-full min-h-[400px] flex items-center justify-center border-dashed">
                            <div className="text-center text-slate-500">
                                <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p>Select a page from the left to edit its SEO settings.</p>
                            </div>
                        </Card>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={editingId}>
                            <Card className="bg-white/[0.02] border-white/5">
                                <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between pb-4">
                                    <CardTitle className="text-sm font-semibold text-white">
                                        Editing: <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-0.5 rounded-md ml-2">{pages.find(p => p.id === editingId)?.page_path}</span>
                                    </CardTitle>
                                    <Button onClick={handleSave} size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-white">
                                        <Save className="w-4 h-4 mr-2" /> Save Form
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6 space-y-8">

                                    {/* Basic Basic SEO */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <Search className="w-3.5 h-3.5" /> Basic Metadata
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-xs text-slate-400 mb-1.5 block">Meta Title (60 chars)</Label>
                                                <Input
                                                    value={form.meta_title || ''}
                                                    onChange={e => setForm({ ...form, meta_title: e.target.value })}
                                                    placeholder="e.g. SKU Vision Pro | Smart Image Finder"
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-400 mb-1.5 block">Meta Description (150 chars)</Label>
                                                <Textarea
                                                    value={form.meta_description || ''}
                                                    onChange={e => setForm({ ...form, meta_description: e.target.value })}
                                                    placeholder="Brief, compelling description of the page..."
                                                    rows={3}
                                                    className="bg-white/5 border-white/10 text-white resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* OpenGraph */}
                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <LinkIcon className="w-3.5 h-3.5" /> OpenGraph (Social Sharing)
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-slate-400 mb-1.5 block">OG Title</Label>
                                                    <Input
                                                        value={form.og_title || ''}
                                                        onChange={e => setForm({ ...form, og_title: e.target.value })}
                                                        placeholder="Overrides Meta Title for social"
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-slate-400 mb-1.5 block">OG Image URL</Label>
                                                    <Input
                                                        value={form.og_image || ''}
                                                        onChange={e => setForm({ ...form, og_image: e.target.value })}
                                                        placeholder="https://.../image.jpg"
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-400 mb-1.5 block">OG Description</Label>
                                                <Textarea
                                                    value={form.og_description || ''}
                                                    onChange={e => setForm({ ...form, og_description: e.target.value })}
                                                    placeholder="Overrides Meta Description for social"
                                                    rows={2}
                                                    className="bg-white/5 border-white/10 text-white resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tracking */}
                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                            <Code className="w-3.5 h-3.5" /> Tracking & Custom Code
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <Label className="text-xs text-slate-400 mb-1.5 block">Google Analytics 4 ID</Label>
                                                <Input
                                                    value={form.ga4_id || ''}
                                                    onChange={e => setForm({ ...form, ga4_id: e.target.value })}
                                                    placeholder="G-XXXXXXXXXX"
                                                    className="bg-white/5 border-white/10 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-400 mb-1.5 block">Meta Pixel ID</Label>
                                                <Input
                                                    value={form.facebook_pixel_id || ''}
                                                    onChange={e => setForm({ ...form, facebook_pixel_id: e.target.value })}
                                                    placeholder="XXXXXXXXXXXXXXXX"
                                                    className="bg-white/5 border-white/10 text-white font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-400 mb-1.5 block">Custom Head Tags (Advanced)</Label>
                                            <Textarea
                                                value={form.custom_head_tags || ''}
                                                onChange={e => setForm({ ...form, custom_head_tags: e.target.value })}
                                                placeholder="<script>...</script>"
                                                rows={4}
                                                className="bg-black/40 border-white/10 text-emerald-400 font-mono text-xs resize-none"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1.5">Caution: Invalid HTML here can break the page layout.</p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
