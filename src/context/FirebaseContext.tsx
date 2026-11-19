import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  hashSecret,
  sanitizeId,
  testConnection,
} from '../firebase';
import {
  DEFAULT_NAVIGATION,
  DEFAULT_PACKAGES,
  DEFAULT_SITE_CONTENT,
} from '../data/defaultSiteData';
import { replaceBrandAndDomainDeep } from '../utils/brandReplacer';
import {
  AdminNotification,
  AdminSettings,
  AppNotification,
  BookingRecord,
  BookingStatus,
  NavigationConfig,
  PaymentMethod,
  PaymentRecord,
  QuoteRecord,
  SiteCmsData,
  TravelPackage,
} from '../types';

export interface QuoteSubmissionInput {
  departureDate: string;
  departureAirport: string;
  adults: number;
  children: number;
  infants: number;
  email: string;
  fullName: string;
  phone: string;
}

export interface QuoteSubmissionResult {
  quoteId: string;
  emailSubject: string;
  emailBody: string;
}

export interface CreateBookingInput {
  pkg: TravelPackage;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureDate: string;
  departureAirport: string;
  adults: number;
  children: number;
  infants: number;
  payMode: 'deposit' | 'full' | 'later';
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface FirebaseContextValue {
  authReady: boolean;
  currentUser: User | null;
  isAdminUser: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;

  packages: TravelPackage[];
  siteContent: SiteCmsData;
  navigation: NavigationConfig;
  adminRouteSlug: string;

  userBookings: BookingRecord[];
  userPayments: PaymentRecord[];
  userNotifications: AppNotification[];

  adminQuotes: QuoteRecord[];
  adminBookings: BookingRecord[];
  adminNotifications: AdminNotification[];
  adminSettings: AdminSettings | null;

  submitQuote: (input: QuoteSubmissionInput) => Promise<QuoteSubmissionResult>;
  createBooking: (input: CreateBookingInput) => Promise<BookingRecord>;
  makeMockPayment: (
    booking: BookingRecord,
    amountGbp: number,
    method: PaymentMethod
  ) => Promise<void>;
  toggleDocumentSubmitted: (
    booking: BookingRecord,
    field: 'passportSubmitted' | 'vaccineSubmitted'
  ) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;

  // Admin Operations
  savePackage: (pkg: TravelPackage) => Promise<void>;
  deletePackage: (packageId: string) => Promise<void>;
  saveSiteSection: <K extends keyof SiteCmsData>(
    sectionKey: K,
    payload: SiteCmsData[K]
  ) => Promise<void>;
  saveNavigationConfig: (config: NavigationConfig) => Promise<void>;
  updateQuoteStatus: (
    quoteId: string,
    status: QuoteRecord['status'],
    adminNotes?: string
  ) => Promise<void>;
  updateBookingStatusAndNotify: (
    booking: BookingRecord,
    newStatus: BookingStatus,
    notificationTitle: string,
    notificationMessage: string,
    notificationType?: AppNotification['type']
  ) => Promise<void>;
  sendAutomatedCustomerReminder: (
    booking: BookingRecord,
    title: string,
    message: string,
    type: AppNotification['type']
  ) => Promise<void>;
  markAdminNotifRead: (notifId: string) => Promise<void>;
  verifyAdminSecondaryLogin: (username: string, password: string) => Promise<boolean>;
  updateAdminCredentials: (
    newUsername: string,
    newPassword: string,
    newRouteSlug: string
  ) => Promise<void>;
  updateGlobalBrandAndDomain: (
    newBrandName: string,
    newDomainName: string,
    syncEmailAndSocials?: boolean
  ) => Promise<void>;
  seedDefaultsNow: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [packages, setPackages] = useState<TravelPackage[]>(DEFAULT_PACKAGES);
  const [siteContent, setSiteContent] = useState<SiteCmsData>(DEFAULT_SITE_CONTENT);
  const [navigation, setNavigation] = useState<NavigationConfig>(DEFAULT_NAVIGATION);

  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);
  const [userPayments, setUserPayments] = useState<PaymentRecord[]>([]);
  const [userNotifications, setUserNotifications] = useState<AppNotification[]>([]);

  const [adminQuotes, setAdminQuotes] = useState<QuoteRecord[]>([]);
  const [adminBookings, setAdminBookings] = useState<BookingRecord[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  const isAdminUser = useMemo(() => {
    if (!currentUser || !currentUser.emailVerified) return false;
    return currentUser.email === BOOTSTRAPPED_ADMIN_EMAIL;
  }, [currentUser]);

  // 1. Test connection + Auth state listener
  useEffect(() => {
    testConnection();
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // 2. Public live packages listener
  useEffect(() => {
    const q = query(collection(db, 'packages'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs
            .map((d) => ({ ...(d.data() as TravelPackage), id: d.id }))
            .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
          setPackages(loaded);
        } else {
          setPackages(DEFAULT_PACKAGES);
        }
      },
      (err) => {
        console.warn('Packages snapshot fallback:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 3. Public live CMS siteContent listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'siteContent'),
      (snap) => {
        if (!snap.empty) {
          setSiteContent((prev) => {
            const next = { ...prev };
            snap.docs.forEach((d) => {
              const data = d.data() as { sectionKey?: keyof SiteCmsData; payload?: unknown };
              if (data.sectionKey && data.payload !== undefined) {
                if (
                  (data.sectionKey === 'airlines' || data.sectionKey === 'articles') &&
                  !Array.isArray(data.payload) &&
                  typeof data.payload === 'object' &&
                  data.payload !== null &&
                  'items' in data.payload
                ) {
                  (next as Record<string, unknown>)[data.sectionKey] = (
                    data.payload as { items: unknown }
                  ).items;
                } else if (data.sectionKey === 'contact' && typeof data.payload === 'object' && data.payload !== null) {
                  next.contact = {
                    ...prev.contact,
                    ...(data.payload as SiteCmsData['contact']),
                    domainName:
                      (data.payload as Partial<SiteCmsData['contact']>).domainName ||
                      prev.contact.domainName ||
                      'aqdastravel.co.uk',
                  };
                } else {
                  (next as Record<string, unknown>)[data.sectionKey] = data.payload;
                }
              }
            });
            return next;
          });
        }
      },
      (err) => {
        console.warn('SiteContent snapshot fallback:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 4. Public live navigation listener
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'navigation', 'main'),
      (snap) => {
        if (snap.exists()) {
          setNavigation(snap.data() as NavigationConfig);
        }
      },
      (err) => {
        console.warn('Navigation snapshot fallback:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 5. Authenticated User Dashboard listeners
  useEffect(() => {
    if (!authReady || !currentUser || !currentUser.emailVerified) {
      setUserBookings([]);
      setUserPayments([]);
      setUserNotifications([]);
      return;
    }

    const bookingsQ = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.uid)
    );
    const unsubBookings = onSnapshot(
      bookingsQ,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as BookingRecord), id: d.id }));
        setUserBookings(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'bookings')
    );

    const paymentsQ = query(
      collection(db, 'payments'),
      where('userId', '==', currentUser.uid)
    );
    const unsubPayments = onSnapshot(
      paymentsQ,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as PaymentRecord), id: d.id }));
        setUserPayments(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'payments')
    );

    const notifsQ = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );
    const unsubNotifs = onSnapshot(
      notifsQ,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as AppNotification), id: d.id }));
        setUserNotifications(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')
    );

    return () => {
      unsubBookings();
      unsubPayments();
      unsubNotifs();
    };
  }, [authReady, currentUser]);

  // 6. Admin-only real-time listeners + automatic first-run seeding
  useEffect(() => {
    if (!authReady || !isAdminUser) {
      setAdminQuotes([]);
      setAdminBookings([]);
      setAdminNotifications([]);
      setAdminSettings(null);
      return;
    }

    const unsubQuotes = onSnapshot(
      query(collection(db, 'quotes'), orderBy('createdAt', 'desc')),
      (snap) => {
        setAdminQuotes(snap.docs.map((d) => ({ ...(d.data() as QuoteRecord), id: d.id })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'quotes')
    );

    const unsubAdminBookings = onSnapshot(
      query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
      (snap) => {
        setAdminBookings(snap.docs.map((d) => ({ ...(d.data() as BookingRecord), id: d.id })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'bookings')
    );

    const unsubAdminNotifs = onSnapshot(
      query(collection(db, 'adminNotifications'), orderBy('createdAt', 'desc')),
      (snap) => {
        setAdminNotifications(
          snap.docs.map((d) => ({ ...(d.data() as AdminNotification), id: d.id }))
        );
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'adminNotifications')
    );

    const unsubAdminSettings = onSnapshot(
      doc(db, 'adminSettings', 'security'),
      async (snap) => {
        if (snap.exists()) {
          setAdminSettings(snap.data() as AdminSettings);
        } else {
          // Initialize default admin security credentials (admin / AqdasAdmin2026!)
          const defaultHash = await hashSecret('AqdasAdmin2026!');
          const initSettings: AdminSettings = {
            username: 'admin',
            passwordHash: defaultHash,
            adminRouteSlug: 'admin',
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'adminSettings', 'security'), initSettings);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'adminSettings/security')
    );

    // Seed CMS & Packages if Firestore hasn't been initialized yet
    (async () => {
      try {
        const navSnap = await getDoc(doc(db, 'navigation', 'main'));
        if (!navSnap.exists()) {
          await seedDefaultsInternal();
        }
      } catch (e) {
        console.warn('Auto-seed check skipped:', e);
      }
    })();

    return () => {
      unsubQuotes();
      unsubAdminBookings();
      unsubAdminNotifs();
      unsubAdminSettings();
    };
  }, [authReady, isAdminUser]);

  const serializeSectionPayload = (payload: unknown) => {
    return Array.isArray(payload) ? { items: payload } : payload;
  };

  const seedDefaultsInternal = async () => {
    const batch = writeBatch(db);
    DEFAULT_PACKAGES.forEach((pkg) => {
      const ref = doc(db, 'packages', sanitizeId(pkg.id));
      batch.set(ref, { ...pkg, updatedAt: serverTimestamp() });
    });

    (Object.keys(DEFAULT_SITE_CONTENT) as Array<keyof SiteCmsData>).forEach((key) => {
      const ref = doc(db, 'siteContent', sanitizeId(key));
      batch.set(ref, {
        sectionKey: key,
        payload: serializeSectionPayload(DEFAULT_SITE_CONTENT[key]),
        updatedAt: serverTimestamp(),
      });
    });

    batch.set(doc(db, 'navigation', 'main'), {
      ...DEFAULT_NAVIGATION,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const submitQuote = async (input: QuoteSubmissionInput): Promise<QuoteSubmissionResult> => {
    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notifId = `admn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const activeBrand = siteContent.contact.brandName || 'Aqdas Travel';
    const activeDomain = siteContent.contact.domainName || 'aqdastravel.co.uk';
    const emailSubject = `Your ${activeBrand} UK Umrah & Hajj Quote Request (${input.departureAirport})`;
    const emailBody = [
      `Assalamu Alaikum ${input.fullName},`,
      '',
      `JazakAllahu Khayran for requesting a tailored pilgrimage quote with ${activeBrand} (${siteContent.contact.atolNumber}).`,
      '',
      'Summary of Your Inquiry:',
      `• Departure Date: ${input.departureDate}`,
      `• Departure Airport: ${input.departureAirport}`,
      `• Travellers: ${input.adults} Adult(s), ${input.children} Child(ren), ${input.infants} Infant(s)`,
      `• Contact Number: ${input.phone}`,
      `• Reference ID: ${quoteId.toUpperCase()}`,
      '',
      'One of our senior UK Umrah specialists is reviewing live flight fares and Makkah/Madinah hotel availability for your exact dates. You will receive your bespoke Best-Price itinerary shortly.',
      '',
      `Need immediate assistance? Call ${siteContent.contact.phone} or WhatsApp +${siteContent.contact.whatsappNumber}.`,
      '',
      'Warm regards,',
      `${activeBrand} UK Pilgrim Advisory Desk`,
      `${activeDomain} · ${siteContent.contact.officeAddress}`,
    ].join('\n');

    const quotePayload: Record<string, unknown> = {
      departureDate: input.departureDate,
      departureAirport: input.departureAirport,
      adults: Number(input.adults),
      children: Number(input.children),
      infants: Number(input.infants),
      email: input.email.trim(),
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      status: 'New',
      emailTemplateSubject: emailSubject,
      emailTemplateBody: emailBody,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (currentUser && currentUser.emailVerified) {
      quotePayload.userId = currentUser.uid;
    }

    const batch = writeBatch(db);
    batch.set(doc(db, 'quotes', quoteId), quotePayload);
    batch.set(doc(db, 'adminNotifications', notifId), {
      title: `New Quote Request from ${input.fullName.trim()}`,
      message: `${input.adults} Adults · ${input.departureAirport} · Depart ${input.departureDate} · ${input.phone}`,
      category: 'quote',
      relatedId: quoteId,
      read: false,
      createdAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `quotes/${quoteId}`);
    }

    return { quoteId, emailSubject, emailBody };
  };

  const createBooking = async (input: CreateBookingInput): Promise<BookingRecord> => {
    if (!currentUser || !currentUser.emailVerified) {
      throw new Error('Please sign in with Google to complete your booking.');
    }

    const bookingId = `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const bookingRef = `AQD-${Math.floor(100000 + Math.random() * 900000)}`;
    const payingTravellers = input.adults + input.children;
    const totalAmountGbp = Math.round(input.pkg.priceGbp * payingTravellers + input.infants * 195);

    let paidAmountGbp = 0;
    let paymentStatus: BookingRecord['paymentStatus'] = 'Unpaid';
    if (input.payMode === 'deposit') {
      paidAmountGbp = Math.min(totalAmountGbp, 250 * Math.max(1, input.adults));
      paymentStatus = paidAmountGbp >= totalAmountGbp ? 'Paid in Full' : 'Deposit Paid';
    } else if (input.payMode === 'full') {
      paidAmountGbp = totalAmountGbp;
      paymentStatus = 'Paid in Full';
    }

    const bookingDoc = {
      bookingRef,
      userId: currentUser.uid,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim(),
      customerPhone: input.customerPhone.trim(),
      packageId: input.pkg.id,
      packageTitle: input.pkg.title,
      departureDate: input.departureDate,
      departureAirport: input.departureAirport,
      adults: input.adults,
      children: input.children,
      infants: input.infants,
      totalAmountGbp,
      paidAmountGbp,
      paymentStatus,
      bookingStatus: 'Inquiry Received' as BookingStatus,
      passportSubmitted: false,
      vaccineSubmitted: false,
      notes: input.notes?.trim() || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const batch = writeBatch(db);
    batch.set(doc(db, 'bookings', bookingId), bookingDoc);

    // Atomic slot update on package if package exists in Firestore
    const pkgRef = doc(db, 'packages', input.pkg.id);
    const pkgSnap = await getDoc(pkgRef);
    if (pkgSnap.exists() && (pkgSnap.data().availableSlots ?? 0) > 0) {
      const curr = pkgSnap.data() as TravelPackage;
      batch.update(pkgRef, {
        availableSlots: Math.max(0, curr.availableSlots - 1),
        bookedSlots: (curr.bookedSlots || 0) + 1,
        lastBookingId: bookingId,
        updatedAt: serverTimestamp(),
      });
    }

    // Record mock payment if deposit or full
    if (paidAmountGbp > 0) {
      const paymentId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      batch.set(doc(db, 'payments', paymentId), {
        bookingId,
        userId: currentUser.uid,
        amountGbp: paidAmountGbp,
        method: input.paymentMethod,
        referenceCode: `TXN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: input.paymentMethod === 'UK Bank Transfer (FPS)' ? 'Pending Verification' : 'Completed',
        createdAt: serverTimestamp(),
      });
    }

    // Automated customer notifications: Booking Confirmation + Visa Document Reminder
    const notif1 = `notif-${Date.now()}-a`;
    const notif2 = `notif-${Date.now()}-b`;
    batch.set(doc(db, 'notifications', notif1), {
      userId: currentUser.uid,
      bookingId,
      title: `Booking Received: ${bookingRef}`,
      message: `Your reservation for ${input.pkg.title} departing ${input.departureDate} from ${input.departureAirport} is registered.`,
      type: 'booking_status',
      read: false,
      createdAt: serverTimestamp(),
    });
    batch.set(doc(db, 'notifications', notif2), {
      userId: currentUser.uid,
      bookingId,
      title: 'Action Needed: Visa Document Reminder',
      message: `Please mark your 6-month valid Passport and ACWY Vaccination Certificate as ready in your dashboard so we can begin Saudi Nusuk visa processing.`,
      type: 'visa_reminder',
      read: false,
      createdAt: serverTimestamp(),
    });

    // Instant Admin Notification
    const admNotifId = `admn-${Date.now()}-bk`;
    batch.set(doc(db, 'adminNotifications', admNotifId), {
      title: `New Booking ${bookingRef} · £${totalAmountGbp.toLocaleString()}`,
      message: `${input.customerName} booked ${input.pkg.title} (${paymentStatus}, £${paidAmountGbp} paid).`,
      category: 'booking',
      relatedId: bookingId,
      read: false,
      createdAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `bookings/${bookingId}`);
    }

    return { ...bookingDoc, id: bookingId };
  };

  const makeMockPayment = async (
    booking: BookingRecord,
    amountGbp: number,
    method: PaymentMethod
  ) => {
    if (!currentUser || !currentUser.emailVerified) return;
    const newPaid = Math.min(booking.totalAmountGbp, booking.paidAmountGbp + amountGbp);
    const newPaymentStatus: BookingRecord['paymentStatus'] =
      newPaid >= booking.totalAmountGbp ? 'Paid in Full' : 'Deposit Paid';

    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const notifId = `notif-${Date.now()}-pay`;
    const admNotifId = `admn-${Date.now()}-pay`;
    const refCode = `TXN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const batch = writeBatch(db);
    batch.update(doc(db, 'bookings', booking.id), {
      paidAmountGbp: newPaid,
      paymentStatus: newPaymentStatus,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'payments', paymentId), {
      bookingId: booking.id,
      userId: currentUser.uid,
      amountGbp,
      method,
      referenceCode: refCode,
      status: method === 'UK Bank Transfer (FPS)' ? 'Pending Verification' : 'Completed',
      createdAt: serverTimestamp(),
    });
    batch.set(doc(db, 'notifications', notifId), {
      userId: currentUser.uid,
      bookingId: booking.id,
      title: `Payment Receipt · £${amountGbp.toLocaleString()}`,
      message: `${method} recorded (${refCode}) for booking ${booking.bookingRef}. Current balance paid: £${newPaid.toLocaleString()} of £${booking.totalAmountGbp.toLocaleString()}.`,
      type: 'payment_receipt',
      read: false,
      createdAt: serverTimestamp(),
    });
    batch.set(doc(db, 'adminNotifications', admNotifId), {
      title: `Mock Payment £${amountGbp.toLocaleString()} · ${booking.bookingRef}`,
      message: `${booking.customerName} submitted £${amountGbp} via ${method}.`,
      category: 'payment',
      relatedId: booking.id,
      read: false,
      createdAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `payments/${paymentId}`);
    }
  };

  const toggleDocumentSubmitted = async (
    booking: BookingRecord,
    field: 'passportSubmitted' | 'vaccineSubmitted'
  ) => {
    if (!currentUser || !currentUser.emailVerified) return;
    const nextVal = !booking[field];
    const batch = writeBatch(db);
    batch.update(doc(db, 'bookings', booking.id), {
      [field]: nextVal,
      updatedAt: serverTimestamp(),
    });
    if (nextVal) {
      const notifId = `notif-${Date.now()}-doc`;
      batch.set(doc(db, 'notifications', notifId), {
        userId: currentUser.uid,
        bookingId: booking.id,
        title:
          field === 'passportSubmitted'
            ? 'Passport Details Logged'
            : 'ACWY Vaccination Logged',
        message: `Our UK visa desk has received your update for booking ${booking.bookingRef} and will verify it shortly.`,
        type: 'visa_reminder',
        read: false,
        createdAt: serverTimestamp(),
      });
    }
    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${booking.id}`);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notifications/${notifId}`);
    }
  };

  // --- Admin Operations ---
  const savePackage = async (pkg: TravelPackage) => {
    const id = sanitizeId(pkg.id || `pkg-${Date.now()}`);
    try {
      await setDoc(doc(db, 'packages', id), {
        ...pkg,
        id,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `packages/${id}`);
    }
  };

  const deletePackage = async (packageId: string) => {
    try {
      await deleteDoc(doc(db, 'packages', packageId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `packages/${packageId}`);
    }
  };

  const saveSiteSection = async <K extends keyof SiteCmsData>(
    sectionKey: K,
    payload: SiteCmsData[K]
  ) => {
    const id = sanitizeId(sectionKey);
    try {
      await setDoc(doc(db, 'siteContent', id), {
        sectionKey,
        payload: serializeSectionPayload(payload),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `siteContent/${id}`);
    }
  };

  const saveNavigationConfig = async (config: NavigationConfig) => {
    try {
      await setDoc(doc(db, 'navigation', 'main'), {
        ...config,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'navigation/main');
    }
  };

  const updateQuoteStatus = async (
    quoteId: string,
    status: QuoteRecord['status'],
    adminNotes?: string
  ) => {
    try {
      await updateDoc(doc(db, 'quotes', quoteId), {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quotes/${quoteId}`);
    }
  };

  const updateBookingStatusAndNotify = async (
    booking: BookingRecord,
    newStatus: BookingStatus,
    notificationTitle: string,
    notificationMessage: string,
    notificationType: AppNotification['type'] = 'booking_status'
  ) => {
    const batch = writeBatch(db);
    batch.update(doc(db, 'bookings', booking.id), {
      bookingStatus: newStatus,
      updatedAt: serverTimestamp(),
    });
    const notifId = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    batch.set(doc(db, 'notifications', notifId), {
      userId: booking.userId,
      bookingId: booking.id,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      read: false,
      createdAt: serverTimestamp(),
    });
    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${booking.id}`);
    }
  };

  const sendAutomatedCustomerReminder = async (
    booking: BookingRecord,
    title: string,
    message: string,
    type: AppNotification['type']
  ) => {
    const notifId = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      await setDoc(doc(db, 'notifications', notifId), {
        userId: booking.userId,
        bookingId: booking.id,
        title,
        message,
        type,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `notifications/${notifId}`);
    }
  };

  const markAdminNotifRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'adminNotifications', notifId), { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `adminNotifications/${notifId}`);
    }
  };

  const verifyAdminSecondaryLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    if (!adminSettings) return false;
    const hash = await hashSecret(password);
    return adminSettings.username === username.trim() && adminSettings.passwordHash === hash;
  };

  const updateAdminCredentials = async (
    newUsername: string,
    newPassword: string,
    newRouteSlug: string
  ) => {
    const cleanSlug = sanitizeId(newRouteSlug).toLowerCase() || 'admin';
    const passwordHash = newPassword.trim()
      ? await hashSecret(newPassword.trim())
      : adminSettings?.passwordHash || (await hashSecret('AqdasAdmin2026!'));

    const batch = writeBatch(db);
    batch.set(doc(db, 'adminSettings', 'security'), {
      username: newUsername.trim(),
      passwordHash,
      adminRouteSlug: cleanSlug,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'navigation', 'main'), {
      ...navigation,
      adminRouteSlug: cleanSlug,
      updatedAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'adminSettings/security');
    }
  };

  const updateGlobalBrandAndDomain = async (
    newBrandName: string,
    newDomainName: string,
    syncEmailAndSocials = true
  ) => {
    const oldBrand = siteContent.contact.brandName || 'Aqdas Travel';
    const oldDomain = siteContent.contact.domainName || 'aqdastravel.co.uk';
    const cleanBrand = newBrandName.trim() || oldBrand;
    const cleanDomain =
      newDomainName.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '') || oldDomain;

    const updatedSiteContent = replaceBrandAndDomainDeep(
      siteContent,
      oldBrand,
      cleanBrand,
      oldDomain,
      cleanDomain
    );

    updatedSiteContent.contact = {
      ...updatedSiteContent.contact,
      brandName: cleanBrand,
      domainName: cleanDomain,
      ...(syncEmailAndSocials && oldDomain !== cleanDomain
        ? {
            email: updatedSiteContent.contact.email.includes('@')
              ? `${updatedSiteContent.contact.email.split('@')[0]}@${cleanDomain}`
              : `info@${cleanDomain}`,
          }
        : {}),
    };

    if (!syncEmailAndSocials) {
      updatedSiteContent.branding = siteContent.branding;
    }

    const updatedNav = replaceBrandAndDomainDeep(
      navigation,
      oldBrand,
      cleanBrand,
      oldDomain,
      cleanDomain
    );

    const batch = writeBatch(db);
    (Object.keys(updatedSiteContent) as Array<keyof SiteCmsData>).forEach((key) => {
      batch.set(doc(db, 'siteContent', sanitizeId(key)), {
        sectionKey: key,
        payload: serializeSectionPayload(updatedSiteContent[key]),
        updatedAt: serverTimestamp(),
      });
    });

    batch.set(doc(db, 'navigation', 'main'), {
      ...updatedNav,
      updatedAt: serverTimestamp(),
    });

    try {
      await batch.commit();
      setSiteContent(updatedSiteContent);
      setNavigation(updatedNav);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteContent/globalBrandUpdate');
    }
  };

  const seedDefaultsNow = async () => {
    await seedDefaultsInternal();
  };

  return (
    <FirebaseContext.Provider
      value={{
        authReady,
        currentUser,
        isAdminUser,
        signInWithGoogle,
        signOutUser,
        packages,
        siteContent,
        navigation,
        adminRouteSlug: navigation.adminRouteSlug || 'admin',
        userBookings,
        userPayments,
        userNotifications,
        adminQuotes,
        adminBookings,
        adminNotifications,
        adminSettings,
        submitQuote,
        createBooking,
        makeMockPayment,
        toggleDocumentSubmitted,
        markNotificationRead,
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
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used inside FirebaseProvider');
  return ctx;
}
