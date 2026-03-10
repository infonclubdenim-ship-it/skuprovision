'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContactMessagesAction, updateContactMessageAction, deleteContactMessageAction } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Clock, Search, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await getContactMessagesAction();
            setMessages(data);
        } catch {
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string, currentStatus: boolean) => {
        try {
            await updateContactMessageAction(id, !currentStatus);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
        } catch {
            toast.error('Failed to update status');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteContactMessageAction(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            toast.success('Message deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const filtered = messages.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Contact Messages</h2>
                    <p className="text-slate-400 mt-1">Inquiries from the public contact form.</p>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search messages..."
                        className="pl-9 w-full sm:w-[300px] h-10 bg-white/5 border-white/10 text-white rounded-xl"
                    />
                </div>
            </motion.div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <Card key={i} className="bg-white/[0.02] border-white/5 h-32 animate-pulse" />)
                ) : filtered.length === 0 ? (
                    <Card className="bg-white/[0.02] border-white/5 border-dashed">
                        <CardContent className="flex items-center justify-center py-16 text-center text-slate-500">
                            No messages found
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map((msg, i) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className={`bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden ${msg.is_read ? 'border-white/5' : 'border-blue-500/30 shadow-lg shadow-blue-500/5'}`}>
                                {!msg.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-lg transition-colors ${msg.is_read ? 'text-slate-300 font-medium' : 'text-white font-bold'}`}>
                                                    {msg.name}
                                                </h3>
                                                {!msg.is_read && <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">New</Badge>}
                                                <span className="text-xs text-slate-500 flex items-center gap-1.5 ml-auto md:ml-0">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => window.open(`mailto:${msg.email}`)}><Mail className="w-4 h-4" /> {msg.email}</span>
                                                {msg.phone && <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => window.open(`tel:${msg.phone}`)}><Phone className="w-4 h-4" /> {msg.phone}</span>}
                                            </div>

                                            <div className={`p-4 rounded-xl border ${msg.is_read ? 'bg-white/[0.01] border-white/5 text-slate-400' : 'bg-white/[0.03] border-white/10 text-slate-200'} text-sm leading-relaxed whitespace-pre-wrap`}>
                                                {msg.message}
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-4">
                                            <Button onClick={() => markAsRead(msg.id, msg.is_read)} variant={msg.is_read ? 'outline' : 'default'} size="sm" className={`w-full md:w-auto h-9 ${!msg.is_read ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}>
                                                {msg.is_read ? <MessageSquare className="w-4 h-4 mr-1.5" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                                                {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                                            </Button>
                                            <Button onClick={() => deleteMessage(msg.id)} variant="ghost" size="sm" className="h-9 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full md:w-auto">
                                                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
