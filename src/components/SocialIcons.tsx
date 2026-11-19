import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { SocialLinks } from '../types';

interface SocialIconsProps {
  links: SocialLinks;
  variant?: 'dark' | 'light';
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  links,
  variant = 'dark',
}) => {
  const iconClass =
    variant === 'dark'
      ? 'text-stone-300 hover:text-[#E5C158] transition-colors'
      : 'text-slate-600 hover:text-[#0B3B2E] transition-colors';

  const boxClass =
    variant === 'dark'
      ? 'w-8 h-8 rounded-lg bg-white/8 border border-white/15 flex items-center justify-center hover:border-[#E5C158]/60 transition-colors'
      : 'w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:border-[#0B3B2E] transition-colors';

  return (
    <div className="flex items-center gap-2">
      {links.facebook && (
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={`${boxClass} ${iconClass}`}
        >
          <Facebook className="w-4 h-4" />
        </a>
      )}
      {links.instagram && (
        <a
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={`${boxClass} ${iconClass}`}
        >
          <Instagram className="w-4 h-4" />
        </a>
      )}
      {links.youtube && (
        <a
          href={links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className={`${boxClass} ${iconClass}`}
        >
          <Youtube className="w-4 h-4" />
        </a>
      )}
      {links.tiktok && (
        <a
          href={links.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className={`${boxClass} ${iconClass}`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.26 8.26 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.28Z" />
          </svg>
        </a>
      )}
      {links.twitterX && (
        <a
          href={links.twitterX}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className={`${boxClass} ${iconClass}`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      )}
    </div>
  );
};
