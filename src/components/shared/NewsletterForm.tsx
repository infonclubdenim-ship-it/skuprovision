'use client';

import { useState } from 'react';
import { subscribeNewsletterAction } from '@/actions/global';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const result = await subscribeNewsletterAction(email.trim());

            if (result.error) {
                if (result.error.includes('already subscribed')) {
                    toast.info(result.error);
                } else {
                    toast.error(result.error);
                }
            } else {
                toast.success('Successfully subscribed to the newsletter!');
                setEmail('');
            }
        } catch {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" disabled={loading} size="icon" variant="secondary">
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}
