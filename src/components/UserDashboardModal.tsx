import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LogOut,
  Plane,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { BookingRecord, BookingStatus, PaymentMethod } from '../types';

interface UserDashboardModalProps {
  open: boolean;
  onClose: () => void;
  onOpenAdminShortcut?: () => void;
}

const BOOKING_STAGES: BookingStatus[] = [
  'Inquiry Received',
  'Documents Pending',
  'Visa Processing',
  'Confirmed',
  'Completed',
];

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  open,
  onClose,
  onOpenAdminShortcut,
}) => {
  const {
    currentUser,
    isAdminUser,
    signInWithGoogle,
    signOutUser,
    userBookings,
    userPayments,
    userNotifications,
    makeMockPayment,
    toggleDocumentSubmitted,
    markNotificationRead,
    adminRouteSlug,
    siteContent,
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'notifications'>(
    'bookings'
  );
  const [payingBooking, setPayingBooking] = useState<BookingRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number>(250);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Mock Debit/Credit Card');
  const [processingPay, setProcessingPay] = useState(false);

  if (!open) return null;

  const unreadNotifs = userNotifications.filter((n) => !n.read).length;

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBooking || payAmount <= 0) return;
    setProcessingPay(true);
    try {
      await makeMockPayment(payingBooking, payAmount, payMethod);
      setPayingBooking(null);
    } finally {
      setProcessingPay(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAFAF8] border border-stone-200 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#9A7414]">
              {siteContent.contact.brandName} Pilgrim Portal
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              My Bookings, Payments & Visa Alerts
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdminUser && onOpenAdminShortcut && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminShortcut();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F3F1EC] border border-stone-300 text-xs font-semibold text-[#0B3B2E] hover:bg-stone-200 cursor-pointer"
              >
                Admin Console (#{adminRouteSlug})
              </button>
            )}
            {currentUser && (
              <button
                type="button"
                onClick={signOutUser}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-slate-600 hover:bg-stone-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Dashboard"
              className="p-2 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!currentUser ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <ShieldCheck className="w-12 h-12 text-[#0B3B2E] mx-auto mb-4" />
            <h3 className="font-display text-3xl font-semibold text-slate-900 mb-2">
              Sign in to Your Pilgrim Dashboard
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Track your Hajj or Umrah booking status in real time, manage visa documents,
              view mock payment history, and read travel alerts.
            </p>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="px-6 py-3 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white text-sm font-semibold cursor-pointer"
            >
              Continue with Google
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Account Summary + Segmented Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-500">Signed in Pilgrim</p>
                <p className="text-sm font-semibold text-slate-900">
                  {currentUser.displayName || currentUser.email}
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#F3F1EC] rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'bookings'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bookings ({userBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'payments'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Payment History ({userPayments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notifications')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Alerts & Reminders ({unreadNotifs} unread)
                </button>
              </div>
            </div>

            {/* Tab 1: Bookings & Visa Checklist */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {userBookings.length === 0 ? (
                  <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
                    <Plane className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      No Bookings Yet
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      Select any Umrah or Hajj package and click &ldquo;More Details&rdquo; to reserve your slot.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer"
                    >
                      Browse Packages
                    </button>
                  </div>
                ) : (
                  userBookings.map((bk) => {
                    const currentStageIdx = Math.max(
                      0,
                      BOOKING_STAGES.indexOf(bk.bookingStatus)
                    );
                    const remainingGbp = Math.max(0, bk.totalAmountGbp - bk.paidAmountGbp);

                    return (
                      <div
                        key={bk.id}
                        className="bg-white border border-stone-200 rounded-xl p-6 space-y-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-num mb-1">
                              <span className="font-semibold text-[#0B3B2E]">
                                {bk.bookingRef}
                              </span>
                              <span>·</span>
                              <span>Depart {bk.departureDate}</span>
                              <span>·</span>
                              <span>{bk.departureAirport}</span>
                            </div>
                            <h3 className="font-display text-2xl font-semibold text-slate-900">
                              {bk.packageTitle}
                            </h3>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              Status: <strong className="text-[#0B3B2E]">{bk.bookingStatus}</strong>
                            </p>
                            <p className="font-mono-num text-lg font-bold text-slate-900">
                              £{bk.paidAmountGbp.toLocaleString()} / £
                              {bk.totalAmountGbp.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">{bk.paymentStatus}</p>
                          </div>
                        </div>

                        {/* Status Stepper */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {BOOKING_STAGES.map((stage, idx) => {
                            const done = idx <= currentStageIdx && bk.bookingStatus !== 'Cancelled';
                            return (
                              <div
                                key={stage}
                                className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${
                                  done
                                    ? 'bg-[#0B3B2E]/8 border-[#0B3B2E]/30 text-[#0B3B2E] font-semibold'
                                    : 'bg-stone-50 border-stone-200 text-slate-400'
                                }`}
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    done ? 'text-[#0B3B2E]' : 'text-stone-300'
                                  }`}
                                />
                                <span className="truncate">{stage}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Visa Document Checklist + Mock Balance Payment */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-stone-100">
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                toggleDocumentSubmitted(bk, 'passportSubmitted')
                              }
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                                bk.passportSubmitted
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-white border-stone-300 text-slate-700 hover:bg-stone-50'
                              }`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>
                                Passport (6m+ valid):{' '}
                                {bk.passportSubmitted ? 'Submitted' : 'Mark Ready'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleDocumentSubmitted(bk, 'vaccineSubmitted')
                              }
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                                bk.vaccineSubmitted
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-white border-stone-300 text-slate-700 hover:bg-stone-50'
                              }`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>
                                ACWY Vaccine:{' '}
                                {bk.vaccineSubmitted ? 'Submitted' : 'Mark Ready'}
                              </span>
                            </button>
                          </div>

                          {remainingGbp > 0 && bk.bookingStatus !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => {
                                setPayingBooking(bk);
                                setPayAmount(remainingGbp);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#d7ac35] text-[#081A14] text-xs font-bold cursor-pointer whitespace-nowrap"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>
                                Pay Balance (£{remainingGbp.toLocaleString()} Mock)
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Mock Payment Inline Modal */}
                {payingBooking && (
                  <form
                    onSubmit={handlePaySubmit}
                    className="bg-white border-2 border-[#0B3B2E] rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">
                        Record Mock Payment for {payingBooking.bookingRef}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setPayingBooking(null)}
                        className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Amount (£ GBP)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={payingBooking.totalAmountGbp - payingBooking.paidAmountGbp}
                          value={payAmount}
                          onChange={(e) => setPayAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Mock Payment Method
                        </label>
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                        >
                          <option value="Mock Debit/Credit Card">
                            Mock Debit/Credit Card
                          </option>
                          <option value="UK Bank Transfer (FPS)">
                            UK Bank Transfer (FPS)
                          </option>
                          <option value="0% Installment Plan">0% Installment Plan</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={processingPay}
                      className="px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer"
                    >
                      {processingPay ? 'Recording Payment...' : 'Submit Mock Payment'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Tab 2: Payment History */}
            {activeTab === 'payments' && (
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                {userPayments.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-500">
                    No mock payment transactions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#FAFAF8] border-b border-stone-200 text-xs text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Reference</th>
                          <th className="px-5 py-3 font-semibold">Method</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {userPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50/70">
                            <td className="px-5 py-3.5 font-mono-num text-xs font-semibold text-slate-900">
                              {p.referenceCode}
                            </td>
                            <td className="px-5 py-3.5 text-slate-700">{p.method}</td>
                            <td className="px-5 py-3.5 text-xs font-medium text-emerald-700">
                              {p.status}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono-num font-semibold text-slate-900">
                              £{p.amountGbp.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Automated Travel Updates & Visa Document Reminders */}
            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {userNotifications.length === 0 ? (
                  <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-sm text-slate-500">
                    No travel updates or visa document reminders yet.
                  </div>
                ) : (
                  userNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`border rounded-xl p-5 flex items-start justify-between gap-4 ${
                        n.read
                          ? 'bg-white border-stone-200'
                          : 'bg-[#F3F1EC] border-[#C59B27]/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Bell
                          className={`w-5 h-5 mt-0.5 shrink-0 ${
                            n.read ? 'text-slate-400' : 'text-[#0B3B2E]'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span className="capitalize font-medium text-[#9A7414]">
                              {n.type.replace('_', ' ')}
                            </span>
                            {!n.read && (
                              <>
                                <span>·</span>
                                <span className="font-semibold text-[#0B3B2E]">Unread</span>
                              </>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">
                            {n.title}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      </div>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markNotificationRead(n.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-medium text-slate-700 hover:bg-stone-50 shrink-0 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
