import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { NavItem, NavSubItem } from '../types';
import { buildWhatsAppUrl } from '../utils/contactUtils';
import { SocialIcons } from './SocialIcons';

interface HeaderProps {
  onAction: (actionType: string, target: string) => void;
  onOpenQuoteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAction,
  onOpenQuoteModal,
}) => {
  const { navigation, siteContent } = useFirebase();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNested, setOpenNested] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const handleNavClick = (
    item: { actionType: string; target: string },
    e?: React.MouseEvent
  ) => {
    if (e) e.preventDefault();
    setOpenDropdown(null);
    setOpenNested(null);
    setMobileOpen(false);
    onAction(item.actionType, item.target);
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Slim Contact & Social Utility Strip above Header (Desktop) */}
      <div className="hidden md:block bg-[#082A21] text-stone-200 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-stone-300 tracking-wide">
              {siteContent.contact.atolNumber} Protected · UK Hajj &amp; Umrah Specialists
            </span>
            <SocialIcons links={siteContent.branding.socialLinks} variant="dark" />
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${siteContent.contact.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-[#E5C158] transition-colors whitespace-nowrap font-mono-num"
            >
              <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{siteContent.contact.phone}</span>
            </a>
            <a
              href={buildWhatsAppUrl(
                siteContent.contact.whatsappNumber,
                `Assalamu Alaikum ${siteContent.contact.brandName}, I would like to inquire about Umrah & Hajj packages.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#4ade80] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[#E5C158] transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{siteContent.contact.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark & Custom Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick({ actionType: 'home', target: 'home' }, e)}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B2E] rounded-md"
          >
            {siteContent.branding.logoUrl ? (
              <img
                src={siteContent.branding.logoUrl}
                alt={siteContent.contact.brandName}
                referrerPolicy="no-referrer"
                className="h-9 w-auto max-w-[140px] object-contain shrink-0"
              />
            ) : (
              <svg
                viewBox="0 0 36 36"
                className="w-8 h-8 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <rect width="36" height="36" rx="8" fill="#0B3B2E" />
                <path
                  d="M18 7C14.134 7 11 10.134 11 14V24H25V14C25 10.134 21.866 7 18 7Z"
                  stroke="#C59B27"
                  strokeWidth="1.75"
                />
                <rect x="13" y="21" width="10" height="6" rx="1" fill="#C59B27" />
                <path d="M13 23H23" stroke="#0B3B2E" strokeWidth="1.2" />
                <circle cx="18" cy="13" r="1.5" fill="#E5C158" />
              </svg>
            )}
            <span className="font-display text-2xl font-bold tracking-tight text-[#0B3B2E]">
              {siteContent.contact.brandName}
            </span>
          </a>

          {/* Zone 2: Desktop Navigation with Multi-Level Sub-Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13.5px] font-medium text-slate-700"
          >
            {navigation.items.map((item: NavItem) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openDropdown === item.id;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenDropdown(item.id)}
                  onMouseLeave={() => {
                    setOpenDropdown(null);
                    setOpenNested(null);
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(item, e)}
                    className="inline-flex items-center gap-1 py-2 text-slate-700 hover:text-[#0B3B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 border-transparent hover:border-[#C59B27]"
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {hasChildren && isOpen && (
                    <div className="absolute left-0 top-full pt-1 z-50 min-w-[250px]">
                      <div className="bg-white border border-stone-200 rounded-xl shadow-xl py-2">
                        {item.children!.map((sub: NavSubItem) => {
                          const hasNested = sub.children && sub.children.length > 0;
                          const isNestedOpen = openNested === sub.id;
                          return (
                            <div
                              key={sub.id}
                              className="relative"
                              onMouseEnter={() =>
                                setOpenNested(hasNested ? sub.id : null)
                              }
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  if (!hasNested) handleNavClick(sub, e);
                                  else setOpenNested(isNestedOpen ? null : sub.id);
                                }}
                                className="w-full px-4 py-2 text-left text-[13px] text-slate-700 hover:bg-[#F3F1EC] hover:text-[#0B3B2E] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                              >
                                <span className="truncate">{sub.label}</span>
                                {hasNested && (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                              </button>

                              {hasNested && isNestedOpen && (
                                <div className="absolute left-full top-0 pl-1 z-50 min-w-[255px]">
                                  <div className="bg-white border border-stone-200 rounded-xl shadow-xl py-2 max-h-[380px] overflow-y-auto">
                                    {sub.children!.map((deep) => (
                                      <button
                                        key={deep.id}
                                        type="button"
                                        onClick={(e) => handleNavClick(deep, e)}
                                        className="w-full px-4 py-2 text-left text-[13px] text-slate-700 hover:bg-[#F3F1EC] hover:text-[#0B3B2E] transition-colors block cursor-pointer"
                                      >
                                        {deep.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action + Mobile Trigger (No Portal/Dashboard link shown) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs md:text-sm font-semibold hover:bg-[#082A21] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              Get Quote
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-50 cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 max-h-[80vh] overflow-y-auto px-4 py-4 space-y-2">
            <div className="pb-3 mb-3 border-b border-stone-200 space-y-2 text-xs text-slate-600">
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${siteContent.contact.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 font-mono-num text-[#0B3B2E] font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
                  {siteContent.contact.phone}
                </a>
                <a
                  href={buildWhatsAppUrl(
                    siteContent.contact.whatsappNumber,
                    `Assalamu Alaikum ${siteContent.contact.brandName}, I would like to inquire about Umrah & Hajj packages.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#166534] font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#166534]" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${siteContent.contact.email}`}
                  className="inline-flex items-center gap-1.5 text-slate-700"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C59B27]" />
                  {siteContent.contact.email}
                </a>
              </div>
              <SocialIcons links={siteContent.branding.socialLinks} variant="light" />
            </div>
            {navigation.items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExp = mobileExpanded === item.id;
              return (
                <div key={item.id} className="border-b border-stone-100 pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => handleNavClick(item, e)}
                      className="py-2 text-sm font-semibold text-slate-800 flex-1 text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(isExp ? null : item.id)}
                        className="p-2 text-slate-500 cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isExp ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExp && (
                    <div className="pl-3 space-y-1 mt-1">
                      {item.children!.map((sub) => (
                        <div key={sub.id}>
                          <button
                            type="button"
                            onClick={(e) => {
                              if (!sub.children || sub.children.length === 0) {
                                handleNavClick(sub, e);
                              }
                            }}
                            className="block w-full text-left py-1.5 text-xs font-medium text-slate-600 hover:text-[#0B3B2E] cursor-pointer"
                          >
                            {sub.label}
                          </button>
                          {sub.children && sub.children.length > 0 && (
                            <div className="pl-3 border-l border-stone-200 space-y-1 my-1">
                              {sub.children.map((deep) => (
                                <button
                                  key={deep.id}
                                  type="button"
                                  onClick={(e) => handleNavClick(deep, e)}
                                  className="block w-full text-left py-1 text-xs text-slate-500 hover:text-[#0B3B2E] cursor-pointer"
                                >
                                  {deep.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
};
