'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { getSeoSettingsByPathAction } from '@/actions/global';
import type { SEOSettings } from '@/lib/types';

export function AnalyticsProvider() {
    const pathname = usePathname();
    const [seo, setSeo] = useState<SEOSettings | null>(null);

    useEffect(() => {
        // Fetch SEO settings for the current path
        const fetchSeo = async () => {
            // Find exact path or fallback to '/' if not found? 
            // Actually, we'll try to match exact path.
            try {
                const data = await getSeoSettingsByPathAction(pathname);

                if (data) {
                    setSeo(data);
                    updateMetaTags(data);
                } else {
                    setSeo(null);
                }
            } catch (err) {
                console.error('Failed to fetch SEO settings', err);
            }
        };

        fetchSeo();
    }, [pathname]);

    const updateMetaTags = (data: SEOSettings) => {
        if (data.meta_title) document.title = data.meta_title;

        // Helper to update or create meta tags
        const setMeta = (nameOrProperty: 'name' | 'property', key: string, value: string | null) => {
            let el = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
            if (value) {
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute(nameOrProperty, key);
                    document.head.appendChild(el);
                }
                el.setAttribute('content', value);
            } else if (el) {
                // Remove if value is empty
                el.remove();
            }
        };

        setMeta('name', 'description', data.meta_description);
        setMeta('property', 'og:title', data.og_title || data.meta_title);
        setMeta('property', 'og:description', data.og_description || data.meta_description);
        setMeta('property', 'og:image', data.og_image);

        // Append custom head tags safely if possible
        if (data.custom_head_tags) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data.custom_head_tags;
                Array.from(tempDiv.children).forEach((child) => {
                    if (child.tagName === 'SCRIPT') {
                        const script = document.createElement('script');
                        script.text = child.innerHTML;
                        Array.from(child.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
                        document.head.appendChild(script);
                    } else {
                        document.head.appendChild(child.cloneNode(true));
                    }
                });
            } catch (e) {
                console.error('Failed to parse custom head tags', e);
            }
        }
    };

    return (
        <>
            {/* Google Analytics 4 */}
            {seo?.ga4_id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${seo.ga4_id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seo.ga4_id}', {
                page_path: window.location.pathname,
              });
            `}
                    </Script>
                </>
            )}

            {/* Meta/Facebook Pixel */}
            {seo?.facebook_pixel_id && (
                <Script id="fb-pixel-init" strategy="afterInteractive">
                    {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${seo.facebook_pixel_id}');
            fbq('track', 'PageView');
          `}
                </Script>
            )}
        </>
    );
}
