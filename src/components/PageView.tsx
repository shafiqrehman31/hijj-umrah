import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { QuoteSubmissionResult, useFirebase } from '../context/FirebaseContext';
import { UK_AIRPORTS } from '../data/defaultSiteData';
import { CmsPage, TravelPackage } from '../types';
import { PackageCard } from './PackageCard';
import { SocialIcons } from './SocialIcons';

interface PageViewProps {
  page: CmsPage;
  onBackHome: () => void;
  onSelectPackage: (pkg: TravelPackage) => void;
  onQuoteSuccess: (result: QuoteSubmissionResult, recipientEmail: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({
  page,
  onBackHome,
  onSelectPackage,
  onQuoteSuccess,
}) => {
  const { packages, siteContent, submitQuote } = useFirebase();
  const { contact, branding } = siteContent;

  const defaultDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departureDate, setDepartureDate] = useState(defaultDate);
  const [departureAirport, setDepartureAirport] = useState(UK_AIRPORTS[0]);
  const [adults, setAdults] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Resolve matching live packages for this page
  const getPagePackages = (): TravelPackage[] => {
    if (!page.packageFilter) return [];
    const active = packages.filter((p) => p.active);
    const { type, value } = page.packageFilter;

    if (type === 'all-umrah') {
      return active.filter((p) => !p.category.includes('hajj'));
    }
    if (type === 'all-hajj') {
      return active.filter((p) => p.category.includes('hajj'));
    }
    if (type === 'category') {
      if (value === 'london-umrah') {
        return active.filter(
          (p) =>
            p.category === 'london-umrah' ||
            p.cityTag?.toLowerCase().includes('london') ||
            p.departureAirport?.toLowerCase().includes('london')
        );
      }
      const matched = active.filter((p) => p.category === value);
      return matched.length > 0 ? matched : active.slice(0, 3);
    }
    if (type === 'month') {
      const matched = active.filter(
        (p) => p.monthTag?.toLowerCase() === value.toLowerCase()
      );
      return matched.length > 0 ? matched : active.slice(0, 3);
    }
    if (type === 'city') {
      const term = value.toLowerCase();
      const matched = active.filter(
        (p) =>
          p.cityTag?.toLowerCase().includes(term) ||
          p.departureAirport?.toLowerCase().includes(term)
      );
      return matched.length > 0 ? matched : active.slice(0, 6);
    }
    return [];
  };

  const matchingPackages = getPagePackages();
  const cleanPhone = contact.phone.replace(/\s+/g, '');
  const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Assalamu Alaikum ${contact.brandName}, I would like information regarding ${page.title}.`
  )}`;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitQuote({
        departureDate,
        departureAirport,
        adults,
        children: 0,
        infants: 0,
        email,
        fullName,
        phone,
      });
      onQuoteSuccess(result, email);
      setFullName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to send inquiry right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="bg-[#FAFAF8] min-h-screen">
      {/* Page Hero Banner */}
      <section className="relative bg-[#0B1320] text-white overflow-hidden">
        <img
          src={page.heroImage}
          alt={page.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#07111A]/90 via-[#07111A]/75 to-[#0B3B2E]/70"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          {/* Breadcrumb + Back to Home */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav aria-label="Breadcrumb" className="text-xs text-stone-300 flex items-center gap-2">
              <button
                type="button"
                onClick={onBackHome}
                className="hover:text-[#E5C158] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <span className="capitalize text-stone-400">{page.group}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#E5C158] font-medium">{page.title}</span>
            </nav>

            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Homepage</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#E5C158] uppercase mb-2.5">
              {page.eyebrow}
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {page.title}
            </h1>
            <p className="text-base md:text-lg text-stone-200 leading-relaxed">
              {page.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Editorial Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
              <p className="text-base md:text-lg text-slate-800 leading-relaxed">
                {page.intro}
              </p>

              {page.highlights.length > 0 && (
                <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 md:p-6">
                  <h2 className="font-display text-2xl font-semibold text-slate-900 mb-4">
                    Key Highlights &amp; Inclusions
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {page.highlights.map((hl, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {page.sections.length > 0 && (
                <div className="space-y-6 pt-2">
                  {page.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="border-t border-stone-100 pt-5 first:border-t-0 first:pt-0"
                    >
                      <h3 className="font-display text-2xl font-semibold text-[#0B3B2E] mb-2">
                        {sec.heading}
                      </h3>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Embedded Inquiry Form if Contact / Custom / Beat My Price Page */}
            {page.showContactForm && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
                  Send a Direct Inquiry to Our UK Desk
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Receive a tailored itinerary and email confirmation straight to your inbox.
                </p>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700 900123"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.co.uk"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Departure Airport
                      </label>
                      <select
                        value={departureAirport}
                        onChange={(e) => setDepartureAirport(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm bg-white"
                      >
                        {UK_AIRPORTS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Preferred Departure Date
                      </label>
                      <input
                        type="date"
                        required
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Adult Travellers
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Adult' : 'Adults'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span>{submitting ? 'Submitting...' : 'Get Best Price'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Advisory Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-[#0B3B2E] text-white rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C158] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{contact.atolNumber} Protected</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white">
                Speak With a UK Specialist
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed">
                Get instant availability, room-view upgrades, and customised family pricing from our London Whitechapel desk.
              </p>

              <div className="space-y-3 text-sm pt-2 border-t border-white/15">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-2.5 text-white hover:text-[#E5C158] font-mono-num"
                >
                  <Phone className="w-4 h-4 text-[#E5C158] shrink-0" />
                  <span>{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 text-stone-200 hover:text-white"
                >
                  <Mail className="w-4 h-4 text-[#E5C158] shrink-0" />
                  <span>{contact.email}</span>
                </a>
                <div className="flex items-start gap-2.5 text-xs text-stone-300">
                  <MapPin className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5" />
                  <span>{contact.officeAddress}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3 py-2.5 rounded-lg bg-[#C59B27] hover:bg-[#d7ac35] text-[#081A14] text-xs font-bold text-center"
                >
                  Call Now
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-lg bg-white/12 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Connect With {contact.brandName}
              </p>
              <SocialIcons links={branding.socialLinks} variant="light" />
            </div>
          </aside>
        </div>

        {/* Live Matching Packages for this Page */}
        {matchingPackages.length > 0 && (
          <div className="mt-12 pt-10 border-t border-stone-200">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#9A7414] uppercase mb-1">
                Live Availability
              </p>
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                Available Packages for {page.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelectDetails={onSelectPackage}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
};
