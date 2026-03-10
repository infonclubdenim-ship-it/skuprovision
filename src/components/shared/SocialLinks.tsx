import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { DEFAULT_SOCIAL_LINKS } from '@/lib/constants';

interface SocialLinksProps {
    links?: typeof DEFAULT_SOCIAL_LINKS;
    className?: string;
}

export function SocialLinks({ links = DEFAULT_SOCIAL_LINKS, className = '' }: SocialLinksProps) {
    const socialItems = [
        { icon: Youtube, href: links.youtube, label: 'YouTube' },
        { icon: Instagram, href: links.instagram, label: 'Instagram' },
        { icon: Facebook, href: links.facebook, label: 'Facebook' },
        { icon: Twitter, href: links.twitter, label: 'Twitter/X' },
    ];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {socialItems.map((item) => (
                <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                >
                    <item.icon className="h-5 w-5" />
                </a>
            ))}
        </div>
    );
}
