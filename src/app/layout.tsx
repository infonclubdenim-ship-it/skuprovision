import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { AnalyticsProvider } from "@/components/shared/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SKUProvision — Smart SKU Management for E-Commerce Sellers",
    template: "%s | SKUProvision",
  },
  description:
    "Manage your e-commerce products and SKU IDs across all platforms. Smart search, image compression, Excel import/export, and team access for Indian sellers.",
  keywords: [
    "SKU management",
    "e-commerce",
    "product management",
    "Flipkart",
    "Amazon",
    "Meesho",
    "inventory",
    "SKU search",
  ],
  authors: [{ name: "MultiSkillHub" }],
  creator: "MultiSkillHub",
  metadataBase: new URL("https://skuprovision.multiskillhub.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://skuprovision.multiskillhub.com",
    siteName: "SKUProvision",
    title: "SKUProvision — Smart SKU Management for E-Commerce Sellers",
    description:
      "Manage your e-commerce products and SKU IDs across all platforms. Smart search, image compression, and team access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKUProvision — Smart SKU Management",
    description:
      "All-in-one tool for e-commerce sellers to manage products and SKUs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <TooltipProvider>
            <ClientLayout>{children}</ClientLayout>
          </TooltipProvider>
        </NextAuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
