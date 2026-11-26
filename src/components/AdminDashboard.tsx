import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarCheck,
  Check,
  FileText,
  Globe,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  Lock,
  Menu as MenuIcon,
  MessageSquareQuote,
  Package as PackageIcon,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Video,
} from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import {
  IMG_HERO_MAKKAH,
  IMG_MADINAH_NABAWI,
  IMG_MAKKAH_HOTEL,
  IMG_PILGRIM_STORY,
  IMG_RAMADAN_HARAM,
} from '../data/defaultSiteData';
import {
  AppNotification,
  BookingRecord,
  BookingStatus,
  BrandingContent,
  CmsPage,
  NavActionType,
  NavItem,
  PackageCategory,
  QuoteRecord,
  SiteCmsData,
  TravelPackage,
} from '../types';

import { AdminVideoManager } from './AdminVideoManager';
import { AirlineLogo } from './AirlineLogo';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onSlugChanged: (newSlug: string) => void;
}

type AdminTab =
  | 'overview'
  | 'quotes'
  | 'bookings'
  | 'packages'
  | 'videos'
  | 'pages'
  | 'menus'
  | 'sections'
  | 'branding'
  | 'security';

const PACKAGE_CATEGORIES: { value: PackageCategory; label: string }[] = [
  { value: '3-star-umrah', label: '3 Star Umrah' },
  { value: '4-star-umrah', label: '4 Star Umrah' },
  { value: '5-star-umrah', label: '5 Star Umrah' },
  { value: 'ramadan-umrah', label: 'Ramadan Umrah' },
  { value: 'premium-offer', label: 'Limited Time / Premium Offer' },
  { value: '3-star-hajj', label: '3 Star Hajj' },
  { value: '5-star-hajj', label: '5 Star Hajj' },
  { value: 'umrah-2027', label: 'Umrah Packages 2027' },
  { value: 'london-umrah', label: 'London Umrah' },
];

const IMAGE_PRESETS = [
  { label: 'Makkah Clock Tower Suite', url: IMG_MAKKAH_HOTEL },
  { label: 'Madinah Green Dome', url: IMG_MADINAH_NABAWI },
  { label: 'Ramadan Haram Courtyard', url: IMG_RAMADAN_HARAM },
  { label: 'Masjid al-Haram Panorama', url: IMG_HERO_MAKKAH },
  { label: 'Pilgrim Family Portrait', url: IMG_PILGRIM_STORY },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onSlugChanged,
}) => {
  const {
    currentUser,
    isAdminUser,
    signInWithGoogle,
    signOutUser,
    packages,
    siteContent,
    navigation,
    adminRouteSlug,
    adminQuotes,
    adminBookings,
    adminNotifications,
    adminSettings,
    savePackage,
    deletePackage,
    saveSiteSection,
    saveNavigationConfig,
    updateQuoteStatus,
    updateBookingStatusAndNotify,
    sendAutomatedCustomerReminder,
    markAdminNotifRead,
    verifyAdminSecondaryLogin,
    updateAdminCredentials,
    updateGlobalBrandAndDomain,
    seedDefaultsNow,
  } = useFirebase();

  const [unlockedSecondary, setUnlockedSecondary] = useState(true);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [statusBanner, setStatusBanner] = useState('');

  // Package editor state
  const [editingPkg, setEditingPkg] = useState<TravelPackage | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);
  const [reminderTarget, setReminderTarget] = useState<BookingRecord | null>(null);
  const [reminderTitle, setReminderTitle] = useState('Visa Document Reminder');
  const [reminderMsg, setReminderMsg] = useState(
    'Please ensure your 6-month valid passport copy and ACWY certificate are confirmed so our team can submit your Saudi visa.'
  );
  const [reminderType, setReminderType] =
    useState<AppNotification['type']>('visa_reminder');

  // Pages CMS state
  const [pagesDraft, setPagesDraft] = useState<CmsPage[]>(siteContent.pages.items);
  const [editingPageSlug, setEditingPageSlug] = useState<string>(
    siteContent.pages.items[0]?.slug || 'about-us'
  );
  const [pageSearch, setPageSearch] = useState('');

  // Branding & Global Site Name / Domain state
  const [brandingDraft, setBrandingDraft] = useState<BrandingContent>(
    siteContent.branding
  );
  const [globalBrandInput, setGlobalBrandInput] = useState<string>(
    siteContent.contact.brandName
  );
  const [globalDomainInput, setGlobalDomainInput] = useState<string>(
    siteContent.contact.domainName || 'hidayahtravels.co.uk'
  );
  const [syncEmailAndSocials, setSyncEmailAndSocials] = useState<boolean>(true);
  const [applyingBrand, setApplyingBrand] = useState<boolean>(false);

  // Video testimonials draft state
  const [videoDraft, setVideoDraft] = useState<SiteCmsData['videoSection']>(
    siteContent.videoSection
  );

  // CMS Sections state
  const [cmsSectionKey, setCmsSectionKey] = useState<keyof SiteCmsData>('hero');
  const [cmsDraft, setCmsDraft] = useState<SiteCmsData>(siteContent);

  // Menus draft state
  const [navDraft, setNavDraft] = useState<NavItem[]>(navigation.items);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState<number>(0);

  // Admin security settings state
  const [newUsername, setNewUsername] = useState(adminSettings?.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [newSlug, setNewSlug] = useState(adminRouteSlug || 'admin');
  const [googleAuthError, setGoogleAuthError] = useState('');

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 4000);
  };

  // Auth Gate
  if (!currentUser || !isAdminUser) {
    return (
      <div className="min-h-screen bg-[#0B1320] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B3B2E]">
              <Lock className="w-4 h-4 text-[#C59B27]" />
              <span>{siteContent.contact.brandName} Admin Portal</span>
            </span>
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Back to Website
            </button>
          </div>

          <h1 className="font-display text-3xl font-semibold text-slate-900 mb-2">
            Owner Authentication
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Sign in with your verified Google Owner account to manage packages, pages,
            logo, favicon, social links, menus, and security settings.
          </p>

          {currentUser && !isAdminUser && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              Signed in as <strong>{currentUser.email}</strong>, which does not have
              owner admin access. Please sign out and sign in with the authorized owner
              email.
            </div>
          )}

          {googleAuthError && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              {googleAuthError}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                setGoogleAuthError('');
                try {
                  await signInWithGoogle();
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  if (msg.includes('auth/unauthorized-domain')) {
                    setGoogleAuthError(
                      `Domain "${window.location.hostname}" is not yet authorized in Firebase Auth. Add "${window.location.hostname}" under Firebase Console → Authentication → Settings → Authorized domains.`
                    );
                  } else if (msg.includes('auth/popup-blocked')) {
                    setGoogleAuthError(
                      'Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.'
                    );
                  } else {
                    setGoogleAuthError(`Google Sign-In failed: ${msg}`);
                  }
                }
              }}
              className="w-full py-3 px-4 rounded-lg bg-[#0B3B2E] hover:bg-[#082A21] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Sign in with Google Owner Account
            </button>
            {currentUser && (
              <button
                type="button"
                onClick={signOutUser}
                className="w-full py-2.5 px-4 rounded-lg border border-stone-300 text-slate-700 text-xs font-medium hover:bg-stone-50 cursor-pointer"
              >
                Sign Out ({currentUser.email})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Secondary Username/Password Lock Gate
  if (!unlockedSecondary) {
    return (
      <div className="min-h-screen bg-[#0B1320] flex items-center justify-center p-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoginError('');
            const ok = await verifyAdminSecondaryLogin(loginUsername, loginPassword);
            if (ok) setUnlockedSecondary(true);
            else setLoginError('Invalid admin username or password.');
          }}
          className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-8 space-y-4"
        >
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Unlock Admin Console
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>
          {loginError && <p className="text-xs text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#0B3B2E] text-white text-sm font-semibold cursor-pointer"
          >
            Unlock Console
          </button>
          <button
            type="button"
            onClick={() => setUnlockedSecondary(true)}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Verify via Google Owner Session
          </button>
        </form>
      </div>
    );
  }

  const unreadAdminAlerts = adminNotifications.filter((n) => !n.read).length;
  const totalRevenueGbp = adminBookings.reduce((sum, b) => sum + b.paidAmountGbp, 0);
  const openSlots = packages.reduce((sum, p) => sum + (p.availableSlots || 0), 0);

  const openNewPackage = () => {
    setEditingPkg({
      id: `pkg-${Date.now()}`,
      title: '10 Nights Bespoke Umrah Package',
      category: '4-star-umrah',
      starRating: 4,
      nights: 10,
      makkahNights: 5,
      madinahNights: 5,
      makkahHotel: 'DoubleTree by Hilton Jabal Omar',
      makkahDistance: '180m to Masjid al-Haram',
      madinahHotel: 'Pullman Zamzam Madinah',
      madinahDistance: '150m to Al-Masjid an-Nabawi',
      priceGbp: 995,
      departureAirport: 'London Heathrow (LHR)',
      monthTag: 'November',
      cityTag: 'London',
      imageUrl: IMG_MAKKAH_HOTEL,
      highlights: ['Return Flights Included', 'Umrah Visa Processing', 'Ground Transfers'],
      totalSlots: 20,
      availableSlots: 20,
      bookedSlots: 0,
      active: true,
      displayOrder: packages.length + 1,
    });
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'faviconUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 250 * 1024) {
      showToast('Please choose an image under 250KB for fast loading.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBrandingDraft((prev) => ({ ...prev, [field]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const activePageIdx = pagesDraft.findIndex((p) => p.slug === editingPageSlug);
  const activePageObj = activePageIdx >= 0 ? pagesDraft[activePageIdx] : pagesDraft[0];

  const updateActivePage = (patch: Partial<CmsPage>) => {
    if (activePageIdx < 0) return;
    const copy = [...pagesDraft];
    copy[activePageIdx] = { ...copy[activePageIdx], ...patch };
    setPagesDraft(copy);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-68 bg-[#081A14] text-stone-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-white/10">
            <p className="text-xs font-semibold text-[#E5C158] tracking-wide mb-1">
              #{adminRouteSlug} · Control Center
            </p>
            <h1 className="font-display text-2xl font-bold text-white">
              {siteContent.contact.brandName} CMS
            </h1>
            <p className="text-[11px] text-stone-400 mt-0.5 truncate">
              {siteContent.contact.domainName}
            </p>
          </div>

          <nav className="p-3 space-y-1">
            {(
              [
                { id: 'overview', label: 'Overview & Alerts', icon: LayoutDashboard, badge: unreadAdminAlerts },
                { id: 'quotes', label: 'Quote Inquiries', icon: MessageSquareQuote, badge: adminQuotes.filter((q) => q.status === 'New').length },
                { id: 'bookings', label: 'Bookings & Visa Desk', icon: CalendarCheck, badge: adminBookings.length },
                { id: 'packages', label: 'Packages Manager', icon: PackageIcon },
                { id: 'videos', label: 'Video Testimonials', icon: Video },
                { id: 'pages', label: 'Pages CMS (All Pages)', icon: Globe },
                { id: 'menus', label: 'Menus & Sub-Navs', icon: MenuIcon },
                { id: 'sections', label: 'Home Sections CMS', icon: FileText },
                { id: 'branding', label: 'Site Name, Domain & Logo', icon: ImageIcon },
                { id: 'security', label: 'Admin Security & Link', icon: KeyRound },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'sections') setCmsDraft(siteContent);
                    if (tab.id === 'videos') setVideoDraft(siteContent.videoSection);
                    if (tab.id === 'menus') setNavDraft(navigation.items);
                    if (tab.id === 'pages') {
                      setPagesDraft(siteContent.pages.items);
                      if (
                        !siteContent.pages.items.some((p) => p.slug === editingPageSlug) &&
                        siteContent.pages.items[0]
                      ) {
                        setEditingPageSlug(siteContent.pages.items[0].slug);
                      }
                    }
                    if (tab.id === 'branding') {
                      setBrandingDraft(siteContent.branding);
                      setGlobalBrandInput(siteContent.contact.brandName);
                      setGlobalDomainInput(siteContent.contact.domainName || 'hidayahtravels.co.uk');
                    }
                    if (tab.id === 'security') {
                      setNewUsername(adminSettings?.username || 'admin');
                      setNewSlug(adminRouteSlug);
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-left text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0B3B2E] text-white border border-[#C59B27]/50'
                      : 'text-stone-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 text-[#E5C158] shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </span>
                  {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                    <span className="font-mono-num text-xs font-bold text-[#E5C158]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={async () => {
              await seedDefaultsNow();
              showToast('Default packages, pages, menus & branding synced to Firestore.');
            }}
            className="w-full px-3 py-2 rounded-lg bg-white/8 hover:bg-white/15 text-xs font-medium text-stone-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Defaults to DB</span>
          </button>
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full px-3 py-2 rounded-lg bg-[#C59B27] hover:bg-[#d7ac35] text-[#081A14] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Top Breadcrumb + Toast */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <p className="text-xs text-slate-500">
              Admin / <span className="capitalize">{activeTab}</span>
            </p>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {activeTab === 'overview' && 'Operations Overview & Real-Time Alerts'}
              {activeTab === 'quotes' && 'Hero Quote Form Inquiries'}
              {activeTab === 'bookings' && 'Customer Bookings & Automated Reminders'}
              {activeTab === 'packages' && 'Hajj & Umrah Packages Manager'}
              {activeTab === 'videos' && 'Customer Video Testimonials (YouTube, URLs & Upload)'}
              {activeTab === 'pages' && 'Dedicated Pages CMS (Navigation & Legal Pages)'}
              {activeTab === 'menus' && 'Header Navigation & Sub-Menus Editor'}
              {activeTab === 'sections' && 'Homepage Sections & Content Editor'}
              {activeTab === 'branding' && 'Website Name, Domain, Logo & Social Links'}
              {activeTab === 'security' && 'Admin Credentials & Custom Portal URL'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {statusBanner && (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                {statusBanner}
              </span>
            )}
            <button
              type="button"
              onClick={() => setUnlockedSecondary(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-slate-700 hover:bg-stone-50 cursor-pointer"
            >
              Lock Screen
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-1">Quote Inquiries</p>
                <p className="font-mono-num text-3xl font-bold text-slate-900">
                  {adminQuotes.length}
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-1">Total Bookings</p>
                <p className="font-mono-num text-3xl font-bold text-[#0B3B2E]">
                  {adminBookings.length}
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-1">Mock Payments Recorded</p>
                <p className="font-mono-num text-3xl font-bold text-slate-900">
                  £{totalRevenueGbp.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-1">CMS Pages Live</p>
                <p className="font-mono-num text-3xl font-bold text-[#9A7414]">
                  {siteContent.pages.items.length} ({openSlots} slots)
                </p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0B3B2E]" />
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Real-Time Admin Notifications ({unreadAdminAlerts} unread)
                  </h3>
                </div>
              </div>
              {adminNotifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No real-time alerts yet. Submit a quote or booking on the site to see instant notifications appear here.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {adminNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-6 py-4 flex items-center justify-between gap-4 ${
                        n.read ? 'bg-white' : 'bg-[#F3F1EC]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#9A7414] uppercase">
                          {n.category}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600">{n.message}</p>
                      </div>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markAdminNotifRead(n.id)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-medium hover:bg-stone-50 cursor-pointer shrink-0"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. QUOTES */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAF8] border-b border-stone-200 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Pilgrim</th>
                    <th className="px-4 py-3 font-semibold">Airport &amp; Date</th>
                    <th className="px-4 py-3 font-semibold">Party</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Email Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {adminQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No quote inquiries submitted yet.
                      </td>
                    </tr>
                  ) : (
                    adminQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-stone-50/70">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-900">{q.fullName}</p>
                          <p className="text-xs text-slate-500">
                            {q.email} · {q.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-700">
                          <p>{q.departureAirport}</p>
                          <p className="font-mono-num text-slate-500">{q.departureDate}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono-num text-xs text-slate-700">
                          {q.adults}A / {q.children}C / {q.infants}I
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={q.status}
                            onChange={(e) =>
                              updateQuoteStatus(
                                q.id,
                                e.target.value as QuoteRecord['status']
                              )
                            }
                            className="px-2.5 py-1 rounded border border-stone-300 text-xs bg-white"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedQuote(q)}
                            className="px-3 py-1 rounded-lg border border-stone-300 text-xs font-medium hover:bg-stone-50 cursor-pointer"
                          >
                            View Email Sent
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedQuote && (
              <div className="bg-white border border-[#0B3B2E] rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Auto-Email Template Sent to {selectedQuote.email}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSelectedQuote(null)}
                    className="text-xs text-slate-500 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Subject:</strong> {selectedQuote.emailTemplateSubject}
                </p>
                <pre className="whitespace-pre-wrap text-xs text-slate-700 bg-[#FAFAF8] p-4 rounded-lg border border-stone-200 font-sans">
                  {selectedQuote.emailTemplateBody}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 3. BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAF8] border-b border-stone-200 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ref &amp; Pilgrim</th>
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 font-semibold">Docs</th>
                    <th className="px-4 py-3 font-semibold">Paid / Total</th>
                    <th className="px-4 py-3 font-semibold">Booking Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Notify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {adminBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No customer bookings recorded yet.
                      </td>
                    </tr>
                  ) : (
                    adminBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-stone-50/70">
                        <td className="px-4 py-3.5">
                          <p className="font-mono-num text-xs font-bold text-[#0B3B2E]">
                            {bk.bookingRef}
                          </p>
                          <p className="font-semibold text-slate-900">
                            {bk.customerName}
                          </p>
                          <p className="text-xs text-slate-500">{bk.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-700">
                          <p className="font-medium">{bk.packageTitle}</p>
                          <p className="text-slate-500">
                            {bk.departureDate} · {bk.departureAirport}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <p>Passport: {bk.passportSubmitted ? 'Ready' : 'Pending'}</p>
                          <p>Vaccine: {bk.vaccineSubmitted ? 'Ready' : 'Pending'}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono-num text-xs font-semibold">
                          £{bk.paidAmountGbp.toLocaleString()} / £
                          {bk.totalAmountGbp.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={bk.bookingStatus}
                            onChange={async (e) => {
                              const next = e.target.value as BookingStatus;
                              await updateBookingStatusAndNotify(
                                bk,
                                next,
                                `Booking ${bk.bookingRef} Updated: ${next}`,
                                `Your pilgrimage booking status is now "${next}".`,
                                'booking_status'
                              );
                              showToast(`Updated ${bk.bookingRef} to ${next} and notified customer.`);
                            }}
                            className="px-2.5 py-1 rounded border border-stone-300 text-xs bg-white"
                          >
                            <option value="Inquiry Received">Inquiry Received</option>
                            <option value="Documents Pending">Documents Pending</option>
                            <option value="Visa Processing">Visa Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setReminderTarget(bk)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-medium cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Reminder</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {reminderTarget && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await sendAutomatedCustomerReminder(
                    reminderTarget,
                    reminderTitle,
                    reminderMsg,
                    reminderType
                  );
                  setReminderTarget(null);
                  showToast(`Automated reminder pushed to ${reminderTarget.customerName}.`);
                }}
                className="bg-white border border-[#0B3B2E] rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    Send Travel Update / Visa Reminder to {reminderTarget.customerName} (
                    {reminderTarget.bookingRef})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setReminderTarget(null)}
                    className="text-xs text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Alert Type
                    </label>
                    <select
                      value={reminderType}
                      onChange={(e) =>
                        setReminderType(e.target.value as AppNotification['type'])
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      <option value="visa_reminder">Visa Document Reminder</option>
                      <option value="travel_update">Travel / Flight Update</option>
                      <option value="booking_status">Booking Status Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Notification Title
                    </label>
                    <input
                      type="text"
                      required
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reminderMsg}
                    onChange={(e) => setReminderMsg(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer"
                >
                  Dispatch Customer Notification
                </button>
              </form>
            )}
          </div>
        )}

        {/* 4. PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openNewPackage}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Package</span>
              </button>
            </div>

            {editingPkg && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await savePackage(editingPkg);
                  setEditingPkg(null);
                  showToast('Package saved and published live.');
                }}
                className="bg-white border-2 border-[#0B3B2E] rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-semibold text-slate-900">
                    Package Editor ({editingPkg.id})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="text-xs text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Package Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPkg.title}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Category Section
                    </label>
                    <select
                      value={editingPkg.category}
                      onChange={(e) =>
                        setEditingPkg({
                          ...editingPkg,
                          category: e.target.value as PackageCategory,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      {PACKAGE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Makkah Hotel &amp; Distance
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Hotel name"
                        value={editingPkg.makkahHotel}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, makkahHotel: e.target.value })
                        }
                        className="px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="e.g. 150m to Haram"
                        value={editingPkg.makkahDistance || ''}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, makkahDistance: e.target.value })
                        }
                        className="px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Madinah Hotel &amp; Distance
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Hotel name"
                        value={editingPkg.madinahHotel}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, madinahHotel: e.target.value })
                        }
                        className="px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="e.g. 100m to Nabawi"
                        value={editingPkg.madinahDistance || ''}
                        onChange={(e) =>
                          setEditingPkg({
                            ...editingPkg,
                            madinahDistance: e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Price (£ GBP)
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={editingPkg.priceGbp}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, priceGbp: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Stars (1–5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editingPkg.starRating}
                      onChange={(e) =>
                        setEditingPkg({
                          ...editingPkg,
                          starRating: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Total Nights
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={editingPkg.nights}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, nights: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Total Slots
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingPkg.totalSlots}
                      onChange={(e) =>
                        setEditingPkg({
                          ...editingPkg,
                          totalSlots: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Available Slots
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingPkg.availableSlots}
                      onChange={(e) =>
                        setEditingPkg({
                          ...editingPkg,
                          availableSlots: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono-num"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Month Tag
                    </label>
                    <input
                      type="text"
                      value={editingPkg.monthTag || ''}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, monthTag: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      UK City / Departure Airport
                    </label>
                    <input
                      type="text"
                      value={editingPkg.departureAirport || ''}
                      onChange={(e) =>
                        setEditingPkg({
                          ...editingPkg,
                          departureAirport: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Package Image Preset
                    </label>
                    <select
                      value={editingPkg.imageUrl || IMG_MAKKAH_HOTEL}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    >
                      {IMAGE_PRESETS.map((img) => (
                        <option key={img.url} value={img.url}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Highlights (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingPkg.highlights || []).join(', ')}
                    onChange={(e) =>
                      setEditingPkg({
                        ...editingPkg,
                        highlights: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .slice(0, 8),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingPkg.active}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, active: e.target.checked })
                      }
                    />
                    <span>Package Active &amp; Visible on Site</span>
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Package</span>
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAF8] border-b border-stone-200 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Live Slots</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {packages.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{p.title}</p>
                        <p className="text-xs text-slate-500">
                          {p.makkahHotel} · {p.madinahHotel}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 font-mono-num font-semibold text-[#0B3B2E]">
                        £{p.priceGbp.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono-num text-xs">
                        {p.availableSlots} / {p.totalSlots}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingPkg(p)}
                          className="px-3 py-1 rounded border border-stone-300 text-xs font-medium hover:bg-stone-50 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deletePackage(p.id);
                            showToast(`Deleted package ${p.title}`);
                          }}
                          className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer align-middle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4B. CUSTOMER VIDEO TESTIMONIALS TAB */}
        {activeTab === 'videos' && (
          <AdminVideoManager
            draft={videoDraft}
            onChange={setVideoDraft}
            onSave={async () => {
              await saveSiteSection('videoSection', videoDraft);
              showToast('Customer Video Testimonials published live to Firestore!');
            }}
            onToast={showToast}
          />
        )}

        {/* 5. PAGES CMS (ALL NAVIGATION, GUIDE, SERVICE, CITY, MONTH & LEGAL PAGES) */}
        {activeTab === 'pages' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Manage Every Website Page ({pagesDraft.length} Pages)
                </h3>
                <p className="text-xs text-slate-500">
                  Edit content, highlights, hero image, and package listings for every navigation page and footer legal page.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newSlugId = `custom-page-${Date.now().toString().slice(-4)}`;
                    const created: CmsPage = {
                      slug: newSlugId,
                      group: 'company',
                      eyebrow: `${siteContent.contact.brandName} UK`,
                      title: 'New Custom Page',
                      subtitle: 'Subtitle describing this page.',
                      heroImage: IMG_HERO_MAKKAH,
                      intro: 'Introductory content for your custom page...',
                      highlights: ['ATOL 11842 Protected', '24/7 UK Support'],
                      sections: [
                        {
                          heading: 'Section One',
                          content: 'Detailed information goes here...',
                        },
                      ],
                    };
                    setPagesDraft([created, ...pagesDraft]);
                    setEditingPageSlug(newSlugId);
                  }}
                  className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  + Add New Page
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await saveSiteSection('pages', { items: pagesDraft });
                    showToast('All CMS pages saved live to Firestore!');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish All Pages</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Page Selector Sidebar */}
              <div className="lg:col-span-4 space-y-3">
                <input
                  type="text"
                  placeholder="Search pages (e.g. Hajj, Privacy, Birmingham)..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                />
                <div className="max-h-[540px] overflow-y-auto space-y-1.5 pr-1">
                  {pagesDraft
                    .filter(
                      (p) =>
                        p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
                        p.slug.toLowerCase().includes(pageSearch.toLowerCase()) ||
                        p.group.toLowerCase().includes(pageSearch.toLowerCase())
                    )
                    .map((p) => (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => setEditingPageSlug(p.slug)}
                        className={`w-full px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                          editingPageSlug === p.slug
                            ? 'bg-[#0B3B2E] text-white border-[#0B3B2E]'
                            : 'bg-[#FAFAF8] text-slate-800 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <p className="text-xs font-semibold truncate">{p.title}</p>
                        <p
                          className={`text-[11px] font-mono truncate ${
                            editingPageSlug === p.slug ? 'text-[#E5C158]' : 'text-slate-500'
                          }`}
                        >
                          {p.group} · #{p.slug}
                        </p>
                      </button>
                    ))}
                </div>
              </div>

              {/* Active Page Editor */}
              {activePageObj && (
                <div className="lg:col-span-8 bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <p className="text-xs font-mono text-slate-500">
                        Slug: #page/{activePageObj.slug}
                      </p>
                      <h4 className="font-semibold text-slate-900">
                        Editing: {activePageObj.title}
                      </h4>
                    </div>
                    {pagesDraft.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const remaining = pagesDraft.filter(
                            (p) => p.slug !== activePageObj.slug
                          );
                          setPagesDraft(remaining);
                          setEditingPageSlug(remaining[0]?.slug || '');
                        }}
                        className="text-xs text-red-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Page</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={activePageObj.title}
                        onChange={(e) => updateActivePage({ title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Page URL Slug
                      </label>
                      <input
                        type="text"
                        value={activePageObj.slug}
                        onChange={(e) => {
                          const s = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
                          updateActivePage({ slug: s });
                          setEditingPageSlug(s);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Eyebrow Kicker
                      </label>
                      <input
                        type="text"
                        value={activePageObj.eyebrow}
                        onChange={(e) => updateActivePage({ eyebrow: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Hero Banner Image
                      </label>
                      <select
                        value={activePageObj.heroImage}
                        onChange={(e) => updateActivePage({ heroImage: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                      >
                        {IMAGE_PRESETS.map((img) => (
                          <option key={img.url} value={img.url}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={activePageObj.subtitle}
                      onChange={(e) => updateActivePage({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Introduction Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={activePageObj.intro}
                      onChange={(e) => updateActivePage({ intro: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Key Highlights (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={activePageObj.highlights.join('\n')}
                      onChange={(e) =>
                        updateActivePage({
                          highlights: e.target.value
                            .split('\n')
                            .map((l) => l.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">
                        Detailed Content Sections
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateActivePage({
                            sections: [
                              ...activePageObj.sections,
                              { heading: 'New Section Heading', content: 'Content...' },
                            ],
                          })
                        }
                        className="px-2.5 py-1 rounded bg-white border border-stone-300 text-xs font-medium cursor-pointer"
                      >
                        + Add Section
                      </button>
                    </div>
                    {activePageObj.sections.map((sec, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white border border-stone-200 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const secs = [...activePageObj.sections];
                              secs[sIdx] = { ...secs[sIdx], heading: e.target.value };
                              updateActivePage({ sections: secs });
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded border border-stone-200 text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const secs = activePageObj.sections.filter(
                                (_, idx) => idx !== sIdx
                              );
                              updateActivePage({ sections: secs });
                            }}
                            className="text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={sec.content}
                          onChange={(e) => {
                            const secs = [...activePageObj.sections];
                            secs[sIdx] = { ...secs[sIdx], content: e.target.value };
                            updateActivePage({ sections: secs });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-stone-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(activePageObj.showContactForm)}
                        onChange={(e) =>
                          updateActivePage({ showContactForm: e.target.checked })
                        }
                      />
                      <span>Show Direct Inquiry Quote Form on This Page</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. MENUS */}
        {activeTab === 'menus' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Manage Top-Level Menus &amp; Sub-Navigation Links
                </h3>
                <p className="text-xs text-slate-500">
                  Link any menu or nested sub-menu to a CMS Page slug (e.g. &ldquo;about-us&rdquo;, &ldquo;3-star-hajj&rdquo;).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setNavDraft([
                      ...navDraft,
                      {
                        id: `nav-${Date.now()}`,
                        label: 'New Menu Item',
                        actionType: 'page',
                        target: 'about-us',
                        children: [],
                      },
                    ])
                  }
                  className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  + Add Top Menu
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await saveNavigationConfig({
                      items: navDraft,
                      adminRouteSlug,
                    });
                    showToast('Navigation menus updated live!');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Menus</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-2">
                {navDraft.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-2 cursor-pointer ${
                      selectedMenuIdx === idx
                        ? 'bg-[#F3F1EC] border-[#0B3B2E]'
                        : 'bg-white border-stone-200'
                    }`}
                    onClick={() => setSelectedMenuIdx(idx)}
                  >
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const copy = [...navDraft];
                        copy[idx] = { ...copy[idx], label: e.target.value };
                        setNavDraft(copy);
                      }}
                      className="text-sm font-semibold text-slate-900 bg-transparent border-b border-transparent focus:border-[#0B3B2E] focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavDraft(navDraft.filter((_, i) => i !== idx));
                        setSelectedMenuIdx(0);
                      }}
                      className="text-red-600 p-1 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 bg-[#FAFAF8] border border-stone-200 rounded-xl p-5 space-y-4">
                {navDraft[selectedMenuIdx] && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900">
                        Sub-Navigation for &ldquo;{navDraft[selectedMenuIdx].label}&rdquo;
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...navDraft];
                          const curr = copy[selectedMenuIdx];
                          copy[selectedMenuIdx] = {
                            ...curr,
                            children: [
                              ...(curr.children || []),
                              {
                                id: `sub-${Date.now()}`,
                                label: 'New Sub-Link',
                                actionType: 'page',
                                target: 'umrah-packages',
                              },
                            ],
                          };
                          setNavDraft(copy);
                        }}
                        className="px-3 py-1.5 rounded bg-white border border-stone-300 text-xs font-semibold cursor-pointer"
                      >
                        + Add Sub-Item
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(navDraft[selectedMenuIdx].children || []).map((sub, sIdx) => (
                        <div
                          key={sub.id}
                          className="bg-white border border-stone-200 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={sub.label}
                              onChange={(e) => {
                                const copy = [...navDraft];
                                const subs = [...(copy[selectedMenuIdx].children || [])];
                                subs[sIdx] = { ...subs[sIdx], label: e.target.value };
                                copy[selectedMenuIdx] = {
                                  ...copy[selectedMenuIdx],
                                  children: subs,
                                };
                                setNavDraft(copy);
                              }}
                              className="flex-1 px-2.5 py-1.5 rounded border border-stone-200 text-xs font-medium"
                            />
                            <select
                              value={sub.actionType}
                              onChange={(e) => {
                                const copy = [...navDraft];
                                const subs = [...(copy[selectedMenuIdx].children || [])];
                                subs[sIdx] = {
                                  ...subs[sIdx],
                                  actionType: e.target.value as NavActionType,
                                };
                                copy[selectedMenuIdx] = {
                                  ...copy[selectedMenuIdx],
                                  children: subs,
                                };
                                setNavDraft(copy);
                              }}
                              className="px-2 py-1.5 rounded border border-stone-200 text-xs"
                            >
                              <option value="page">Open Page</option>
                              <option value="home">Go Home</option>
                              <option value="scroll">Scroll Home</option>
                            </select>
                            <input
                              type="text"
                              value={sub.target}
                              onChange={(e) => {
                                const copy = [...navDraft];
                                const subs = [...(copy[selectedMenuIdx].children || [])];
                                subs[sIdx] = { ...subs[sIdx], target: e.target.value };
                                copy[selectedMenuIdx] = {
                                  ...copy[selectedMenuIdx],
                                  children: subs,
                                };
                                setNavDraft(copy);
                              }}
                              placeholder="Page slug"
                              className="w-40 px-2 py-1.5 rounded border border-stone-200 text-xs font-mono-num"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...navDraft];
                                const subs = (copy[selectedMenuIdx].children || []).filter(
                                  (_, idx2) => idx2 !== sIdx
                                );
                                copy[selectedMenuIdx] = {
                                  ...copy[selectedMenuIdx],
                                  children: subs,
                                };
                                setNavDraft(copy);
                              }}
                              className="text-red-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {sub.children && sub.children.length > 0 && (
                            <div className="pl-4 border-l-2 border-stone-200 space-y-1.5 pt-1">
                              <p className="text-[11px] font-semibold text-slate-500">
                                Nested Sub-Links ({sub.children.length})
                              </p>
                              {sub.children.map((deep, dIdx) => (
                                <div key={deep.id} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={deep.label}
                                    onChange={(e) => {
                                      const copy = [...navDraft];
                                      const subs = [
                                        ...(copy[selectedMenuIdx].children || []),
                                      ];
                                      const deeps = [...(subs[sIdx].children || [])];
                                      deeps[dIdx] = {
                                        ...deeps[dIdx],
                                        label: e.target.value,
                                      };
                                      subs[sIdx] = { ...subs[sIdx], children: deeps };
                                      copy[selectedMenuIdx] = {
                                        ...copy[selectedMenuIdx],
                                        children: subs,
                                      };
                                      setNavDraft(copy);
                                    }}
                                    className="flex-1 px-2 py-1 rounded border border-stone-200 text-xs"
                                  />
                                  <input
                                    type="text"
                                    value={deep.target}
                                    onChange={(e) => {
                                      const copy = [...navDraft];
                                      const subs = [
                                        ...(copy[selectedMenuIdx].children || []),
                                      ];
                                      const deeps = [...(subs[sIdx].children || [])];
                                      deeps[dIdx] = {
                                        ...deeps[dIdx],
                                        target: e.target.value,
                                      };
                                      subs[sIdx] = { ...subs[sIdx], children: deeps };
                                      copy[selectedMenuIdx] = {
                                        ...copy[selectedMenuIdx],
                                        children: subs,
                                      };
                                      setNavDraft(copy);
                                    }}
                                    className="w-36 px-2 py-1 rounded border border-stone-200 text-xs font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const copy = [...navDraft];
                                      const subs = [
                                        ...(copy[selectedMenuIdx].children || []),
                                      ];
                                      const deeps = (subs[sIdx].children || []).filter(
                                        (_, i3) => i3 !== dIdx
                                      );
                                      subs[sIdx] = { ...subs[sIdx], children: deeps };
                                      copy[selectedMenuIdx] = {
                                        ...copy[selectedMenuIdx],
                                        children: subs,
                                      };
                                      setNavDraft(copy);
                                    }}
                                    className="text-red-500 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. HOME SECTIONS CMS */}
        {activeTab === 'sections' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#0B3B2E]" />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Edit Homepage Sections &amp; Contact Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update any homepage block or contact details directly in Firestore.
                  </p>
                </div>
              </div>
              <select
                value={cmsSectionKey}
                onChange={(e) => setCmsSectionKey(e.target.value as keyof SiteCmsData)}
                className="px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium bg-white"
              >
                <option value="hero">1. Hero Liquid Glass Section</option>
                <option value="trustSection">2. Your Trust, Our Priority</option>
                <option value="section3Star">3. 3 Star Umrah &amp; Basmalah</option>
                <option value="section4Star">4. Deluxe 4 Star Section</option>
                <option value="section5Star">5. Luxury 5 Star Section</option>
                <option value="sectionRamadan">6. Ramadan Umrah Section</option>
                <option value="sectionPremium">7. Limited Time Offers</option>
                <option value="monthsSection">8. Months &amp; Why Choose Us</option>
                <option value="airlines">9. Airline Partners</option>
                <option value="processSection">10. 4 Booking Process Steps</option>
                <option value="storiesSection">11. Pilgrim Stories</option>
                <option value="videoSection">12. Video Testimonials</option>
                <option value="faqSection">13. FAQ Section</option>
                <option value="contact">14. Contact, Phone, Email &amp; Footer</option>
              </select>
            </div>

            {cmsSectionKey === 'hero' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Eyebrow Kicker
                    </label>
                    <input
                      type="text"
                      value={cmsDraft.hero.eyebrow}
                      onChange={(e) =>
                        setCmsDraft({
                          ...cmsDraft,
                          hero: { ...cmsDraft.hero, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Primary Heading
                    </label>
                    <input
                      type="text"
                      value={cmsDraft.hero.heading}
                      onChange={(e) =>
                        setCmsDraft({
                          ...cmsDraft,
                          hero: { ...cmsDraft.hero, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subheading
                  </label>
                  <textarea
                    rows={3}
                    value={cmsDraft.hero.subheading}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        hero: { ...cmsDraft.hero, subheading: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
            )}

            {cmsSectionKey === 'trustSection' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={cmsDraft.trustSection.heading}
                      onChange={(e) =>
                        setCmsDraft({
                          ...cmsDraft,
                          trustSection: { ...cmsDraft.trustSection, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Section Subheading
                    </label>
                    <input
                      type="text"
                      value={cmsDraft.trustSection.subheading}
                      onChange={(e) =>
                        setCmsDraft({
                          ...cmsDraft,
                          trustSection: { ...cmsDraft.trustSection, subheading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cmsDraft.trustSection.boxes.map((box, bIdx) => (
                    <div
                      key={box.id}
                      className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF8] space-y-2.5"
                    >
                      <p className="text-xs font-semibold text-[#0B3B2E] uppercase">
                        Trust Box {bIdx + 1} ({box.actionType})
                      </p>
                      <input
                        type="text"
                        value={box.kicker}
                        onChange={(e) => {
                          const nextBoxes = [...cmsDraft.trustSection.boxes];
                          nextBoxes[bIdx] = { ...nextBoxes[bIdx], kicker: e.target.value };
                          setCmsDraft({
                            ...cmsDraft,
                            trustSection: { ...cmsDraft.trustSection, boxes: nextBoxes },
                          });
                        }}
                        placeholder="Kicker"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={box.title}
                        onChange={(e) => {
                          const nextBoxes = [...cmsDraft.trustSection.boxes];
                          nextBoxes[bIdx] = { ...nextBoxes[bIdx], title: e.target.value };
                          setCmsDraft({
                            ...cmsDraft,
                            trustSection: { ...cmsDraft.trustSection, boxes: nextBoxes },
                          });
                        }}
                        placeholder="Title"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs font-semibold bg-white"
                      />
                      <input
                        type="text"
                        value={box.actionLabel}
                        onChange={(e) => {
                          const nextBoxes = [...cmsDraft.trustSection.boxes];
                          nextBoxes[bIdx] = { ...nextBoxes[bIdx], actionLabel: e.target.value };
                          setCmsDraft({
                            ...cmsDraft,
                            trustSection: { ...cmsDraft.trustSection, boxes: nextBoxes },
                          });
                        }}
                        placeholder="Button Label"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={box.logoUrl || ''}
                        onChange={(e) => {
                          const nextBoxes = [...cmsDraft.trustSection.boxes];
                          nextBoxes[bIdx] = { ...nextBoxes[bIdx], logoUrl: e.target.value };
                          setCmsDraft({
                            ...cmsDraft,
                            trustSection: { ...cmsDraft.trustSection, boxes: nextBoxes },
                          });
                        }}
                        placeholder="Custom Trust Logo URL (blank = built-in SVG)"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(cmsSectionKey === 'section3Star' ||
              cmsSectionKey === 'section4Star' ||
              cmsSectionKey === 'section5Star' ||
              cmsSectionKey === 'sectionRamadan' ||
              cmsSectionKey === 'sectionPremium') && (
              <div className="space-y-4">
                {cmsSectionKey === 'section3Star' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Arabic Basmalah
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={cmsDraft.section3Star.arabicBasmalah || ''}
                      onChange={(e) =>
                        setCmsDraft({
                          ...cmsDraft,
                          section3Star: {
                            ...cmsDraft.section3Star,
                            arabicBasmalah: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-lg font-arabic"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={cmsDraft[cmsSectionKey].title}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        [cmsSectionKey]: {
                          ...cmsDraft[cmsSectionKey],
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Section Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={cmsDraft[cmsSectionKey].subtitle}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        [cmsSectionKey]: {
                          ...cmsDraft[cmsSectionKey],
                          subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
            )}

            {cmsSectionKey === 'contact' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand Name (use &ldquo;Site Name, Domain &amp; Logo&rdquo; tab for global rename)
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.brandName}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, brandName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.domainName || ''}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, domainName: e.target.value },
                      })
                    }
                    placeholder="example.co.uk"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Top Bar Phone Number
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.phone}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Top Bar Email
                  </label>
                  <input
                    type="email"
                    value={cmsDraft.contact.email}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Number (digits only)
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.whatsappNumber}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, whatsappNumber: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.copyrightText}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, copyrightText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    UK Office Address
                  </label>
                  <input
                    type="text"
                    value={cmsDraft.contact.officeAddress}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        contact: { ...cmsDraft.contact, officeAddress: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
            )}

            {cmsSectionKey === 'airlines' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Manage Official Aviation Partners (4 carrier logos display across desktop home screen; leave Logo URL blank to use built-in crisp SVG airline emblem).
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setCmsDraft({
                        ...cmsDraft,
                        airlines: [
                          ...cmsDraft.airlines,
                          {
                            id: `airline-${Date.now()}`,
                            name: 'New Airline Partner',
                            code: 'XX',
                            tagline: 'UK Departures to Jeddah & Madinah',
                            logoUrl: '',
                          },
                        ],
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold hover:bg-stone-50 cursor-pointer shrink-0"
                  >
                    + Add Airline
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsDraft.airlines.map((air, idx) => (
                    <div
                      key={air.id}
                      className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF8] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3 bg-white border border-stone-200 rounded-lg p-2.5">
                        <div className="flex-1">
                          <AirlineLogo airline={air} />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setCmsDraft({
                              ...cmsDraft,
                              airlines: cmsDraft.airlines.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-red-600 p-1.5 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={air.name}
                          onChange={(e) => {
                            const list = [...cmsDraft.airlines];
                            list[idx] = { ...list[idx], name: e.target.value };
                            setCmsDraft({ ...cmsDraft, airlines: list });
                          }}
                          placeholder="Airline Name"
                          className="col-span-2 px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                        />
                        <input
                          type="text"
                          value={air.code}
                          maxLength={4}
                          onChange={(e) => {
                            const list = [...cmsDraft.airlines];
                            list[idx] = { ...list[idx], code: e.target.value.toUpperCase() };
                            setCmsDraft({ ...cmsDraft, airlines: list });
                          }}
                          placeholder="IATA"
                          className="px-2.5 py-1.5 rounded border border-stone-300 text-xs font-mono bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={air.tagline || ''}
                        onChange={(e) => {
                          const list = [...cmsDraft.airlines];
                          list[idx] = { ...list[idx], tagline: e.target.value };
                          setCmsDraft({ ...cmsDraft, airlines: list });
                        }}
                        placeholder="Route tagline (e.g. Direct LHR & MAN Flights)"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={air.logoUrl || ''}
                        onChange={(e) => {
                          const list = [...cmsDraft.airlines];
                          list[idx] = { ...list[idx], logoUrl: e.target.value };
                          setCmsDraft({ ...cmsDraft, airlines: list });
                        }}
                        placeholder="Custom Logo URL (optional — built-in SVG renders if blank)"
                        className="w-full px-2.5 py-1.5 rounded border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cmsSectionKey === 'faqSection' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cmsDraft.faqSection.title}
                    onChange={(e) =>
                      setCmsDraft({
                        ...cmsDraft,
                        faqSection: { ...cmsDraft.faqSection, title: e.target.value },
                      })
                    }
                    className="flex-1 mr-4 px-3 py-2 rounded-lg border border-stone-300 text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCmsDraft({
                        ...cmsDraft,
                        faqSection: {
                          ...cmsDraft.faqSection,
                          faqs: [
                            ...cmsDraft.faqSection.faqs,
                            {
                              id: `faq-${Date.now()}`,
                              question: 'New Question',
                              answer: 'Detailed answer here...',
                            },
                          ],
                        },
                      })
                    }
                    className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    + Add FAQ
                  </button>
                </div>
                {cmsDraft.faqSection.faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-lg border border-stone-200 bg-[#FAFAF8] space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const list = [...cmsDraft.faqSection.faqs];
                          list[idx] = { ...list[idx], question: e.target.value };
                          setCmsDraft({
                            ...cmsDraft,
                            faqSection: { ...cmsDraft.faqSection, faqs: list },
                          });
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-stone-300 text-sm font-medium bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const list = cmsDraft.faqSection.faqs.filter(
                            (_, i) => i !== idx
                          );
                          setCmsDraft({
                            ...cmsDraft,
                            faqSection: { ...cmsDraft.faqSection, faqs: list },
                          });
                        }}
                        className="text-red-600 p-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const list = [...cmsDraft.faqSection.faqs];
                        list[idx] = { ...list[idx], answer: e.target.value };
                        setCmsDraft({
                          ...cmsDraft,
                          faqSection: { ...cmsDraft.faqSection, faqs: list },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded border border-stone-300 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {cmsSectionKey === 'videoSection' && (
              <AdminVideoManager
                draft={cmsDraft.videoSection}
                onChange={(nextVideoSection) =>
                  setCmsDraft({ ...cmsDraft, videoSection: nextVideoSection })
                }
                onSave={async () => {
                  await saveSiteSection('videoSection', cmsDraft.videoSection);
                  showToast('Customer Video Testimonials saved live to Firestore!');
                }}
                onToast={showToast}
              />
            )}

            {cmsSectionKey !== 'hero' &&
              cmsSectionKey !== 'trustSection' &&
              cmsSectionKey !== 'section3Star' &&
              cmsSectionKey !== 'section4Star' &&
              cmsSectionKey !== 'section5Star' &&
              cmsSectionKey !== 'sectionRamadan' &&
              cmsSectionKey !== 'sectionPremium' &&
              cmsSectionKey !== 'contact' &&
              cmsSectionKey !== 'airlines' &&
              cmsSectionKey !== 'videoSection' &&
              cmsSectionKey !== 'faqSection' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Structured editor for <strong>{cmsSectionKey}</strong>:
                  </p>
                  <textarea
                    rows={14}
                    value={JSON.stringify(cmsDraft[cmsSectionKey], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setCmsDraft({ ...cmsDraft, [cmsSectionKey]: parsed });
                      } catch {
                        // Ignore intermediate invalid JSON while typing
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 font-mono text-xs bg-[#FAFAF8]"
                  />
                </div>
              )}

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={async () => {
                  await saveSiteSection(cmsSectionKey, cmsDraft[cmsSectionKey]);
                  showToast(`Saved "${cmsSectionKey}" section live to Firestore!`);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Publish Section Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* 8. SITE NAME, DOMAIN, LOGO, FAVICON & SOCIAL MEDIA LINKS */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* Global Website Name & Domain Name Replacer */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setApplyingBrand(true);
                try {
                  await updateGlobalBrandAndDomain(
                    globalBrandInput,
                    globalDomainInput,
                    syncEmailAndSocials
                  );
                  showToast(
                    `Website name updated to "${globalBrandInput}" & domain "${globalDomainInput}" everywhere!`
                  );
                } finally {
                  setApplyingBrand(false);
                }
              }}
              className="bg-white border-2 border-[#0B3B2E]/25 rounded-xl p-6 space-y-5"
            >
              <div className="border-b border-stone-100 pb-4">
                <p className="text-xs font-semibold tracking-wider text-[#9A7414] uppercase mb-1">
                  Global Brand &amp; Domain Switcher
                </p>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  Change Website Name &amp; Domain Everywhere
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  When you finalize your agency name or domain, update both fields below. This automatically replaces the old name &amp; domain across your Header, Browser Tab, Footer, Legal Pages, Privacy/Terms, FAQs, Testimonials, Why Choose Us, Quote Emails, and all 37+ CMS pages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={globalBrandInput}
                    onChange={(e) => setGlobalBrandInput(e.target.value)}
                    placeholder="e.g. Al-Haramain Travel UK"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-medium focus:outline-none focus:border-[#0B3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website Domain Name
                  </label>
                  <input
                    type="text"
                    required
                    minLength={4}
                    value={globalDomainInput}
                    onChange={(e) => setGlobalDomainInput(e.target.value)}
                    placeholder="e.g. alharamaintravel.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm font-mono focus:outline-none focus:border-[#0B3B2E]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncEmailAndSocials}
                  onChange={(e) => setSyncEmailAndSocials(e.target.checked)}
                  className="rounded border-stone-300"
                />
                <span>
                  Also update contact email domain &amp; social handle URLs to match the new brand/domain
                </span>
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={applyingBrand}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {applyingBrand
                      ? 'Updating All Site Content...'
                      : 'Apply Website Name & Domain Everywhere'}
                  </span>
                </button>
              </div>
            </form>

            {/* Logo, Favicon & Social Links Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveSiteSection('branding', brandingDraft);
                showToast('Logo, Favicon & Social Media Links updated live!');
              }}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-stone-200">
                {/* Website Logo */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Website Header &amp; Footer Logo
                  </label>
                  <p className="text-xs text-slate-500">
                    Paste an image URL or upload a PNG/SVG logo (leave empty to use the built-in {siteContent.contact.brandName} emblem).
                  </p>
                <input
                  type="text"
                  value={brandingDraft.logoUrl}
                  onChange={(e) =>
                    setBrandingDraft({ ...brandingDraft, logoUrl: e.target.value })
                  }
                  placeholder="https://... or upload below"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'logoUrl')}
                    className="text-xs text-slate-600"
                  />
                  {brandingDraft.logoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setBrandingDraft({ ...brandingDraft, logoUrl: '' })
                      }
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
                {brandingDraft.logoUrl && (
                  <div className="p-3 bg-[#FAFAF8] border border-stone-200 rounded-lg inline-block">
                    <img
                      src={brandingDraft.logoUrl}
                      alt="Logo Preview"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Website Favicon */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Browser Tab Favicon
                </label>
                <p className="text-xs text-slate-500">
                  Paste an ICO/PNG/SVG URL or upload a small icon (applied immediately to the browser tab).
                </p>
                <input
                  type="text"
                  value={brandingDraft.faviconUrl}
                  onChange={(e) =>
                    setBrandingDraft({ ...brandingDraft, faviconUrl: e.target.value })
                  }
                  placeholder="https://... or upload below"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'faviconUrl')}
                    className="text-xs text-slate-600"
                  />
                  {brandingDraft.faviconUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setBrandingDraft({ ...brandingDraft, faviconUrl: '' })
                      }
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {brandingDraft.faviconUrl && (
                  <div className="p-2 bg-[#FAFAF8] border border-stone-200 rounded-lg inline-block">
                    <img
                      src={brandingDraft.faviconUrl}
                      alt="Favicon Preview"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Social Media Profile URLs
                </h3>
                <p className="text-xs text-slate-500">
                  Displayed in the header utility strip, website footer, and Contact Us page. Clear any URL to hide its icon.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={brandingDraft.socialLinks.facebook}
                    onChange={(e) =>
                      setBrandingDraft({
                        ...brandingDraft,
                        socialLinks: {
                          ...brandingDraft.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={brandingDraft.socialLinks.instagram}
                    onChange={(e) =>
                      setBrandingDraft({
                        ...brandingDraft,
                        socialLinks: {
                          ...brandingDraft.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={brandingDraft.socialLinks.youtube}
                    onChange={(e) =>
                      setBrandingDraft({
                        ...brandingDraft,
                        socialLinks: {
                          ...brandingDraft.socialLinks,
                          youtube: e.target.value,
                        },
                      })
                    }
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={brandingDraft.socialLinks.tiktok}
                    onChange={(e) =>
                      setBrandingDraft({
                        ...brandingDraft,
                        socialLinks: {
                          ...brandingDraft.socialLinks,
                          tiktok: e.target.value,
                        },
                      })
                    }
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={brandingDraft.socialLinks.twitterX}
                    onChange={(e) =>
                      setBrandingDraft({
                        ...brandingDraft,
                        socialLinks: {
                          ...brandingDraft.socialLinks,
                          twitterX: e.target.value,
                        },
                      })
                    }
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding &amp; Social Links</span>
              </button>
            </div>
          </form>
          </div>
        )}

        {/* 9. ADMIN SECURITY & CUSTOM LINK */}
        {activeTab === 'security' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateAdminCredentials(newUsername, newPassword, newSlug);
              const clean = newSlug.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || 'admin';
              onSlugChanged(clean);
              setNewPassword('');
              showToast(`Admin credentials & link updated to #${clean}`);
            }}
            className="bg-white border border-stone-200 rounded-xl p-6 max-w-2xl space-y-5"
          >
            <div className="flex items-start gap-3 pb-4 border-b border-stone-100">
              <ShieldCheck className="w-6 h-6 text-[#0B3B2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Admin Security, Username, Password &amp; Portal Link
                </h3>
                <p className="text-xs text-slate-500">
                  Customize your admin username, password (stored securely as SHA-256 hash), and private hash URL (default: #admin).
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                New Admin Password (leave blank to keep current password)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Custom Admin Portal Hash Link
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 rounded-l-lg bg-stone-100 border border-r-0 border-stone-300 text-sm font-mono text-slate-600">
                  /#
                </span>
                <input
                  type="text"
                  required
                  minLength={3}
                  pattern="[a-zA-Z0-9_-]+"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-r-lg border border-stone-300 text-sm font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Current active admin link: <strong>#{adminRouteSlug}</strong>
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0B3B2E] text-white text-xs font-semibold hover:bg-[#082A21] cursor-pointer"
            >
              Save Security &amp; Link Settings
            </button>
          </form>
        )}
      </main>
    </div>
  );
};
