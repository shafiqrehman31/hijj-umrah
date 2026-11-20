import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plane,
  Play,
  Quote,
  Star,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { VideoTestimonial } from '../types';
import { AirlineLogo } from './AirlineLogo';

interface PartnersStepsTestimonialsFaqProps {
  onOpenStoriesModal: () => void;
  onSelectVideo: (video: VideoTestimonial) => void;
}

export const PartnersStepsTestimonialsFaq: React.FC<
  PartnersStepsTestimonialsFaqProps
> = ({ onOpenStoriesModal, onSelectVideo }) => {
  const { siteContent } = useFirebase();
  const [openFaqId, setOpenFaqId] = useState<string>(
    siteContent.faqSection.faqs[0]?.id || ''
  );

  const airlines = siteContent.airlines;
  const [airlineStartIdx, setAirlineStartIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || airlines.length <= 4) return;
    const timer = setInterval(() => {
      setAirlineStartIdx((prev) => (prev + 1) % airlines.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, airlines.length]);

  const visibleCount = Math.min(4, airlines.length);
  const visibleAirlines = Array.from({ length: visibleCount }, (_, offset) => {
    return airlines[(airlineStartIdx + offset) % airlines.length];
  });

  const handlePrevAirlines = () => {
    if (airlines.length === 0) return;
    setAirlineStartIdx((prev) => (prev - 1 + airlines.length) % airlines.length);
  };

  const handleNextAirlines = () => {
    if (airlines.length === 0) return;
    setAirlineStartIdx((prev) => (prev + 1) % airlines.length);
  };

  return (
    <div>
      {/* Section 9: Official Aviation Partners — 4 Airline Logo Cards across Desktop Main Screen */}
      <section
        className="py-12 md:py-14 bg-[#FAFAF8] border-b border-stone-200"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#9A7414] uppercase mb-1">
                Official Aviation Partners
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
                Trusted Airline Partners from UK Airports
              </h2>
            </div>

            {airlines.length > 4 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-mono-num mr-1">
                  Showing 4 of {airlines.length} carriers
                </span>
                <button
                  type="button"
                  onClick={handlePrevAirlines}
                  aria-label="Previous airlines"
                  className="w-9 h-9 rounded-lg border border-stone-300 bg-white hover:border-[#0B3B2E] text-slate-700 hover:text-[#0B3B2E] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextAirlines}
                  aria-label="Next airlines"
                  className="w-9 h-9 rounded-lg border border-stone-300 bg-white hover:border-[#0B3B2E] text-slate-700 hover:text-[#0B3B2E] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleAirlines.map((airline) => (
              <div
                key={airline.id}
                className="bg-white border border-stone-200 hover:border-[#0B3B2E]/50 rounded-xl p-6 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="flex items-center justify-center py-2 border-b border-stone-100">
                  <AirlineLogo airline={airline} />
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 font-medium truncate">
                    {airline.tagline || `${airline.name} Flights`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#0B3B2E] font-mono-num font-semibold shrink-0">
                    <Plane className="w-3 h-3 text-[#C59B27]" />
                    {airline.code}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {airlines.length > 4 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {airlines.map((a, idx) => (
                <button
                  key={a.id}
                  type="button"
                  aria-label={`Jump to ${a.name}`}
                  onClick={() => setAirlineStartIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === airlineStartIdx
                      ? 'w-6 bg-[#0B3B2E]'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 10: Simple Steps to Begin Your Sacred Journey */}
      <section className="py-14 md:py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2
              className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-3"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.processSection.title}
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              {siteContent.processSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {siteContent.processSection.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono-num text-3xl font-bold text-[#C59B27] block mb-4">
                    {step.stepNumber}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Pilgrim Testimonials (2-Column Split: Content Left, Image Right) */}
      <section id="pilgrim-stories" className="py-14 md:py-16 bg-[#F3F1EC] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#9A7414] uppercase mb-3">
                  Pilgrim Testimonials
                </p>
                <h2
                  className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  {siteContent.storiesSection.title}
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                  {siteContent.storiesSection.description}
                </p>

                {/* Featured Quote Snippet */}
                {siteContent.storiesSection.stories[0] && (
                  <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 mb-6">
                    <Quote className="w-5 h-5 text-[#C59B27] mb-2" />
                    <p className="text-sm text-slate-700 italic leading-relaxed mb-3">
                      "{siteContent.storiesSection.stories[0].quote}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {siteContent.storiesSection.stories[0].name} ·{' '}
                        {siteContent.storiesSection.stories[0].city}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[#C59B27]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={onOpenStoriesModal}
                  className="px-6 py-3 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {siteContent.storiesSection.ctaLabel}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 min-h-[320px] lg:min-h-full bg-stone-100">
              <img
                src={siteContent.storiesSection.imageUrl}
                alt="British Muslim family smiling after completing Umrah in Madinah"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: Video Testimonials (1 row, 3 columns) */}
      <section id="video-testimonials" className="py-14 md:py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#9A7414] uppercase mb-2">
              {siteContent.videoSection.kicker}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
              {siteContent.videoSection.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteContent.videoSection.videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-[#FAFAF8] border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onSelectVideo(vid)}
                    className="relative w-full aspect-[4/3] block group overflow-hidden cursor-pointer bg-slate-900"
                  >
                    <img
                      src={vid.thumbnailUrl}
                      alt={`${vid.pilgrimName} video review`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full bg-white/95 text-[#0B3B2E] flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white font-mono-num text-xs">
                      {vid.duration}
                    </span>
                  </button>

                  <div className="p-5">
                    <div className="text-xs text-slate-500 mb-1.5">
                      <span>{vid.city}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{vid.packageLabel}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {vid.pilgrimName}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      "{vid.quoteSummary}"
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectVideo(vid)}
                    className="text-xs font-semibold text-[#0B3B2E] hover:underline cursor-pointer"
                  >
                    {vid.videoUrl ? 'Play Video Testimonial' : 'Watch Full Review & Transcript'}
                  </button>
                  {vid.videoUrl && (
                    <span className="text-[11px] font-medium text-[#9A7414]">
                      Video Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 13: FAQ */}
      <section id="faq-section" className="py-14 md:py-16 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2
              className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-2"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.faqSection.title}
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              {siteContent.faqSection.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {siteContent.faqSection.faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-stone-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
