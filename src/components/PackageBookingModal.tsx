import React, { useRef, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Plane,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { UK_AIRPORTS } from '../data/defaultSiteData';
import { BookingRecord, PaymentMethod, TravelPackage } from '../types';

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
  const { currentUser, signInWithGoogle, createBooking } = useFirebase();

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
  const [payMode, setPayMode] = useState<'deposit' | 'full' | 'later'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Mock Debit/Credit Card'
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const modalDateInputRef = useRef<HTMLInputElement>(null);

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
  const depositAmountGbp = Math.min(totalAmountGbp, 250 * Math.max(1, adults));
  const dueNowGbp =
    payMode === 'full' ? totalAmountGbp : payMode === 'deposit' ? depositAmountGbp : 0;

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSigningIn(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        if (!customerName && user.displayName) setCustomerName(user.displayName);
        if (!customerEmail && user.email) setCustomerEmail(user.email);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Google Sign-In failed.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!currentUser) {
      setErrorMsg('Please sign in with Google first to lock your real-time slot.');
      return;
    }
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
        payMode,
        paymentMethod,
        notes,
      });
      onBookingCreated(booking);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Booking could not be completed.'
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

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Makkah ({pkg.makkahNights || Math.ceil(pkg.nights / 2)} Nights)
                  </p>
                  <p>{pkg.makkahHotel}</p>
                  <p className="text-slate-500">{pkg.makkahDistance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Madinah ({pkg.madinahNights || Math.floor(pkg.nights / 2)} Nights)
                  </p>
                  <p>{pkg.madinahHotel}</p>
                  <p className="text-slate-500">{pkg.madinahDistance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Flights & Transfers</p>
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

          {/* Right: Secure Booking & Mock Payment Options */}
          <div className="lg:col-span-7 p-6">
            {!currentUser && (
              <div className="mb-5 p-4 rounded-xl bg-[#F3F1EC] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Sign in to Reserve & Track Your Booking
                  </p>
                  <p className="text-xs text-slate-600">
                    Required to access your Pilgrim Dashboard, payment ledger & visa notifications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                  className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] whitespace-nowrap cursor-pointer shrink-0"
                >
                  {signingIn ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </div>
            )}

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

              {/* Mock Payment Options */}
              <div className="pt-3 border-t border-stone-200">
                <p className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#0B3B2E]" />
                  <span>Mock Payment Option (No Live Card Charge)</span>
                </p>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(
                    [
                      { id: 'deposit', label: `Deposit (£${depositAmountGbp})` },
                      { id: 'full', label: `Full (£${totalAmountGbp.toLocaleString()})` },
                      { id: 'later', label: 'Reserve & Pay Later' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayMode(opt.id)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        payMode === opt.id
                          ? 'bg-[#0B3B2E] text-white border-[#0B3B2E]'
                          : 'bg-white text-slate-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {payMode !== 'later' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        'Mock Debit/Credit Card',
                        'UK Bank Transfer (FPS)',
                        '0% Installment Plan',
                      ] as PaymentMethod[]
                    ).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                          paymentMethod === m
                            ? 'bg-[#F3F1EC] border-[#0B3B2E] text-[#0B3B2E] font-semibold'
                            : 'bg-white border-stone-200 text-slate-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
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
                    Total Package Price ({adults + childrenCount + infants} travellers)
                  </p>
                  <p className="font-mono-num text-xl font-bold text-slate-900">
                    £{totalAmountGbp.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Mock Amount Due Now</p>
                  <p className="font-mono-num text-xl font-bold text-[#0B3B2E]">
                    £{dueNowGbp.toLocaleString()}
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
                <Lock className="w-4 h-4 text-[#E5C158]" />
                <span>
                  {submitting
                    ? 'Confirming Reservation...'
                    : 'Confirm Booking & Lock Slot'}
                </span>
              </button>
              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B3B2E]" />
                <span>Simulated mock checkout — zero real payment charged.</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
