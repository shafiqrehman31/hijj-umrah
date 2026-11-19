import React from 'react';
import {
  ArrowRight,
  Building2,
  CreditCard,
  Headphones,
  Plane,
  Target,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { MONTHS_LIST } from '../data/defaultSiteData';

interface MonthsAndWhySectionProps {
  onSelectMonth: (month: string) => void;
}

export const MonthsAndWhySection: React.FC<MonthsAndWhySectionProps> = ({
  onSelectMonth,
}) => {
  const { siteContent } = useFirebase();
  const { monthsSection } = siteContent;

  const getIcon = (key: string) => {
    switch (key) {
      case 'phone':
        return Headphones;
      case 'target':
        return Target;
      case 'plane':
        return Plane;
      case 'hotel':
        return Building2;
      default:
        return CreditCard;
    }
  };

  return (
    <section id="months-section" className="py-14 md:py-16 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
            {monthsSection.title}
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-3">
            {monthsSection.subtitle}
          </p>
          <p className="text-xs md:text-sm font-medium text-[#0B3B2E]">
            {monthsSection.ratingSummary}
          </p>
        </div>

        {/* 12 Months in 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {MONTHS_LIST.map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => onSelectMonth(month)}
              className="group bg-[#FAFAF8] hover:bg-[#0B3B2E] border border-stone-200 hover:border-[#0B3B2E] rounded-xl px-6 py-5 flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <span className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-white transition-colors">
                {month} Packages
              </span>
              <span className="w-9 h-9 rounded-lg bg-white group-hover:bg-[#C59B27] border border-stone-200 group-hover:border-[#C59B27] flex items-center justify-center text-[#0B3B2E] group-hover:text-[#081A14] transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>

        {/* Why Choose Aqdas Travel Box */}
        <div className="bg-[#0B3B2E] text-white rounded-2xl p-7 md:p-10">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white">
              {monthsSection.whyTitle}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {monthsSection.whyItems.map((item) => {
              const Icon = getIcon(item.iconKey);
              return (
                <div
                  key={item.id}
                  className="bg-white/8 border border-white/15 rounded-xl p-5 text-center flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#E5C158]" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
