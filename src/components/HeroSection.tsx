import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  PlaneTakeoff,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { UK_AIRPORTS } from '../data/defaultSiteData';
import { QuoteSubmissionResult } from '../context/FirebaseContext';

interface HeroSectionProps {
  onOpenBeatPrice: () => void;
  onQuoteSuccess: (result: QuoteSubmissionResult, recipientEmail: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBeatPrice,
  onQuoteSuccess,
}) => {
  const { siteContent, submitQuote, currentUser } = useFirebase();
  const { hero } = siteContent;

  const defaultDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState(defaultDate);
  const [departureAirport, setDepartureAirport] = useState(UK_AIRPORTS[0]);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    input.focus();
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      }
    } catch {
      // Native ::-webkit-calendar-picker-indicator overlay opens calendar on WebKit/Blink
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid UK or international email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMsg('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitQuote({
        departureDate,
        departureAirport,
        adults,
        children: childrenCount,
        infants,
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      onQuoteSuccess(result, email.trim());
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to submit quote request right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[680px] lg:min-h-[740px] flex items-center overflow-hidden bg-[#0B1320]"
    >
      {/* Full Makkah Background Image */}
      <img
        src={hero.backgroundImage}
        alt="Masjid al-Haram and the Holy Kaaba in Makkah at golden twilight"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Measured Contrast Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#07111A]/85 via-[#07111A]/60 to-[#07111A]/75"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Liquid Glass Brand Proposition */}
          <div className="lg:col-span-6 liquid-glass rounded-2xl p-7 md:p-10 flex flex-col justify-between text-white">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#E5C158] uppercase mb-4">
                {hero.eyebrow}
              </p>
              <h1
                className="font-display font-semibold tracking-tight text-white mb-5 leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 3.8vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                {hero.heading}
              </h1>
              <p className="text-base md:text-[17px] text-stone-200 leading-relaxed mb-7 max-w-xl">
                {hero.subheading}
              </p>

              <ul className="space-y-3 mb-8">
                {hero.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm md:text-[15px] text-stone-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/15 flex flex-wrap items-center gap-3">
              <a
                href="#packages-3-star"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#C59B27] text-[#081A14] font-semibold text-sm hover:bg-[#d8ad34] transition-colors whitespace-nowrap shrink-0"
              >
                <span>{hero.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onOpenBeatPrice}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#E5C158]" />
                <span>{hero.secondaryCtaLabel}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Liquid Glass Quote Form */}
          <div
            id="quote-form"
            className="lg:col-span-6 liquid-glass rounded-2xl p-6 md:p-8 text-white flex flex-col justify-center"
          >
            <div className="mb-5">
              <p className="text-xs font-medium text-[#E5C158] tracking-wide mb-1">
                Instant UK Pilgrimage Quote
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">
                Request Your Tailored Best Price
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="hero-departure-date"
                    className="block text-xs font-medium text-stone-200 mb-1.5"
                  >
                    Departure Date
                  </label>
                  <div
                    onClick={openDatePicker}
                    className="relative cursor-pointer group"
                  >
                    <Calendar className="w-4 h-4 text-[#E5C158] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      id="hero-departure-date"
                      ref={dateInputRef}
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDatePicker();
                      }}
                      className="date-input-full-click w-full pl-9 pr-8 py-2.5 rounded-lg bg-white/12 border border-white/25 group-hover:border-[#E5C158]/70 text-white text-sm focus:outline-none focus:border-[#E5C158] [color-scheme:dark] cursor-pointer"
                    />
                    <ChevronDown className="w-4 h-4 text-stone-300 group-hover:text-[#E5C158] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Select Departure Airport
                  </label>
                  <div className="relative">
                    <PlaneTakeoff className="w-4 h-4 text-[#E5C158] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={departureAirport}
                      onChange={(e) => setDepartureAirport(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0E2020] border border-white/25 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    >
                      {UK_AIRPORTS.map((airport) => (
                        <option key={airport} value={airport} className="bg-[#0B1F19] text-white">
                          {airport}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Select Adults
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-[#E5C158] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full pl-8 pr-2 py-2.5 rounded-lg bg-[#0E2020] border border-white/25 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                        <option key={n} value={n} className="bg-[#0B1F19]">
                          {n} {n === 1 ? 'Adult' : 'Adults'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Select Children
                  </label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0E2020] border border-white/25 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n} className="bg-[#0B1F19]">
                        {n} {n === 1 ? 'Child' : 'Children'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Select Infants
                  </label>
                  <select
                    value={infants}
                    onChange={(e) => setInfants(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0E2020] border border-white/25 text-white text-sm focus:outline-none focus:border-[#E5C158]"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} className="bg-[#0B1F19]">
                        {n} {n === 1 ? 'Infant' : 'Infants'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#E5C158] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mahmood"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/12 border border-white/25 text-white placeholder:text-stone-300/70 text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-200 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#E5C158] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="+44 7700 900123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/12 border border-white/25 text-white placeholder:text-stone-300/70 text-sm focus:outline-none focus:border-[#E5C158]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#E5C158] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/12 border border-white/25 text-white placeholder:text-stone-300/70 text-sm focus:outline-none focus:border-[#E5C158]"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-200 bg-red-950/60 border border-red-400/40 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-lg bg-[#C59B27] hover:bg-[#d7ac35] text-[#071A13] font-bold text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{submitting ? 'Generating Your Quote...' : 'Get Best Price'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
