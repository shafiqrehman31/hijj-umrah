import React from 'react';
import {
  Award,
  Briefcase,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface TrustSectionProps {
  onVerifyAtol: () => void;
  onReadReviews: () => void;
  onWatchVideo: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({
  onVerifyAtol,
  onReadReviews,
  onWatchVideo,
}) => {
  const { siteContent } = useFirebase();
  const { trustSection } = siteContent;

  const handleBoxClick = (type: 'atol' | 'reviews' | 'video') => {
    if (type === 'atol') onVerifyAtol();
    else if (type === 'reviews') onReadReviews();
    else onWatchVideo();
  };

  return (
    <section className="bg-white border-b border-stone-200 py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
            {trustSection.heading}
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            {trustSection.subheading}
          </p>
        </div>

        {/* 3 Trust Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {trustSection.boxes.map((box) => {
            const Icon =
              box.actionType === 'atol'
                ? ShieldCheck
                : box.actionType === 'reviews'
                ? Star
                : PlayCircle;

            return (
              <div
                key={box.id}
                className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#0B3B2E]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      {box.kicker}
                    </span>
                    <Icon className="w-5 h-5 text-[#C59B27]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
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
            );
          })}
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
