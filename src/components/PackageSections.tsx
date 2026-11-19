import React from 'react';
import { Filter, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { SectionHeadingMeta, TravelPackage } from '../types';
import { PackageCard } from './PackageCard';

export interface ActivePackageFilter {
  type: 'category' | 'month' | 'city';
  value: string;
  label: string;
}

interface PackageSectionsProps {
  activeFilter: ActivePackageFilter | null;
  onClearFilter: () => void;
  onSelectDetails: (pkg: TravelPackage) => void;
}

const SectionHeadingBlock: React.FC<{ meta: SectionHeadingMeta }> = ({ meta }) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    {meta.arabicBasmalah && (
      <p
        dir="rtl"
        lang="ar"
        className="font-arabic text-2xl md:text-3xl text-[#0B3B2E] mb-3 leading-relaxed"
      >
        {meta.arabicBasmalah}
      </p>
    )}
    {meta.kicker && (
      <p className="text-xs font-semibold tracking-[0.16em] text-[#9A7414] uppercase mb-2">
        {meta.kicker}
      </p>
    )}
    <h2
      className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-3"
      style={{ textWrap: 'balance' }}
    >
      {meta.title}
    </h2>
    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
      {meta.subtitle}
    </p>
  </div>
);

export const PackageSections: React.FC<PackageSectionsProps> = ({
  activeFilter,
  onClearFilter,
  onSelectDetails,
}) => {
  const { packages, siteContent } = useFirebase();
  const activePackages = packages.filter((p) => p.active);

  const getFilteredResults = (): TravelPackage[] => {
    if (!activeFilter) return [];
    if (activeFilter.type === 'category') {
      if (activeFilter.value === 'hajj-all') {
        return activePackages.filter(
          (p) => p.category === '3-star-hajj' || p.category === '5-star-hajj'
        );
      }
      if (activeFilter.value === 'london-umrah') {
        return activePackages.filter(
          (p) =>
            p.category === 'london-umrah' ||
            p.cityTag?.toLowerCase().includes('london') ||
            p.departureAirport?.toLowerCase().includes('london')
        );
      }
      return activePackages.filter((p) => p.category === activeFilter.value);
    }
    if (activeFilter.type === 'month') {
      const exact = activePackages.filter(
        (p) => p.monthTag?.toLowerCase() === activeFilter.value.toLowerCase()
      );
      return exact.length > 0 ? exact : activePackages.slice(0, 3);
    }
    if (activeFilter.type === 'city') {
      const term = activeFilter.value.toLowerCase();
      const matched = activePackages.filter(
        (p) =>
          p.cityTag?.toLowerCase().includes(term) ||
          p.departureAirport?.toLowerCase().includes(term)
      );
      return matched.length > 0 ? matched : activePackages.slice(0, 6);
    }
    return [];
  };

  const filteredList = getFilteredResults();

  const threeStar = activePackages.filter((p) => p.category === '3-star-umrah');
  const fourStar = activePackages.filter((p) => p.category === '4-star-umrah');
  const fiveStar = activePackages.filter((p) => p.category === '5-star-umrah');
  const ramadan = activePackages.filter((p) => p.category === 'ramadan-umrah');
  const premium = activePackages.filter((p) => p.category === 'premium-offer');

  return (
    <div>
      {/* Active Sub-Navigation / Month / City Filter View */}
      {activeFilter && (
        <section
          id="filtered-packages"
          className="bg-[#F3F1EC] border-b border-stone-200 py-12"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-300/70">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-[#0B3B2E]" />
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Showing Tailored Results
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
                    {activeFilter.label}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearFilter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Clear Filter</span>
              </button>
            </div>

            {filteredList.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
                <p className="text-slate-600 text-sm mb-3">
                  Custom dates and group allocations are available on request for{' '}
                  <strong>{activeFilter.label}</strong>.
                </p>
                <a
                  href="#quote-form"
                  className="inline-block px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-sm font-semibold"
                >
                  Request Custom Quote
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSelectDetails={onSelectDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 3: Arabic Basmalah + Affordable 3 Star Umrah Packages (3 columns) */}
      <section id="packages-3-star" className="py-14 md:py-16 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeadingBlock meta={siteContent.section3Star} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threeStar.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Deluxe 4 Star Umrah Packages (3 columns) */}
      <section id="packages-4-star" className="py-14 md:py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeadingBlock meta={siteContent.section4Star} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fourStar.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Luxury 5 Star Umrah Packages (3 columns) */}
      <section id="packages-5-star" className="py-14 md:py-16 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeadingBlock meta={siteContent.section5Star} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveStar.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Ramadan Umrah Packages: Equaling the Reward of Hajj (3 columns) */}
      <section id="packages-ramadan" className="py-14 md:py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeadingBlock meta={siteContent.sectionRamadan} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ramadan.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Limited Time Offers / Our Premium Packages (1 row, 2 columns) */}
      <section id="packages-premium" className="py-14 md:py-16 bg-[#F3F1EC]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeadingBlock meta={siteContent.sectionPremium} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {premium.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
