import React, { useState } from 'react';
import {
  Building2,
  Check,
  MessageCircle,
  Phone,
  Plane,
  Star,
} from 'lucide-react';
import { TravelPackage } from '../types';
import { useFirebase } from '../context/FirebaseContext';
import { buildWhatsAppUrl } from '../utils/contactUtils';

interface PackageCardProps {
  pkg: TravelPackage;
  onSelectDetails: (pkg: TravelPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelectDetails }) => {
  const { siteContent } = useFirebase();
  const [imgError, setImgError] = useState(false);

  const cleanPhone = siteContent.contact.phone.replace(/\s+/g, '');
  const waUrl = buildWhatsAppUrl(
    siteContent.contact.whatsappNumber,
    `Assalamu Alaikum ${siteContent.contact.brandName}, I am interested in "${pkg.title}" (£${pkg.priceGbp}pp). Please share details.`
  );

  const isSoldOut = pkg.availableSlots <= 0;
  const makkahDays = pkg.makkahNights ?? Math.ceil(pkg.nights / 2);
  const madinahDays = pkg.madinahNights ?? Math.floor(pkg.nights / 2);

  return (
    <article className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#0B3B2E]/40">
      <div>
        {/* Image Container with Fallback */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0B3B2E] to-[#132A24] overflow-hidden">
          {pkg.imageUrl && !imgError ? (
            <img
              src={pkg.imageUrl}
              alt={pkg.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
              <Building2 className="w-9 h-9 text-[#E5C158] mb-2" />
              <p className="font-display text-lg font-semibold">{pkg.title}</p>
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30"
          />

          {/* Top Stay Duration Sticker (Total Nights + Makkah & Madinah Days) */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-start pointer-events-none">
            <div
              className="inline-flex items-center max-w-full rounded-lg overflow-hidden border border-[#E5C158]/85 shadow-[0_6px_18px_rgba(7,26,20,0.45)]"
              aria-label={`${pkg.nights} Nights: ${makkahDays} Days Makkah, ${madinahDays} Days Madinah`}
            >
              <span className="bg-gradient-to-br from-[#F3D87F] via-[#E5C158] to-[#C59B27] text-[#081A14] px-2.5 py-1 text-[11px] font-extrabold tracking-wide whitespace-nowrap shrink-0 font-mono-num">
                {pkg.nights} Nights
              </span>
              <span className="bg-[#081A14]/92 backdrop-blur-md text-white px-2.5 py-1 text-[11px] font-semibold tracking-tight flex items-center gap-1.5 truncate">
                <span className="whitespace-nowrap">
                  <strong className="font-mono-num text-[#E5C158]">{makkahDays}</strong> Days Makkah
                </span>
                <span aria-hidden="true" className="text-[#E5C158]/75">·</span>
                <span className="whitespace-nowrap">
                  <strong className="font-mono-num text-[#E5C158]">{madinahDays}</strong> Days Madinah
                </span>
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div className="flex items-center gap-1" aria-label={`${pkg.starRating} Star Hotel Tier`}>
              {Array.from({ length: pkg.starRating }).map((_, idx) => (
                <Star
                  key={idx}
                  className="w-3.5 h-3.5 fill-[#E5C158] text-[#E5C158]"
                />
              ))}
            </div>
            <span className="font-mono-num text-xs font-medium text-stone-100">
              {isSoldOut ? 'Sold Out' : `${pkg.availableSlots} of ${pkg.totalSlots} slots left`}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6">
          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <span className="font-mono-num">{pkg.nights} Nights</span>
            <span aria-hidden="true">·</span>
            <span>{pkg.departureAirport || 'UK Departure'}</span>
            {pkg.monthTag && (
              <>
                <span aria-hidden="true">·</span>
                <span>{pkg.monthTag}</span>
              </>
            )}
          </div>

          <h3 className="font-display text-2xl font-semibold text-slate-900 leading-snug mb-3">
            {pkg.title}
          </h3>

          {/* Hotels */}
          <div className="space-y-2 py-3 border-y border-stone-100 text-xs text-slate-700 mb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-[#0B3B2E]">Makkah:</span>{' '}
                <span>{pkg.makkahHotel}</span>
              </div>
              {pkg.makkahDistance && (
                <span className="text-slate-500 text-right shrink-0">
                  {pkg.makkahDistance}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-[#0B3B2E]">Madinah:</span>{' '}
                <span>{pkg.madinahHotel}</span>
              </div>
              {pkg.madinahDistance && (
                <span className="text-slate-500 text-right shrink-0">
                  {pkg.madinahDistance}
                </span>
              )}
            </div>
          </div>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <ul className="space-y-1.5 mb-5">
              {pkg.highlights.slice(0, 4).map((hl, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >
                  <Check className="w-3.5 h-3.5 text-[#0B3B2E] shrink-0" />
                  <span className="truncate">{hl}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Price & 3 Action Buttons: More Details, Call, WhatsApp */}
      <div className="px-5 md:px-6 pb-5 pt-3 border-t border-stone-100 bg-[#FAFAF8]/60">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-slate-500 block">Starting From</span>
            <span className="font-mono-num text-2xl font-bold text-[#0B3B2E]">
              £{pkg.priceGbp.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1">per person</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Plane className="w-3.5 h-3.5 text-[#C59B27]" />
            Flights + Visa
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectDetails(pkg)}
            className="px-2.5 py-2.5 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white text-xs font-semibold transition-colors whitespace-nowrap text-center cursor-pointer"
          >
            More Details
          </button>
          <a
            href={`tel:${cleanPhone}`}
            className="px-2.5 py-2.5 rounded-lg bg-white border border-stone-300 hover:border-[#0B3B2E] text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 text-[#0B3B2E]" />
            <span>Call</span>
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-2.5 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};
