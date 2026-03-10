'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatbotWidget } from '@/components/layout/ChatbotWidget';
import { SignupPopup } from '@/components/layout/SignupPopup';
import { WhatsAppPopup } from '@/components/shared/WhatsAppPopup';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ChatbotWidget />
            <WhatsAppPopup />
            <SignupPopup />
        </>
    );
}
