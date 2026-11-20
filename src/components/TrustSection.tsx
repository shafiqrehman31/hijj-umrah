import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  Lock,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { TrustBox } from '../types';

interface TrustSectionProps {
  onVerifyAtol: () => void;
  onReadReviews: () => void;
  onWatchVideo: () => void;
}

const TrustBoxLogo: React.FC<{ box: TrustBox; atolNumber: string }> = ({
  box,
  atolNumber,
}) => {
  const [imgErr, setImgErr] = useState(false);

  if (box.logoUrl && !imgErr) {
    return (
      <div className="h-12 flex items-center">
        <img
          src={box.logoUrl}
          alt={box.title}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="h-11 w-auto max-w-[180px] object-contain"
        />
      </div>
    );
  }

  if (box.actionType === 'atol') {
    return (
      <div className="flex items-center gap-3 h-12">
        {/* Official-style ATOL Protected CAA Shield Globe Logo */}
        <svg
          viewBox="0 0 56 56"
          className="w-12 h-12 shrink-0"
          role="img"
          aria-label="ATOL Protected"
        >
          <circle cx="28" cy="28" r="26" fill="#003D7A" />
          <circle cx="28" cy="28" r="22" fill="none" stroke="#E5C158" strokeWidth="1.4" />
          <ellipse cx="28" cy="28" rx="11" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity="0.8" />
          <line x1="10" y1="28" x2="46" y2="28" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />
          <path d="M12 20H44M12 36H44" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          <path
            d="M17 31L28 15L39 31L28 27L17 31Z"
            fill="#E5C158"
          />
        </svg>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-[#003D7A]">
              ATOL
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B3B2E]">
              PROTECTED
            </span>
          </div>
          <p className="font-mono-num text-[11px] font-semibold text-slate-500">
            CAA {atolNumber}
          </p>
        </div>
      </div>
    );
  }

  if (box.actionType === 'reviews') {
    return (
      <div className="flex items-center gap-3 h-12">
        {/* Trustpilot Green Star & 5-Box Score Logo */}
        <svg
          viewBox="0 0 186 48"
          className="h-11 w-auto max-w-[195px]"
          role="img"
          aria-label="Trustpilot 4.9 out of 5"
        >
          {/* Main Green Star */}
          <polygon
            points="20,4 24.7,15.8 37.5,16.5 27.6,24.6 30.8,37 20,30.1 9.2,37 12.4,24.6 2.5,16.5 15.3,15.8"
            fill="#00B67A"
          />
          <polygon points="20,30.1 26.8,34.4 25.1,26.8" fill="#005128" />
          <text
            x="45"
            y="22"
            fill="#0F172A"
            fontSize="16"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Trustpilot
          </text>
          {/* 5 Green Star Rating Boxes */}
          {[0, 1, 2, 3, 4].map((idx) => (
            <g key={idx} transform={`translate(${45 + idx * 21}, 27)`}>
              <rect width="18" height="18" rx="2" fill="#00B67A" />
              <polygon
                points="9,2.8 10.8,6.8 15.2,7.2 11.8,10.1 12.9,14.4 9,12.1 5.1,14.4 6.2,10.1 2.8,7.2 7.2,6.8"
                fill="#FFFFFF"
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 h-12">
      {/* Verified Video Reviews Logo */}
      <svg
        viewBox="0 0 56 44"
        className="w-14 h-11 shrink-0"
        role="img"
        aria-label="Verified Pilgrim Video Reviews"
      >
        <rect x="2" y="4" width="52" height="36" rx="10" fill="#B91C1C" />
        <polygon points="23,14 38,22 23,30" fill="#FFFFFF" />
      </svg>
      <div>
        <div className="flex items-center gap-0.5 text-[#C59B27]" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <polygon points="8,1 10.1,5.6 15,6.2 11.4,9.6 12.3,14.5 8,12.1 3.7,14.5 4.6,9.6 1,6.2 5.9,5.6" />
            </svg>
          ))}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">
          Verified Video Reviews
        </p>
      </div>
    </div>
  );
};

export const TrustSection: React.FC<TrustSectionProps> = ({
  onVerifyAtol,
  onReadReviews,
  onWatchVideo,
}) => {
  const { siteContent } = useFirebase();
  const { trustSection, contact, branding } = siteContent;

  const handleBoxClick = (type: 'atol' | 'reviews' | 'video') => {
    if (type === 'atol') onVerifyAtol();
    else if (type === 'reviews') onReadReviews();
    else onWatchVideo();
  };

  return (
    <section className="bg-white border-b border-stone-200 py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-9">
          {/* Agency Trust Crest / Custom Brand Logo Lockup */}
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={contact.brandName}
                referrerPolicy="no-referrer"
                className="h-9 w-auto max-w-[160px] object-contain"
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
            <span className="font-display text-xl font-bold text-[#0B3B2E]">
              {contact.brandName}
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
            {trustSection.heading}
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            {trustSection.subheading}
          </p>
        </div>

        {/* 3 Trust Boxes with Official Trust Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {trustSection.boxes.map((box) => (
            <div
              key={box.id}
              className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#0B3B2E]/40 transition-colors"
            >
              <div>
                <div className="mb-4 pb-3 border-b border-stone-200/80 flex items-center justify-between gap-2">
                  <TrustBoxLogo box={box} atolNumber={contact.atolNumber} />
                </div>
                <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase block mb-1">
                  {box.kicker}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  {box.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleBoxClick(box.actionType)}
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-white border border-stone-300 text-sm font-semibold text-[#0B3B2E] hover:bg-[#0B3B2E] hover:text-white hover:border-[#0B3B2E] transition-colors cursor-pointer"
              >
                {box.actionLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom 3-Pillar Strip */}
        <div className="border-t border-stone-200 pt-6 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0B3B2E]" />
            <span>{trustSection.bottomPillars[0] || 'Secure Booking'}</span>
          </span>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span className="inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#0B3B2E]" />
            <span>{trustSection.bottomPillars[1] || 'Financial Protection'}</span>
          </span>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span className="inline-flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C59B27]" />
            <span>{trustSection.bottomPillars[2] || 'Excellent Service'}</span>
          </span>
        </div>
      </div>
    </section>
  );
};
