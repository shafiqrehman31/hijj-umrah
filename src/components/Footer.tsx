import React from 'react';
import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { buildWhatsAppUrl, formatWhatsAppDigits } from '../utils/contactUtils';
import { SocialIcons } from './SocialIcons';

interface FooterProps {
  onAction: (actionType: string, target: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onAction }) => {
  const { siteContent } = useFirebase();
  const { contact, branding } = siteContent;

  return (
    <footer
      id="footer-contact"
      className="bg-[#081A14] text-stone-200 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Social Media Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              {branding.logoUrl && (
                <img
                  src={branding.logoUrl}
                  alt={contact.brandName}
                  referrerPolicy="no-referrer"
                  className="h-8 w-auto object-contain"
                />
              )}
              <span className="font-display text-2xl font-bold text-white">
                {contact.brandName}
              </span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              {contact.aboutTagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5C158] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{contact.atolNumber} Protected · UK Civil Aviation Authority</span>
            </div>
            <div className="pt-1">
              <p className="text-xs text-stone-400 mb-2">Follow {contact.brandName}</p>
              <SocialIcons links={branding.socialLinks} variant="dark" />
            </div>
          </div>

          {/* Packages Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E5C158] uppercase">
              Packages
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', '3-star-umrah')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  3 Star Umrah
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', '4-star-umrah')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  4 Star Umrah
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', '5-star-umrah')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  5 Star Umrah
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'ramadan-umrah')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Ramadan Umrah
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'hajj-packages')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Hajj Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Guides & Services */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E5C158] uppercase">
              Guides &amp; Services
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'umrah-guide')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Umrah Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'visa-documentation')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Visa Requirements
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'beat-my-price')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Beat My Price
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'transportation-services')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  VIP Transfers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'about-us')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E5C158] uppercase">
              Legal &amp; Compliance
            </h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'privacy-policy')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'terms-conditions')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'atol-protection')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  ATOL Protection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'cookie-policy')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'refund-cancellation-policy')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onAction('page', 'complaints-procedure')}
                  className="hover:text-white cursor-pointer text-left"
                >
                  Complaints Procedure
                </button>
              </li>
            </ul>
          </div>

          {/* UK Contact Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#E5C158] uppercase">
              UK Head Office
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <span>{contact.officeAddress}</span>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-white font-mono-num"
                >
                  <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(
                    contact.whatsappNumber,
                    `Assalamu Alaikum ${contact.brandName}, I have a question about your Umrah & Hajj packages.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#4ade80] font-mono-num"
                >
                  <MessageCircle className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <span>+{formatWhatsAppDigits(contact.whatsappNumber)}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 hover:text-white break-all"
                >
                  <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links Strip (No Admin link shown) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>{contact.copyrightText}</p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onAction('page', 'privacy-policy')}
              className="hover:text-white cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onAction('page', 'terms-conditions')}
              className="hover:text-white cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onAction('page', 'atol-protection')}
              className="hover:text-white cursor-pointer"
            >
              ATOL 11842
            </button>
            <button
              type="button"
              onClick={() => onAction('page', 'contact-us')}
              className="hover:text-white cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
