import React, { useState } from 'react';
import { AirlinePartner } from '../types';

interface AirlineLogoProps {
  airline: AirlinePartner;
}

/**
 * Renders crisp, bespoke SVG airline livery emblems & wordmarks for each UK aviation partner
 * (with optional custom image URL support uploaded/configured in Admin).
 */
export const AirlineLogo: React.FC<AirlineLogoProps> = ({ airline }) => {
  const [imgErr, setImgErr] = useState(false);

  if (airline.logoUrl && !imgErr) {
    return (
      <div className="h-14 w-full flex items-center justify-center px-2">
        <img
          src={airline.logoUrl}
          alt={`${airline.name} logo`}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="max-h-12 max-w-full w-auto object-contain"
        />
      </div>
    );
  }

  const code = airline.code.toUpperCase();

  switch (code) {
    case 'SV': // Saudi Airlines / Saudia
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Saudia">
          <rect x="2" y="7" width="40" height="40" rx="10" fill="#006C35" />
          <path d="M22 14V38M15 22C17 19 20 18 22 18C24 18 27 19 29 22M14 29L22 33L30 29" stroke="#D4AF37" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="22" cy="14" r="2" fill="#D4AF37" />
          <text x="52" y="29" fill="#006C35" fontSize="16" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.5">
            SAUDIA
          </text>
          <text x="52" y="42" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.2">
            SAUDI AIRLINES
          </text>
        </svg>
      );

    case 'BA': // British Airways
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="British Airways">
          <path d="M6 21C16 14 34 15 44 21C35 23 23 23 12 22Z" fill="#075AAA" />
          <path d="M8 29C19 31 32 30 43 26C33 34 18 35 6 31Z" fill="#C8102E" />
          <text x="52" y="27" fill="#0B2241" fontSize="14.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.4">
            BRITISH
          </text>
          <text x="52" y="42" fill="#C8102E" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1">
            AIRWAYS
          </text>
        </svg>
      );

    case 'QR': // Qatar Airways
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Qatar Airways">
          <circle cx="23" cy="27" r="18" fill="#5C0632" />
          <path d="M16 33C17 26 21 21 28 19C26 23 25 26 26 31M22 17L26 12M25 18L30 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <text x="49" y="29" fill="#5C0632" fontSize="16" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.8">
            QATAR
          </text>
          <text x="49" y="42" fill="#64748B" fontSize="9.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.6">
            AIRWAYS
          </text>
        </svg>
      );

    case 'EK': // Emirates
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Emirates">
          <rect x="4" y="9" width="38" height="36" rx="8" fill="#D71921" />
          <path d="M12 29C17 20 28 18 34 25C29 24 23 27 20 33C25 32 30 31 35 31" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" fill="none" />
          <text x="50" y="32" fill="#D71921" fontSize="18" fontWeight="800" fontFamily="Cormorant Garamond, Georgia, serif" letterSpacing="0.5">
            Emirates
          </text>
          <text x="50" y="43" fill="#64748B" fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1">
            FLY BETTER · DUBAI
          </text>
        </svg>
      );

    case 'EY': // Etihad Airways
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Etihad Airways">
          <polygon points="23,8 39,20 33,42 13,42 7,20" fill="#B68A35" />
          <polygon points="23,14 33,23 29,37 17,37 13,23" fill="#1E293B" />
          <path d="M23 17L28 28H18Z" fill="#E5C158" />
          <text x="48" y="29" fill="#1E293B" fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.1">
            ETIHAD
          </text>
          <text x="48" y="42" fill="#9A7414" fontSize="9.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.6">
            AIRWAYS
          </text>
        </svg>
      );

    case 'TK': // Turkish Airlines
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Turkish Airlines">
          <circle cx="23" cy="27" r="18" fill="#E30A17" />
          <path d="M13 31C18 24 27 21 34 22C28 25 25 29 24 35C22 31 18 30 13 31Z" fill="#FFFFFF" />
          <text x="49" y="28" fill="#0F172A" fontSize="14.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.4">
            TURKISH
          </text>
          <text x="49" y="42" fill="#E30A17" fontSize="10.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.3">
            AIRLINES
          </text>
        </svg>
      );

    case 'RJ': // Royal Jordanian
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Royal Jordanian">
          <rect x="4" y="9" width="38" height="36" rx="18" fill="#111827" />
          <path d="M14 31L17 21L23 26L29 21L32 31H14Z" fill="#C59B27" />
          <circle cx="23" cy="17" r="2" fill="#E5C158" />
          <text x="50" y="27" fill="#111827" fontSize="14" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.5">
            ROYAL
          </text>
          <text x="50" y="41" fill="#9A7414" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.8">
            JORDANIAN
          </text>
        </svg>
      );

    case 'GF': // Gulf Air
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Gulf Air">
          <rect x="4" y="9" width="38" height="36" rx="9" fill="#4A3520" />
          <path d="M11 33C16 26 24 19 34 18C30 24 27 29 22 36L19 30Z" fill="#D4AF37" />
          <text x="50" y="29" fill="#4A3520" fontSize="15.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.6">
            GULF AIR
          </text>
          <text x="50" y="42" fill="#9A7414" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.2">
            BAHRAIN CARRIER
          </text>
        </svg>
      );

    case 'WY': // Oman Air
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="Oman Air">
          <circle cx="23" cy="27" r="18" fill="#007A87" />
          <path d="M13 28C17 20 27 17 33 23C28 24 23 28 20 35C18 32 16 29 13 28Z" fill="#D4AF37" />
          <text x="49" y="29" fill="#007A87" fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.8">
            OMAN AIR
          </text>
          <text x="49" y="42" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.1">
            MUSCAT GATEWAY
          </text>
        </svg>
      );

    case 'MS': // EgyptAir
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label="EgyptAir">
          <circle cx="23" cy="27" r="18" fill="#00337F" />
          <path d="M14 29L22 17L32 23L26 26L28 34L20 30Z" fill="#C59B27" />
          <text x="49" y="29" fill="#00337F" fontSize="15" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.7">
            EGYPTAIR
          </text>
          <text x="49" y="42" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1.2">
            STAR ALLIANCE
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 180 54" className="h-12 w-full max-w-[180px]" role="img" aria-label={airline.name}>
          <rect x="4" y="9" width="38" height="36" rx="9" fill="#0B3B2E" />
          <text x="23" y="32" textAnchor="middle" fill="#E5C158" fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {code.slice(0, 3)}
          </text>
          <text x="50" y="28" fill="#0F172A" fontSize="13.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            {airline.name.slice(0, 14)}
          </text>
          <text x="50" y="41" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1">
            IATA PARTNER
          </text>
        </svg>
      );
  }
};
