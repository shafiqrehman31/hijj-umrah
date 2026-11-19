export type PackageCategory =
  | '3-star-umrah'
  | '4-star-umrah'
  | '5-star-umrah'
  | 'ramadan-umrah'
  | 'premium-offer'
  | '3-star-hajj'
  | '5-star-hajj'
  | 'umrah-2027'
  | 'london-umrah';

export interface TravelPackage {
  id: string;
  title: string;
  category: PackageCategory;
  starRating: number;
  nights: number;
  makkahNights?: number;
  madinahNights?: number;
  makkahHotel: string;
  makkahDistance?: string;
  madinahHotel: string;
  madinahDistance?: string;
  priceGbp: number;
  departureAirport?: string;
  monthTag?: string;
  cityTag?: string;
  imageUrl?: string;
  highlights?: string[];
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  lastBookingId?: string;
  active: boolean;
  displayOrder?: number;
  updatedAt?: unknown;
}

export type NavActionType =
  | 'home'
  | 'page'
  | 'scroll'
  | 'filter-category'
  | 'filter-month'
  | 'filter-city'
  | 'modal';

export interface NavSubItem {
  id: string;
  label: string;
  actionType: NavActionType;
  target: string;
  children?: NavSubItem[];
}

export interface NavItem {
  id: string;
  label: string;
  actionType: NavActionType;
  target: string;
  children?: NavSubItem[];
}

export interface NavigationConfig {
  items: NavItem[];
  adminRouteSlug: string;
  updatedAt?: unknown;
}

export interface HeroContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  backgroundImage: string;
  highlights: string[];
}

export interface TrustBox {
  id: string;
  kicker: string;
  title: string;
  actionLabel: string;
  actionType: 'atol' | 'reviews' | 'video';
}

export interface TrustSectionContent {
  heading: string;
  subheading: string;
  boxes: TrustBox[];
  bottomPillars: string[];
}

export interface SectionHeadingMeta {
  kicker?: string;
  arabicBasmalah?: string;
  title: string;
  subtitle: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface AirlinePartner {
  id: string;
  name: string;
  code: string;
  tagline?: string;
  logoUrl?: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface PilgrimStory {
  id: string;
  name: string;
  city: string;
  packageTaken: string;
  quote: string;
  rating: number;
}

export interface VideoTestimonial {
  id: string;
  pilgrimName: string;
  city: string;
  packageLabel: string;
  duration: string;
  thumbnailUrl: string;
  quoteSummary: string;
  fullTranscript: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface InfoArticle {
  id: string;
  slug: string;
  category: 'guide' | 'service' | 'about';
  title: string;
  subtitle: string;
  summary: string;
  bullets: string[];
  bodyParagraphs: string[];
}

export interface CmsPageSection {
  heading: string;
  content: string;
}

export interface CmsPage {
  slug: string;
  group: 'packages' | 'city' | 'monthly' | 'guides' | 'services' | 'company' | 'legal';
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage: string;
  intro: string;
  highlights: string[];
  sections: CmsPageSection[];
  packageFilter?: {
    type: 'category' | 'month' | 'city' | 'all-umrah' | 'all-hajj';
    value: string;
  };
  showContactForm?: boolean;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitterX: string;
}

export interface BrandingContent {
  logoUrl: string;
  faviconUrl: string;
  socialLinks: SocialLinks;
}

export interface ContactFooterContent {
  brandName: string;
  domainName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  atolNumber: string;
  aboutTagline: string;
  copyrightText: string;
}

export interface SiteCmsData {
  hero: HeroContent;
  trustSection: TrustSectionContent;
  section3Star: SectionHeadingMeta;
  section4Star: SectionHeadingMeta;
  section5Star: SectionHeadingMeta;
  sectionRamadan: SectionHeadingMeta;
  sectionPremium: SectionHeadingMeta;
  monthsSection: {
    title: string;
    subtitle: string;
    ratingSummary: string;
    whyTitle: string;
    whyItems: WhyChooseItem[];
  };
  airlines: AirlinePartner[];
  processSection: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  storiesSection: {
    title: string;
    description: string;
    ctaLabel: string;
    imageUrl: string;
    stories: PilgrimStory[];
  };
  videoSection: {
    kicker: string;
    title: string;
    videos: VideoTestimonial[];
  };
  faqSection: {
    title: string;
    subtitle: string;
    faqs: FaqItem[];
  };
  articles: InfoArticle[];
  contact: ContactFooterContent;
  branding: BrandingContent;
  pages: {
    items: CmsPage[];
  };
}

export interface QuoteRecord {
  id: string;
  departureDate: string;
  departureAirport: string;
  adults: number;
  children: number;
  infants: number;
  email: string;
  fullName: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Converted';
  emailTemplateSubject?: string;
  emailTemplateBody?: string;
  userId?: string;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type BookingStatus =
  | 'Inquiry Received'
  | 'Documents Pending'
  | 'Visa Processing'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'Unpaid' | 'Deposit Paid' | 'Paid in Full';

export interface BookingRecord {
  id: string;
  bookingRef: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  packageId: string;
  packageTitle: string;
  departureDate: string;
  departureAirport: string;
  adults: number;
  children: number;
  infants: number;
  totalAmountGbp: number;
  paidAmountGbp: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  passportSubmitted: boolean;
  vaccineSubmitted: boolean;
  notes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PaymentMethod =
  | 'Mock Debit/Credit Card'
  | 'UK Bank Transfer (FPS)'
  | '0% Installment Plan';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  userId: string;
  amountGbp: number;
  method: PaymentMethod;
  referenceCode: string;
  status: 'Completed' | 'Pending Verification';
  createdAt?: unknown;
}

export interface AppNotification {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  message: string;
  type: 'travel_update' | 'visa_reminder' | 'payment_receipt' | 'booking_status';
  read: boolean;
  createdAt?: unknown;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: 'quote' | 'booking' | 'payment' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt?: unknown;
}

export interface AdminSettings {
  username: string;
  passwordHash: string;
  adminRouteSlug: string;
  updatedAt?: unknown;
}
