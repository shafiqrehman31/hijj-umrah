import React, { useEffect, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InfoModal, InfoModalState } from './components/InfoModal';
import { MonthsAndWhySection } from './components/MonthsAndWhySection';
import { PackageBookingModal } from './components/PackageBookingModal';
import { PackageSections } from './components/PackageSections';
import { PageView } from './components/PageView';
import { PartnersStepsTestimonialsFaq } from './components/PartnersStepsTestimonialsFaq';
import { TrustSection } from './components/TrustSection';
import { UserDashboardModal } from './components/UserDashboardModal';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { TravelPackage } from './types';

const MainAppShell: React.FC = () => {
  const { siteContent, adminRouteSlug } = useFirebase();

  const parseHash = (hashStr: string, slug: string) => {
    const clean = hashStr.replace(/^#/, '');
    if (clean.toLowerCase() === slug.toLowerCase()) {
      return { mode: 'admin' as const, pageSlug: '' };
    }
    if (clean.toLowerCase().startsWith('page/')) {
      return { mode: 'page' as const, pageSlug: clean.slice(5) };
    }
    return { mode: 'home' as const, pageSlug: '' };
  };

  const [routeState, setRouteState] = useState<{
    mode: 'home' | 'page' | 'admin';
    pageSlug: string;
  }>(() => parseHash(window.location.hash, 'admin'));

  const [selectedPkg, setSelectedPkg] = useState<TravelPackage | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalState>({ type: 'none' });

  // Sync hash routing with configurable adminRouteSlug and #page/<slug>
  useEffect(() => {
    const handleHashChange = () => {
      const clean = window.location.hash.replace(/^#/, '');
      if (clean.toLowerCase() === 'dashboard') {
        setDashboardOpen(true);
        return;
      }
      const next = parseHash(window.location.hash, adminRouteSlug);
      setRouteState(next);
      if (next.mode === 'page') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [adminRouteSlug]);

  // Dynamically sync browser Favicon & Page Title when updated in Admin Panel
  useEffect(() => {
    const brand = siteContent.contact.brandName || 'Aqdas Travel';
    const titleStr = `${brand} — UK Hajj & Umrah Pilgrimage Agency`;
    document.title = titleStr;
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute('content', titleStr);

    const fav = siteContent.branding?.faviconUrl;
    if (!fav) return;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = fav;
  }, [siteContent.branding?.faviconUrl, siteContent.contact.brandName]);

  const scrollToElement = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const openPage = (slug: string) => {
    window.location.hash = `#page/${slug}`;
    setRouteState({ mode: 'page', pageSlug: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = (scrollId?: string) => {
    window.location.hash = '#home';
    setRouteState({ mode: 'home', pageSlug: '' });
    if (scrollId) {
      scrollToElement(scrollId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const LEGACY_SCROLL_TO_PAGE: Record<string, string> = {
    'packages-3-star': '3-star-umrah',
    'packages-4-star': '4-star-umrah',
    'packages-5-star': '5-star-umrah',
    'packages-ramadan': 'ramadan-umrah',
    'footer-contact': 'contact-us',
    'months-section': 'january-umrah',
    'hajj-all': 'hajj-packages',
    'umrah-all': 'umrah-packages',
  };

  const handleAction = (actionType: string, target: string) => {
    if (actionType === 'home') {
      goHome();
      return;
    }

    if (actionType === 'page') {
      openPage(target);
      return;
    }

    if (actionType === 'scroll') {
      if (LEGACY_SCROLL_TO_PAGE[target]) {
        openPage(LEGACY_SCROLL_TO_PAGE[target]);
      } else {
        goHome(target);
      }
      return;
    }

    if (actionType === 'filter-month') {
      openPage(`${target.toLowerCase()}-umrah`);
      return;
    }

    if (actionType === 'filter-category' || actionType === 'filter-city') {
      openPage(LEGACY_SCROLL_TO_PAGE[target] || target);
      return;
    }

    if (actionType === 'modal') {
      openPage(target);
    }
  };

  const openAdminPortal = () => {
    window.location.hash = `#${adminRouteSlug}`;
    setRouteState({ mode: 'admin', pageSlug: '' });
  };

  if (routeState.mode === 'admin') {
    return (
      <AdminDashboard
        onExitAdmin={() => goHome()}
        onSlugChanged={(newSlug) => {
          window.location.hash = `#${newSlug}`;
        }}
      />
    );
  }

  const activeCmsPage =
    routeState.mode === 'page'
      ? siteContent.pages.items.find((p) => p.slug === routeState.pageSlug) ||
        siteContent.pages.items[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-slate-900">
      <Header
        onAction={handleAction}
        onOpenQuoteModal={() => goHome('quote-form')}
      />

      <main className="flex-1">
        {activeCmsPage ? (
          <PageView
            page={activeCmsPage}
            onBackHome={() => goHome()}
            onSelectPackage={(pkg) => setSelectedPkg(pkg)}
            onQuoteSuccess={(result, recipientEmail) =>
              setInfoModal({ type: 'quoteEmail', result, recipientEmail })
            }
          />
        ) : (
          <>
            {/* Section 1: Makkah Liquid Glass Hero + Quote Form */}
            <HeroSection
              onOpenBeatPrice={() => openPage('beat-my-price')}
              onQuoteSuccess={(result, recipientEmail) =>
                setInfoModal({ type: 'quoteEmail', result, recipientEmail })
              }
            />

            {/* Section 2: Your Trust, Our Priority */}
            <TrustSection
              onVerifyAtol={() => setInfoModal({ type: 'atol' })}
              onReadReviews={() => scrollToElement('pilgrim-stories')}
              onWatchVideo={() => {
                if (siteContent.videoSection.videos[0]) {
                  setInfoModal({
                    type: 'video',
                    video: siteContent.videoSection.videos[0],
                  });
                }
              }}
            />

            {/* Sections 3, 4, 5, 6, 7: 3★ (Basmalah), 4★, 5★, Ramadan, Limited Time Premium (2-col) */}
            <PackageSections
              activeFilter={null}
              onClearFilter={() => {}}
              onSelectDetails={(pkg) => setSelectedPkg(pkg)}
            />

            {/* Section 8: Choose Your Umrah Month + Why Choose Aqdas Travel */}
            <MonthsAndWhySection
              onSelectMonth={(month) => openPage(`${month.toLowerCase()}-umrah`)}
            />

            {/* Sections 9, 10, 11, 12, 13: Airlines, Process Steps, Stories, Video Testimonials, FAQ */}
            <PartnersStepsTestimonialsFaq
              onOpenStoriesModal={() => setInfoModal({ type: 'stories' })}
              onSelectVideo={(video) => setInfoModal({ type: 'video', video })}
            />
          </>
        )}
      </main>

      <Footer onAction={handleAction} />

      {/* Package Details & Real-Time Slot Booking Modal */}
      <PackageBookingModal
        pkg={selectedPkg}
        onClose={() => setSelectedPkg(null)}
        onBookingCreated={() => {
          setSelectedPkg(null);
          setDashboardOpen(true);
        }}
      />

      {/* Pilgrim Dashboard Modal (Accessible after booking or via #dashboard) */}
      <UserDashboardModal
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onOpenAdminShortcut={openAdminPortal}
      />

      {/* ATOL / Stories / Video / Email Confirmation Modal */}
      <InfoModal
        state={infoModal}
        onClose={() => setInfoModal({ type: 'none' })}
        onScrollToQuote={() => goHome('quote-form')}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <MainAppShell />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
