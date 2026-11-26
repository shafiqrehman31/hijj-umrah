import { CmsPage } from '../types';

const HERO_MAKKAH = '/src/assets/images/hero_makkah_kaaba_1795101347410.jpg';
const MAKKAH_HOTEL = '/src/assets/images/package_makkah_hotel_1795101346171.jpg';
const MADINAH_NABAWI = '/src/assets/images/package_madinah_nabawi_1795101346554.jpg';
const RAMADAN_HARAM = '/src/assets/images/package_ramadan_haram_1795101346813.jpg';
const PILGRIM_STORY = '/src/assets/images/pilgrim_story_portrait_1795101346953.jpg';

const buildMonthPage = (month: string, seasonDesc: string): CmsPage => ({
  slug: `${month.toLowerCase()}-umrah`,
  group: 'monthly',
  eyebrow: `Monthly Umrah Collection · ${month}`,
  title: `${month} Umrah Packages`,
  subtitle: `ATOL-protected ${month} departures from London Heathrow, Manchester, Birmingham, Glasgow & Liverpool.`,
  heroImage: month === 'March' || month === 'April' ? RAMADAN_HARAM : MADINAH_NABAWI,
  intro: `${seasonDesc} Every ${month} Umrah package includes round-trip UK flights, Saudi Umrah/Tourist visa processing, verified Makkah & Madinah hotels, and 24/7 ground assistance.`,
  highlights: [
    `Guaranteed ${month} flight & hotel room allocations`,
    '3 Star, 4 Star & 5 Star Makkah & Madinah hotel tiers',
    'Direct Saudia, British Airways & Gulf carrier departures',
    'Fast-track visa documentation & automated reminders',
  ],
  sections: [
    {
      heading: `Why Travel for Umrah in ${month}?`,
      content: `Travelling in ${month} lets UK families plan around work and school calendars while enjoying structured Makkah and Madinah stays. Our London contracting desk secures multi-bed family rooms and private transfers in advance so there are zero hidden surcharges.`,
    },
    {
      heading: 'What Is Included in Every Booking',
      content:
        'Each itinerary includes return flights from your chosen UK airport, verified hotel stays in Makkah and Madinah, full Saudi visa issuance, airport-to-hotel ground transfers, and optional Haramain high-speed rail upgrades.',
    },
  ],
  packageFilter: { type: 'month', value: month },
});

export const DEFAULT_CMS_PAGES: CmsPage[] = [
  // Company Pages
  {
    slug: 'about-us',
    group: 'company',
    eyebrow: 'About Hidayah Travels UK',
    title: 'Serving British Pilgrims with Integrity & Care',
    subtitle:
      'ATOL-protected UK Hajj & Umrah specialists guiding over 10,000 pilgrims from across the United Kingdom to Makkah and Madinah.',
    heroImage: PILGRIM_STORY,
    intro:
      'Founded in London with regional advisory desks serving Birmingham, Manchester, Glasgow, and Liverpool, Hidayah Travels was established to bring complete clarity, spiritual focus, and financial protection to UK pilgrimage travel.',
    highlights: [
      'ATOL 11842 & IATA Accredited UK Tour Operator',
      'Direct hotel contracts in Clock Tower, Jabal Omar & Madinah Markazia',
      'English-speaking scholars and 24/7 on-ground coordinators in Saudi Arabia',
      'Live package slot tracking and real-time visa document portal',
    ],
    sections: [
      {
        heading: 'Our Commitment to Transparency',
        content:
          'We state exact walking distances to Masjid al-Haram and Al-Masjid an-Nabawi, exact airline carriers, and complete visa inclusions upfront. Every flight-inclusive booking is issued with an official CAA ATOL Certificate.',
      },
      {
        heading: 'Dedicated Support Before, During & After Travel',
        content:
          'From pre-departure Umrah workshops in the UK to Jeddah airport meet-and-greet and guided Ziyarat in Makkah and Madinah, our multilingual team supports elderly pilgrims, families with children, and first-time travellers at every step.',
      },
    ],
    packageFilter: { type: 'all-umrah', value: 'all' },
  },
  {
    slug: 'contact-us',
    group: 'company',
    eyebrow: 'UK Pilgrim Advisory Desk',
    title: 'Contact Hidayah Travels UK',
    subtitle:
      'Speak directly with our London-based Hajj & Umrah specialists by phone, WhatsApp, email, or in person at our Whitechapel office.',
    heroImage: HERO_MAKKAH,
    intro:
      'Whether you need a custom multi-family quote, Beat My Price comparison, or guidance on UK BRP/eVisa Saudi entry requirements, our team is ready 7 days a week.',
    highlights: [
      'London Head Office: 142 Whitechapel Road, London E1 1JE',
      'Direct Telephone: 020 7946 0821 (Mon–Sun, 9am – 9pm)',
      'Email Advisory: info@hidayahtravels.co.uk',
      '24/7 Emergency On-Ground Line for Active Pilgrims in KSA',
    ],
    sections: [
      {
        heading: 'Visit Our London Consultation Office',
        content:
          'Walk-in and scheduled consultations are welcome at 142 Whitechapel Road, London E1 1JE—a 3-minute walk from Whitechapel Elizabeth Line & Underground Station.',
      },
      {
        heading: 'Regional UK Telephone Desks',
        content:
          'We arrange departures from London Heathrow, Gatwick, Stansted, Manchester, Birmingham, Glasgow, Edinburgh, and Liverpool. Request a tailored callback using the inquiry form below.',
      },
    ],
    showContactForm: true,
  },

  // Hajj Packages Pages
  {
    slug: 'hajj-packages',
    group: 'packages',
    eyebrow: 'Fifth Pillar of Islam · UK Pilgrims',
    title: 'Hajj Packages',
    subtitle:
      'Guided 3 Star and 5 Star UK Hajj packages with Nusuk readiness guidance, Mina & Arafat full-board camps, and experienced UK scholars.',
    heroImage: HERO_MAKKAH,
    intro:
      'Performing Hajj is the journey of a lifetime. Hidayah Travels supports British pilgrims through Nusuk registration, pre-Hajj fiqh seminars, medical briefings, and seamless hotel & camp logistics.',
    highlights: [
      '3 Star & 5 Star Shifting and Non-Shifting Hajj options',
      'Air-conditioned Mina & Arafat camp facilities with full catering',
      'Senior UK English-speaking scholars & medical professionals',
      'High-speed Haramain train transfers between Makkah and Madinah',
    ],
    sections: [
      {
        heading: 'Nusuk Portal & UK Pilgrim Readiness',
        content:
          'Following Saudi Ministry of Hajj regulations for Western countries, our advisory team guides UK residents step-by-step on Nusuk wallet verification, passport compliance, and flight-package pairing.',
      },
      {
        heading: 'Pre-Departure Seminars & Spiritual Guidance',
        content:
          'Every pilgrim receives illustrated Hajj manuals, pocket du’a books, and live Q&A sessions covering Hajj Tamattu, Ihram, Muzdalifah, and Rami al-Jamarat.',
      },
    ],
    packageFilter: { type: 'all-hajj', value: 'hajj-all' },
  },
  {
    slug: '3-star-hajj',
    group: 'packages',
    eyebrow: 'Value Hajj Programme',
    title: '3 Star Hajj Package',
    subtitle:
      'Accessible, well-organised 14-night UK Hajj package with Aziziyah accommodation, Mina & Arafat full board, and dedicated scholar team.',
    heroImage: RAMADAN_HARAM,
    intro:
      'Designed for UK pilgrims seeking an authentic, spiritually focused Hajj journey at an accessible price point without compromising safety, scholar guidance, or hygiene standards.',
    highlights: [
      'Aziziyah comfortable pilgrim residence with 24/7 Haram shuttle',
      'Close-proximity Madinah hotel steps from Al-Masjid an-Nabawi',
      'All Mina, Arafat & Muzdalifah transfers and meals included',
      'Full British scholar & bilingual coordinator accompaniment',
    ],
    sections: [
      {
        heading: 'Shifting Itinerary Advantage',
        content:
          'Staying in Aziziyah during peak Hajj days reduces walking fatigue to Jamarat while keeping you connected to Masjid al-Haram outside peak road closures.',
      },
    ],
    packageFilter: { type: 'category', value: '3-star-hajj' },
  },
  {
    slug: '5-star-hajj',
    group: 'packages',
    eyebrow: 'Luxury Sanctuary Hajj',
    title: '5 Star Hajj Packages',
    subtitle:
      'Clock Tower & Markazia 5-star hotels paired with upgraded Mina hospitality camps, gourmet dining, and VIP UK departure logistics.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'Experience Hajj with maximum physical comfort so you can devote every ounce of energy to worship. Stay directly overlooking the Haram courtyard in Makkah and the Green Dome in Madinah.',
    highlights: [
      'Fairmont Clock Tower / Swissotel Makkah & InterContinental Madinah',
      'Upgraded Mina camp zone with private sleeping mats & refreshments',
      'Haramain Business Class rail & private AC executive coaches',
      'Dedicated UK physicians, scholars & concierge team',
    ],
    sections: [
      {
        heading: 'Non-Shifting & VIP Logistics',
        content:
          'Enjoy direct pedestrian access to Masjid al-Haram before and after the Days of Tashreeq, eliminating unnecessary hotel check-ins.',
      },
    ],
    packageFilter: { type: 'category', value: '5-star-hajj' },
  },

  // Umrah Packages Pages
  {
    slug: 'umrah-packages',
    group: 'packages',
    eyebrow: 'Complete UK Umrah Collection',
    title: 'Umrah Packages',
    subtitle:
      'Browse our full range of ATOL-protected 3 Star, 4 Star & 5 Star Umrah packages departing year-round from UK airports.',
    heroImage: HERO_MAKKAH,
    intro:
      'From affordable 7-night spiritual breaks to 14-night luxury family retreats, every Hidayah Travels Umrah package includes return flights, Saudi visa issuance, verified hotels, and private transfers.',
    highlights: [
      'Flexible 7, 10, 14 & 21-night durations',
      'Double, Triple, Quad & Family Connecting Rooms',
      'Direct & 1-stop flights from 8 UK airports',
      '0% Flexible Installments & £250pp deposit lock',
    ],
    sections: [
      {
        heading: 'Tailored to British Families & Groups',
        content:
          'Every traveller has unique priorities—whether proximity for elderly parents, school-holiday alignment, or budget flexibility. Select a live package below or request a custom itinerary.',
      },
    ],
    packageFilter: { type: 'all-umrah', value: 'all' },
  },
  {
    slug: '3-star-umrah',
    group: 'packages',
    eyebrow: 'Value Pilgrimage Collection',
    title: '3 Star Umrah Packages',
    subtitle:
      'Affordable, clean, and reliable 3-star hotels in Makkah and Madinah with frequent Haram shuttles, flights, and visas included.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Our 3 Star Umrah collection delivers maximum spiritual value for couples, students, and families looking for transparent pricing without hidden extras.',
    highlights: [
      'Vetted 3-star hotels (Emaar Grand, Voco IHG, Saja Al Madinah)',
      'Complimentary 24/7 air-conditioned shuttle to Haram gates',
      'Includes Saudi Umrah visa & return UK flights',
      'Optional guided Makkah & Madinah Ziyarat tours',
    ],
    sections: [
      {
        heading: 'Quality Without Compromise',
        content:
          'Every 3-star property we feature is personally inspected by our Saudi contracting team for cleanliness, air-conditioning reliability, and fast access to prayer areas.',
      },
    ],
    packageFilter: { type: 'category', value: '3-star-umrah' },
  },
  {
    slug: '4-star-umrah',
    group: 'packages',
    eyebrow: 'Deluxe Walking-Distance Collection',
    title: '4 Star Umrah Packages',
    subtitle:
      'Walking-distance 4-star hospitality minutes from Masjid al-Haram and Al-Masjid an-Nabawi with daily buffet breakfast.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'Our most popular choice for British families: step out of your hotel lobby and reach the Haram courtyard within 2 to 5 minutes on foot.',
    highlights: [
      'DoubleTree Jabal Omar, Pullman Zamzam & Anwar Al Madinah Mövenpick',
      'Daily international & halal buffet breakfast included',
      'Private AC transfers or Haramain high-speed rail',
      'Priority visa processing & ATOL Certificate',
    ],
    sections: [
      {
        heading: 'Balanced Comfort for All Ages',
        content:
          '4-star walking-distance hotels allow elderly pilgrims and young children to rest comfortably between Fajr, Dhuhr, Asr, Maghrib, and Isha prayers.',
      },
    ],
    packageFilter: { type: 'category', value: '4-star-umrah' },
  },
  {
    slug: '5-star-umrah',
    group: 'packages',
    eyebrow: 'Sanctuary & Clock Tower Collection',
    title: '5 Star Umrah Packages',
    subtitle:
      'Unrivalled 0m doorstep proximity at Fairmont Clock Tower, Raffles Palace, Conrad Jabal Omar, and The Oberoi Madinah.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'Step directly from your lift onto the Haram piazza. Our 5 Star collection pairs world-class hospitality with direct Saudia or British Airways flights and VIP chauffeur transfers.',
    highlights: [
      'Direct Haram courtyard access (0m – 60m)',
      'Kaaba-view & Prophet’s Mosque-view room upgrades',
      'GMC Yukon / VIP executive car Jeddah-Makkah transfers',
      'Haramain Business Class rail & dedicated concierge',
    ],
    sections: [
      {
        heading: 'Effortless Luxury in the Two Holy Cities',
        content:
          'Enjoy direct prayer-hall connectivity, gourmet Suhoor/breakfast dining, and seamless luggage handling from the moment you land at King Abdulaziz International Airport.',
      },
    ],
    packageFilter: { type: 'category', value: '5-star-umrah' },
  },
  {
    slug: 'umrah-2027',
    group: 'packages',
    eyebrow: 'Advance Allocation · Best Rates',
    title: 'Umrah Packages 2027',
    subtitle:
      'Lock in 2027 hotel rooms and direct UK flight seats early with low £199pp deposits and 0% monthly payment plans.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Planning ahead for 2027—whether for Winter Half Term, Ramadan 2027, Easter, or Summer holidays—gives your family first choice of connecting rooms and direct flights at lower fares.',
    highlights: [
      'Early-bird 2027 price lock guarantee',
      'Spread balance over 6 to 12 monthly 0% installments',
      'Priority selection of Kaaba-view suites & school holiday dates',
      'ATOL 11842 financially protected from day one',
    ],
    sections: [
      {
        heading: 'Why Book 2027 Early?',
        content:
          'Direct flights from London Heathrow and Manchester during UK school holidays fill months in advance. Locking your allocation early protects you from seasonal fare spikes.',
      },
    ],
    packageFilter: { type: 'category', value: 'umrah-2027' },
  },
  {
    slug: 'ramadan-umrah',
    group: 'packages',
    eyebrow: 'Equaling the Reward of Hajj',
    title: 'Ramadan Umrah Packages',
    subtitle:
      'First 10 Nights, Last 10 Nights (Laylatul Qadr), and Full-Month Ramadan packages with Suhoor & Iftar dining near the Haram.',
    heroImage: RAMADAN_HARAM,
    intro:
      'The Prophet (peace be upon him) taught that performing Umrah in Ramadan equals the reward of Hajj. Our Ramadan packages handle every logistical detail so you can immerse yourself in Taraweeh, Qiyam al-Layl, and Quran recitation.',
    highlights: [
      'First 10, Middle 10, Last 10 Nights & Full Month options',
      'Daily Suhoor & Iftar included at selected 4★ & 5★ hotels',
      'Ramadan Umrah visa & Nusuk permit guidance',
      'Guaranteed UK departures from Heathrow, Manchester & Birmingham',
    ],
    sections: [
      {
        heading: 'Laylatul Qadr & Eid in the Haramain',
        content:
          'Spending the final ten blessed nights in Makkah or Madinah requires confirmed hotel inventory months ahead. We hold contracted rooms at Swissotel, Hilton Suites, and Al Marwa Rayhaan.',
      },
    ],
    packageFilter: { type: 'category', value: 'ramadan-umrah' },
  },
  {
    slug: 'london-umrah',
    group: 'packages',
    eyebrow: 'London Departures · LHR · LGW · STN',
    title: 'London Umrah Packages',
    subtitle:
      'Direct Saudia and British Airways flights from London Heathrow, Gatwick & Stansted tailored for Greater London & South East pilgrims.',
    heroImage: HERO_MAKKAH,
    intro:
      'Depart conveniently from London Heathrow (LHR), Gatwick (LGW), or Stansted (STN) with direct daytime or overnight flights into Jeddah and Madinah.',
    highlights: [
      'Direct non-stop Saudia & BA flights from Heathrow Terminal 4 & 5',
      'Dedicated London Whitechapel in-person consultation desk',
      'Generous 2x23kg luggage + 5L Zamzam allowance',
      'All-inclusive 3★, 4★ & 5★ hotel tiers',
    ],
    sections: [
      {
        heading: 'Fly Direct to Jeddah or Madinah',
        content:
          'Save hours of transit time with direct 6.5-hour flights from London, ideal for seniors and families travelling with young children.',
      },
    ],
    packageFilter: { type: 'category', value: 'london-umrah' },
  },

  // City Wise Pages
  {
    slug: 'easter-umrah',
    group: 'city',
    eyebrow: 'UK School Holiday Special',
    title: 'Easter Umrah Packages',
    subtitle:
      'Take advantage of the two-week UK Easter school break to perform a memorable family Umrah together.',
    heroImage: PILGRIM_STORY,
    intro:
      'Easter holidays offer mild Saudi weather and zero missed school days. We offer specially discounted child rates and adjoining family suites.',
    highlights: [
      'Aligned with UK April Easter school holiday dates',
      'Child & infant fare discounts from UK airports',
      'Family-friendly 4-star & 5-star Haram walking hotels',
      'Guided family Ziyarat with English-speaking scholars',
    ],
    sections: [
      {
        heading: 'Designed for Multi-Generational Families',
        content:
          'From stroller-friendly hotel lobbies to private Jeddah-Makkah GMC transfers, we make family Umrah stress-free.',
      },
    ],
    packageFilter: { type: 'city', value: 'Easter' },
  },
  {
    slug: 'birmingham-umrah',
    group: 'city',
    eyebrow: 'West Midlands Departures · BHX',
    title: 'Umrah Packages Birmingham',
    subtitle:
      'Convenient Umrah departures from Birmingham Airport (BHX) with Emirates, Saudia, Qatar Airways & Turkish Airlines.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Serving pilgrims across Birmingham, Solihull, Coventry, Leicester, and Wolverhampton with seamless departures straight from Birmingham International Airport.',
    highlights: [
      'Direct & smooth 1-stop connections from BHX',
      'Local Midlands family & group booking discounts',
      '3★, 4★ & 5★ Makkah and Madinah hotels',
      '24/7 UK & Saudi support team',
    ],
    sections: [
      {
        heading: 'Fly Local from the Midlands',
        content:
          'Avoid costly M40/M25 travel to London—check in right at Birmingham Airport with full luggage & Zamzam support.',
      },
    ],
    packageFilter: { type: 'city', value: 'Birmingham' },
  },
  {
    slug: 'uk-umrah-packages',
    group: 'city',
    eyebrow: 'Nationwide UK Departures',
    title: 'UK Umrah Packages',
    subtitle:
      'Nationwide departures across England and Scotland with ATOL financial protection and complete visa handling.',
    heroImage: HERO_MAKKAH,
    intro:
      'Wherever you live in the United Kingdom, Hidayah Travels connects your nearest international airport directly to Makkah and Madinah.',
    highlights: [
      '8 UK departure airports covered',
      'Uniform ATOL 11842 protection on every booking',
      'Transparent GBP pricing with no hidden fees',
    ],
    sections: [
      {
        heading: 'Regional Convenience',
        content:
          'Mix and match departure dates, room types, and airlines to fit your group.',
      },
    ],
    packageFilter: { type: 'all-umrah', value: 'all' },
  },
  {
    slug: 'liverpool-umrah',
    group: 'city',
    eyebrow: 'Merseyside & North West',
    title: 'Liverpool Umrah Packages',
    subtitle:
      'Tailored Umrah itineraries for Liverpool & Merseyside pilgrims via LPL and nearby Manchester hub connections.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'Serving families across Liverpool, Wirral, St Helens, and Chester with convenient departures and complete visa + hotel care.',
    highlights: [
      'Convenient North West flight options',
      'Full Umrah visa & ACWY checklist guidance',
      '3★, 4★ & 5★ hotels near Masjid al-Haram',
    ],
    sections: [
      {
        heading: 'Dedicated North West Advisory',
        content:
          'Our specialists coordinate airport transfers, connecting flights, and family rooms tailored to Liverpool residents.',
      },
    ],
    packageFilter: { type: 'city', value: 'Liverpool' },
  },
  {
    slug: 'glasgow-manchester-umrah',
    group: 'city',
    eyebrow: 'Scotland & Northern England · GLA · MAN',
    title: 'Glasgow & Manchester Umrah Packages',
    subtitle:
      'Direct & premier Gulf carrier Umrah packages from Glasgow Airport (GLA) and Manchester Airport (MAN).',
    heroImage: RAMADAN_HARAM,
    intro:
      'Serving pilgrims across Glasgow, Edinburgh, Manchester, Leeds, Bradford, and Sheffield with top-rated flights via Emirates, Qatar Airways, Etihad, and Saudia.',
    highlights: [
      'Direct Saudia flights from Manchester (MAN)',
      'Emirates & British Airways flights from Glasgow (GLA)',
      'Group & family multi-room allocations',
    ],
    sections: [
      {
        heading: 'North & Scotland Pilgrimage Specialists',
        content:
          'Benefit from direct Jeddah arrivals from Manchester or short one-stop journeys from Glasgow with full ground care.',
      },
    ],
    packageFilter: { type: 'city', value: 'Manchester' },
  },
  {
    slug: 'top-uk-cities-umrah',
    group: 'city',
    eyebrow: 'All Major UK Hubs',
    title: 'Top UK Cities Umrah Packages',
    subtitle:
      'Compare live Umrah departures from London, Manchester, Birmingham, Glasgow, Edinburgh, and Liverpool.',
    heroImage: HERO_MAKKAH,
    intro:
      'Compare fares and hotel availability across every major UK city hub to find the most convenient departure for your family.',
    highlights: [
      'London (LHR/LGW/STN), Manchester (MAN), Birmingham (BHX)',
      'Glasgow (GLA), Edinburgh (EDI) & Liverpool (LPL)',
      'Same ATOL protection and visa service nationwide',
    ],
    sections: [
      {
        heading: 'Multi-City Family Reunions in Makkah',
        content:
          'Have relatives flying from both London and Manchester? We synchronize arrival times in Jeddah so your family checks into Makkah together.',
      },
    ],
    packageFilter: { type: 'all-umrah', value: 'all' },
  },

  // All 12 Monthly Pages
  buildMonthPage(
    'January',
    'Cool, pleasant winter evenings in Makkah and Madinah make January ideal for elderly pilgrims and families.'
  ),
  buildMonthPage(
    'February',
    'February combines comfortable 24°C–27°C daytime temperatures with UK February Half-Term family departures.'
  ),
  buildMonthPage(
    'March',
    'Experience blessed spring and Ramadan spiritual nights in the Two Holy Mosques with our March allocations.'
  ),
  buildMonthPage(
    'April',
    'Take advantage of Easter holidays and pleasant post-Ramadan calm across Makkah and Madinah.'
  ),
  buildMonthPage(
    'May',
    'Enjoy quiet Haram courtyards and exceptional 5-star hotel value during May Umrah departures.'
  ),
  buildMonthPage(
    'June',
    'June provides flexible summer options with competitive 4-star and 5-star Clock Tower rates.'
  ),
  buildMonthPage(
    'July',
    'Aligned with the start of UK summer school holidays for families travelling with school-age children.'
  ),
  buildMonthPage(
    'August',
    'Peak UK summer holiday packages featuring family suites, direct Saudia flights, and private transfers.'
  ),
  buildMonthPage(
    'September',
    'Serene post-summer crowds and gentle autumn weather make September a favourite for peaceful Tawaf.'
  ),
  buildMonthPage(
    'October',
    'October Half-Term Umrah packages combine mild temperatures with family-friendly 7 & 10-night itineraries.'
  ),
  buildMonthPage(
    'November',
    'Crisp 25°C weather and off-peak airfares make November one of the highest-value months to perform Umrah.'
  ),
  buildMonthPage(
    'December',
    'Spend Winter Break & Christmas school holidays in Makkah and Madinah with guaranteed UK departures.'
  ),

  // Guides Pages
  {
    slug: 'umrah-guide',
    group: 'guides',
    eyebrow: 'Pilgrim Education',
    title: 'Complete Umrah Step-by-Step Guide',
    subtitle: 'Miqat, Ihram, Tawaf, Sa’i & Tahallul explained clearly according to the Sunnah.',
    heroImage: HERO_MAKKAH,
    intro:
      'Perform your Umrah with confidence and serenity. Review the four core pillars of Umrah before you depart the UK.',
    highlights: [
      'Entering Ihram & making the Niyyah before crossing the Miqat',
      'Reciting the Talbiyah throughout your journey to Makkah',
      'Performing 7 circuits of Tawaf around the Holy Kaaba',
      'Praying 2 Rak’ahs at Maqam Ibrahim & drinking Zamzam',
      'Completing 7 laps of Sa’i between Safa and Marwah followed by Halq/Taqsir',
    ],
    sections: [
      {
        heading: '1. Ihram & Miqat Preparation',
        content:
          'Perform Ghusl before boarding or at your hotel, wear the two unstitched white cloths (for men) or modest clothing (for women), and make the intention for Umrah at or before the Miqat.',
      },
      {
        heading: '2. Tawaf & Sa’i Rituals',
        content:
          'Start Tawaf aligned with the Black Stone (Hajar al-Aswad), keeping the Kaaba to your left. After 7 circuits and 2 Rak’ahs, proceed to Al-Mas’a for 7 laps between Safa and Marwah, concluding with shaving or trimming hair.',
      },
    ],
  },
  {
    slug: 'english-speaking-umrah-guide',
    group: 'guides',
    eyebrow: 'Bilingual Scholar Support',
    title: 'English Speaking Umrah Guide',
    subtitle: 'Perform Umrah & Ziyarat with fluent British scholars and ground coordinators.',
    heroImage: PILGRIM_STORY,
    intro:
      'Designed specifically for British-born youth, families, and new Muslims seeking clear, authentic religious instruction in fluent English.',
    highlights: [
      'Guided first-night Umrah ritual walk-through inside Masjid al-Haram',
      'Authentic historical context at Jabal al-Nour, Uhud & Masjid Quba',
      'Dedicated Q&A access with UK scholars throughout your stay',
    ],
    sections: [
      {
        heading: 'Removing Language Barriers',
        content:
          'Our English-speaking guides explain every supplication and Sunnah step calmly so the whole family experiences deep spiritual connection.',
      },
    ],
  },
  {
    slug: 'hajj-guide',
    group: 'guides',
    eyebrow: 'Hajj Preparation',
    title: 'UK Pilgrim Hajj Guide',
    subtitle: 'Everything UK pilgrims need to know about Hajj Tamattu, Nusuk readiness & the 5 Days of Hajj.',
    heroImage: RAMADAN_HARAM,
    intro:
      'Prepare both spiritually and practically for the 8th to 13th of Dhul Hijjah across Mina, Arafat, Muzdalifah, and Makkah.',
    highlights: [
      'Nusuk account verification & UK passport compliance',
      'Step-by-step schedule for Yawm al-Tarwiyah, Arafat & Eid al-Adha',
      'Essential packing & hydration advice for UK travellers',
    ],
    sections: [
      {
        heading: 'The Five Days of Hajj Summarised',
        content:
          'Our pre-Hajj seminars cover every day from entering Ihram on the 8th of Dhul Hijjah to Farewell Tawaf (Tawaf al-Wada) in plain English.',
      },
    ],
  },
  {
    slug: 'first-time-umrah-guide',
    group: 'guides',
    eyebrow: 'Beginner Friendly',
    title: 'First Time Umrah Guide & Packages',
    subtitle: 'Extra hand-holding from UK airport check-in to Rawdah permit booking on Nusuk.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Never travelled to Saudi Arabia before? Our first-timer packages include step-by-step orientation, airport meet-and-greet, and 24/7 WhatsApp assistance.',
    highlights: [
      'Step-by-step Nusuk App setup for Riyad ul-Jannah (Rawdah) slots',
      'Complete UK packing checklist (unscented soap, UK-to-Saudi Type G plugs)',
      'Dedicated Jeddah Arrivals driver holding your family name board',
    ],
    sections: [
      {
        heading: 'Your First Glimpse of the Kaaba',
        content:
          'Our ground coordinators walk you through hotel check-in, Ihram comfort, and the quietest hours to perform your very first Tawaf.',
      },
    ],
    packageFilter: { type: 'category', value: '4-star-umrah' },
  },

  // Services Pages
  {
    slug: 'beat-my-price',
    group: 'services',
    eyebrow: 'Best Value Promise',
    title: 'Beat My Price Guarantee',
    subtitle: 'Found a lower ATOL-protected UK quote for the same hotels and dates? We will match or beat it.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'Thanks to direct wholesale hotel allocations in Makkah and Madinah and consolidated airline contracts, Hidayah Travels guarantees unbeatable UK pricing.',
    highlights: [
      'Applies to any genuine written UK ATOL-protected quote',
      'Same-day price review from our London contracting desk',
      'Zero compromise on hotel room category or flight baggage',
    ],
    sections: [
      {
        heading: 'How to Claim Beat My Price',
        content:
          'Submit your travel dates via our quote form below or call 020 7946 0821 with your written comparison quote and our team will issue an improved proposal.',
      },
    ],
    showContactForm: true,
  },
  {
    slug: 'custom-umrah',
    group: 'services',
    eyebrow: 'Bespoke Pilgrimage Builder',
    title: 'Custom Umrah',
    subtitle: 'Choose your exact nights, UK airport, stopover cities, and room views.',
    heroImage: HERO_MAKKAH,
    intro:
      'Need 5 nights in Madinah and 9 in Makkah, a 3-night Istanbul or Doha stopover, or wheelchair-accessible Kaaba-view suites? We build every detail around your family.',
    highlights: [
      'Any duration from 4 to 30 nights',
      'Optional stopovers in Turkey, Qatar, UAE, or Jordan',
      'Tailored elderly care & wheelchair transport pre-booked',
    ],
    sections: [
      {
        heading: 'Built Around Your Schedule',
        content:
          'Tell us your preferred departure airport and room requirements and receive a customised written quote within hours.',
      },
    ],
    showContactForm: true,
  },
  {
    slug: 'safety-security',
    group: 'services',
    eyebrow: 'Financial & Physical Safeguarding',
    title: 'Safety & Security',
    subtitle: 'ATOL 11842 financial protection, verified hotel contracts, and 24/7 KSA ground support.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Your trust is our sacred responsibility. Every booking is backed by UK Civil Aviation Authority financial protection and vetted Saudi transport partners.',
    highlights: [
      'ATOL Certificate issued immediately on deposit payment',
      'Direct hotel confirmation numbers visible in your booking record',
      'Licensed Saudi Ministry of Hajj & Umrah coaches & drivers',
    ],
    sections: [
      {
        heading: 'Protected From Deposit to Return Flight',
        content:
          'We never work through unverified street brokers. Every flight, hotel, and ground transfer is contracted directly.',
      },
    ],
  },
  {
    slug: 'transportation-services',
    group: 'services',
    eyebrow: 'Seamless KSA Transfers',
    title: 'Transportation Services',
    subtitle: 'Haramain High-Speed Rail, private GMC Yukon SUVs, Hyundai Starias & VIP coaches.',
    heroImage: RAMADAN_HARAM,
    intro:
      'Travel effortlessly between King Abdulaziz Airport (Jeddah), Makkah, Madinah, and historical Ziyarat landmarks without waiting on crowded buses.',
    highlights: [
      'Haramain High-Speed Train (Makkah ↔ Madinah in 2h 20m)',
      'Private air-conditioned GMC Yukon & Hyundai Staria family vehicles',
      'Airport meet-and-greet with luggage porter support',
    ],
    sections: [
      {
        heading: 'Door-to-Door Comfort',
        content:
          'Upgrade any 3★, 4★, or 5★ package to private chauffeur transfers or Business Class Haramain rail tickets.',
      },
    ],
  },
  {
    slug: 'visa-documentation',
    group: 'services',
    eyebrow: 'UK Resident Visa Desk',
    title: 'Visa Documentation Requirements',
    subtitle: 'Fast Saudi Umrah & Tourist eVisa processing for British, EU, and UK BRP/eVisa residents.',
    heroImage: PILGRIM_STORY,
    intro:
      'Our visa specialists handle the entire Saudi digital submission and track passport, vaccination, and biometric steps automatically in your booking record.',
    highlights: [
      'Passport valid for at least 6 months from your return date',
      'Recent white-background digital passport photograph',
      'UK eVisa Share Code for non-British passport holders',
      'ACWY Meningitis vaccination certificate where applicable',
    ],
    sections: [
      {
        heading: 'Automated Reminders & Fast Issuance',
        content:
          'Most British citizen visas are issued within 24–72 hours of document submission. Our system sends automated alerts as soon as documents are needed.',
      },
    ],
  },

  // Legal Pages (Required in Footer & Editable in Admin CMS)
  {
    slug: 'privacy-policy',
    group: 'legal',
    eyebrow: 'UK GDPR & Data Compliance',
    title: 'Privacy Policy',
    subtitle: 'How Hidayah Travels Ltd collects, protects, and processes pilgrim personal data under UK GDPR.',
    heroImage: HERO_MAKKAH,
    intro:
      'Hidayah Travels Ltd is committed to safeguarding your personal and passport data strictly for flight ticketing, hotel reservations, and Saudi Ministry of Hajj/Umrah visa issuance.',
    highlights: [
      'Compliant with the UK General Data Protection Regulation (UK GDPR) & Data Protection Act 2018',
      'Passport and travel data encrypted and never sold to third-party marketers',
      'Right to access, rectify, or request deletion of personal records at any time',
    ],
    sections: [
      {
        heading: '1. Information We Collect',
        content:
          'We collect contact details (name, email, UK phone), travel preferences, and—solely upon booking—passport and vaccination records required by airlines and Saudi visa authorities.',
      },
      {
        heading: '2. Data Retention & Security',
        content:
          'Booking and ATOL compliance records are retained securely as required by UK Civil Aviation Authority regulations. For privacy requests, contact info@hidayahtravels.co.uk.',
      },
    ],
  },
  {
    slug: 'terms-conditions',
    group: 'legal',
    eyebrow: 'Package Travel Regulations 2018',
    title: 'Terms & Conditions',
    subtitle: 'Standard booking terms, payment schedules, and ATOL package conditions for UK pilgrims.',
    heroImage: MAKKAH_HOTEL,
    intro:
      'These Terms & Conditions govern all Hajj, Umrah, flight, hotel, and ground transfer bookings made with Hidayah Travels Ltd (Registered in England & Wales).',
    highlights: [
      'Bookings are confirmed upon deposit receipt and issuance of an ATOL Certificate',
      'Full balance is normally due 45 days prior to departure unless otherwise agreed',
      'Hotel star ratings reflect official Saudi Ministry of Tourism classifications',
    ],
    sections: [
      {
        heading: '1. Pricing & Currency',
        content:
          'All quoted package prices are in Pounds Sterling (£ GBP) per person based on shared occupancy unless a single-room supplement is specified.',
      },
      {
        heading: '2. Visas & Entry Requirements',
        content:
          'While Hidayah Travels processes Umrah/Tourist visas on your behalf, final entry approval remains at the discretion of Saudi Immigration authorities.',
      },
    ],
  },
  {
    slug: 'atol-protection',
    group: 'legal',
    eyebrow: 'Civil Aviation Authority UK',
    title: 'ATOL Financial Protection',
    subtitle: 'Your flight-inclusive pilgrimage packages are financially protected under ATOL Licence 11842.',
    heroImage: MADINAH_NABAWI,
    intro:
      'Many of the flights and flight-inclusive holidays on this website are financially protected by the ATOL scheme. Ask us to confirm what protection applies to your booking.',
    highlights: [
      'Official CAA ATOL Licence: 11842',
      'Protection against insolvency of travel suppliers or airlines',
      'Official ATOL Certificate issued on every qualifying deposit',
    ],
    sections: [
      {
        heading: 'How ATOL Protects You',
        content:
          'If you do not receive an ATOL Certificate then the booking will not be ATOL protected. If you do receive an ATOL Certificate but all parts of your trip are not listed on it, those parts will not be ATOL protected. Please see our booking conditions for more information or visit www.caa.co.uk.',
      },
    ],
  },
  {
    slug: 'cookie-policy',
    group: 'legal',
    eyebrow: 'Website Compliance',
    title: 'Cookie Policy',
    subtitle: 'Information about essential session cookies and authentication storage used on this platform.',
    heroImage: RAMADAN_HARAM,
    intro:
      'Hidayah Travels uses strictly necessary browser storage and authentication tokens to maintain booking sessions, remember selected package filters, and secure customer dashboards.',
    highlights: [
      'Zero intrusive third-party advertising trackers',
      'Essential security tokens for Google Sign-In & Firebase Firestore sessions',
      'Browser cookie controls supported at any time',
    ],
    sections: [
      {
        heading: 'Managing Cookies',
        content:
          'You may clear or block cookies through your browser settings; however, disabling essential authentication cookies will prevent signing into your booking portal.',
      },
    ],
  },
  {
    slug: 'refund-cancellation-policy',
    group: 'legal',
    eyebrow: 'Booking Flexibility',
    title: 'Refund & Cancellation Policy',
    subtitle: 'Clear guidelines on amendments, name changes, cancellations, and airline/hotel supplier terms.',
    heroImage: PILGRIM_STORY,
    intro:
      'We understand plans can change unexpectedly. Our team works closely with airlines and Saudi hotels to minimise cancellation fees wherever permitted.',
    highlights: [
      'Written cancellation requests processed within 24 working hours',
      'Refund timelines for eligible amounts: 7–14 working days',
      'Date & passenger amendments accommodated subject to airline fare rules',
    ],
    sections: [
      {
        heading: 'Supplier & Visa Fees',
        content:
          'Once a Saudi Umrah/Hajj visa is issued or non-refundable airline tickets are ticketed, those direct government/carrier costs cannot be refunded by suppliers. All refundable hotel and land components are returned promptly.',
      },
    ],
  },
  {
    slug: 'complaints-procedure',
    group: 'legal',
    eyebrow: 'Service Resolution',
    title: 'Complaints Procedure',
    subtitle: 'How to raise an urgent in-resort issue or submit post-travel feedback for formal review.',
    heroImage: HERO_MAKKAH,
    intro:
      'If any aspect of your hotel, transfer, or flight falls short while you are in Makkah or Madinah, please contact our 24/7 Saudi ground representative immediately so we can resolve it on the spot.',
    highlights: [
      'Immediate 24/7 resolution while in Saudi Arabia',
      'Written complaints acknowledged within 3 working days',
      'Formal investigation and written response within 28 days',
    ],
    sections: [
      {
        heading: 'Escalation Contact',
        content:
          'Please email customer.care@hidayahtravels.co.uk or info@hidayahtravels.co.uk with your booking reference (e.g. HTV-XXXXXX) and supporting details.',
      },
    ],
  },
];
