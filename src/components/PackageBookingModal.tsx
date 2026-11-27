import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  MailCheck,
  Plane,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { QuoteSubmissionResult, useFirebase } from '../context/FirebaseContext';
import { UK_AIRPORTS } from '../data/defaultSiteData';
import { BookingRecord, TravelPackage } from '../types';

interface PackageBookingModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
  onBookingCreated: (booking: BookingRecord) => void;
}

export const PackageBookingModal: React.FC<PackageBookingModalProps> = ({
  pkg,
  onClose,
  onBookingCreated,
}) => {
  const { currentUser, createBooking, submitQuote } = useFirebase();

  const defaultDate = new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [departureDate, setDepartureDate] = useState(defaultDate);
  const [departureAirport, setDepartureAirport] = useState(
    pkg?.departureAirport || UK_AIRPORTS[0]
  );
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [reservationResult, setReservationResult] =
    useState<QuoteSubmissionResult | null>(null);
  const modalDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReservationResult(null);
    setErrorMsg('');
    if (pkg?.departureAirport) {
      setDepartureAirport(pkg.departureAirport);
    }
  }, [pkg?.id, pkg?.departureAirport]);

  const openModalDatePicker = () => {
    const input = modalDateInputRef.current;
    if (!input) return;
    input.focus();
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      }
    } catch {
      // Native overlay handles fallback
    }
  };

  if (!pkg) return null;

  const payingTravellers = adults + childrenCount;
  const totalAmountGbp = Math.round(pkg.priceGbp * payingTravellers + infants * 195);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg('Please fill in your name, email, and UK phone number.');
      return;
    }
    if (pkg.availableSlots <= 0) {
      setErrorMsg('This departure allocation is currently sold out.');
      return;
    }

    setSubmitting(true);
    try {
      if (currentUser && currentUser.emailVerified) {
        const booking = await createBooking({
          pkg,
          customerName,
          customerEmail,
          customerPhone,
          departureDate,
          departureAirport,
          adults,
          children: childrenCount,
          infants,
          payMode: 'later',
          paymentMethod: 'Mock Debit/Credit Card',
          notes,
        });
        onBookingCreated(booking);
      } else {
        const res = await submitQuote({
          departureDate,
          departureAirport,
          adults,
          children: childrenCount,
          infants,
          email: customerEmail.trim(),
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          packageReservation: {
            packageTitle: pkg.title,
            nights: pkg.nights,
            totalAmountGbp,
            notes: notes.trim() || undefined,
          },
        });
        setReservationResult(res);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Reservation could not be completed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#9A7414]">
              ATOL Protected Package · Real-Time Allocation
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              {pkg.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Package Modal"
            className="p-2 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Itinerary & Hotel Specifications */}
          <div className="lg:col-span-5 bg-[#FAFAF8] p-6 border-b lg:border-b-0 lg:border-r border-stone-200 space-y-5">
            {pkg.imageUrl && (
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-200">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-3">
              <div className="flex items-center gap-1 text-[#C59B27]">
                {Array.from({ length: pkg.starRating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-mono-num font-semibold text-[#0B3B2E]">
                {pkg.availableSlots} of {pkg.totalSlots} slots remaining
              </span>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-baseline justify-between">
              <span className="text-xs font-medium text-slate-500">Starting From</span>
              <div>
                <span className="font-mono-num text-xl font-bold text-[#0B3B2E]">
                  £{pkg.priceGbp.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1">per person</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Makkah ({pkg.makkahNights ?? Math.ceil(pkg.nights / 2)} Days)
                  </p>
                  <p>{pkg.makkahHotel}</p>
                  <p className="text-slate-500">{pkg.makkahDistance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Madinah ({pkg.madinahNights ?? Math.floor(pkg.nights / 2)} Days)
                  </p>
                  <p>{pkg.madinahHotel}</p>
                  <p className="text-slate-500">{pkg.madinahDistance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Flights &amp; Transfers</p>
                  <p>{pkg.departureAirport || 'UK Major Airports'} · Ground Transfers Included</p>
                </div>
              </div>
            </div>

            {pkg.highlights && (
              <div className="pt-3 border-t border-stone-200">
                <p className="text-xs font-semibold text-slate-900 mb-2">
                  Included in Package
                </p>
                <ul className="space-y-1.5">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3B2E] shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Direct Reservation Form */}
          <div className="lg:col-span-7 p-6">
            {reservationResult ? (
              <div className="space-y-5 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0B3B2E]/10 flex items-center justify-center shrink-0">
                    <MailCheck className="w-6 h-6 text-[#0B3B2E]" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-slate-900">
                      Reservation Request Received
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reference: <strong className="font-mono-num">{reservationResult.quoteId.toUpperCase()}</strong> · Confirmation sent to <strong>{customerEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 space-y-2.5">
                  <p className="text-xs text-slate-600">
                    <strong>Subject:</strong> {reservationResult.emailSubject}
                  </p>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed border-t border-stone-200 pt-2.5">
                    {reservationResult.emailBody}
                  </pre>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-5 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Lead Pilgrim Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name as per Passport"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+44 7700 900123"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="pilgrim@example.co.uk"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Preferred Departure Date
                    </label>
                    <input
                      ref={modalDateInputRef}
                      type="date"
                      required
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      onClick={openModalDatePicker}
                      className="date-input-full-click w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    UK Departure Airport
                  </label>
                  <select
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#0B3B2E]"
                  >
                    {UK_AIRPORTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Children
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Infants
                    </label>
                    <select
                      value={infants}
                      onChange={(e) => setInfants(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Requests (Wheelchair, Rooming, Meals)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional preferences..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-[#FAFAF8] border border-stone-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Starting From £{pkg.priceGbp.toLocaleString()} per person
                    </p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      {adults + childrenCount + infants} traveller(s) · {pkg.nights} Nights
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Estimated Total</p>
                    <p className="font-mono-num text-xl font-bold text-[#0B3B2E]">
                      £{totalAmountGbp.toLocaleString()}
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || pkg.availableSlots <= 0}
                  className="w-full py-3 px-5 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E5C158]" />
                  <span>
                    {submitting
                      ? 'Submitting Reservation...'
                      : 'Confirm Package Reservation'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
