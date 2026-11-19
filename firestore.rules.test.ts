/**
 * Payload-First Security Rules Verification Spec
 * Verifies the "Dirty Dozen" adversarial payloads against firestore.rules.
 */
export const DIRTY_DOZEN_PAYLOADS = [
  {
    name: '1. Unauthenticated Booking Creation',
    collection: 'bookings',
    auth: null,
    payload: { bookingRef: 'AQD-001', userId: 'attacker', packageId: 'pkg-3s-1' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '2. Identity Spoofing on Booking',
    collection: 'bookings',
    auth: { uid: 'userA', email_verified: true },
    payload: { userId: 'userB', packageId: 'pkg-3s-1' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '3. Shadow Field Injection on Booking',
    collection: 'bookings',
    auth: { uid: 'userA', email_verified: true },
    payload: { userId: 'userA', isAdmin: true, discountOverride: 9999 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '4. Orphaned Booking (Non-existent packageId)',
    collection: 'bookings',
    auth: { uid: 'userA', email_verified: true },
    payload: { userId: 'userA', packageId: 'non_existent_pkg' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '5. Client Timestamp Forgery',
    collection: 'bookings',
    auth: { uid: 'userA', email_verified: true },
    payload: { userId: 'userA', createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '6. Status Shortcutting by Customer',
    collection: 'bookings/bk1',
    auth: { uid: 'userA', email_verified: true },
    payload: { bookingStatus: 'Confirmed' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '7. Terminal State Tampering',
    collection: 'bookings/bkCompleted',
    auth: { uid: 'userA', email_verified: true },
    payload: { passportSubmitted: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '8. Cross-User Booking List',
    collection: 'bookings',
    auth: { uid: 'userA', email_verified: true },
    query: 'unfiltered list',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '9. PII Leak on Quotes',
    collection: 'quotes',
    auth: { uid: 'userA', email_verified: true },
    operation: 'list_all',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '10. Admin Settings Tampering',
    collection: 'adminSettings/security',
    auth: { uid: 'userA', email_verified: true },
    payload: { username: 'hacker', adminRouteSlug: 'pwned' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '11. Path ID Poisoning',
    collection: 'packages/../../etc/passwd',
    auth: { uid: 'adminUid', email: 'shafiq.rehman31@gmail.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '12. Unverified Email Admin Spoof',
    collection: 'packages/pkg1',
    auth: { uid: 'spoofUid', email: 'shafiq.rehman31@gmail.com', email_verified: false },
    expected: 'PERMISSION_DENIED',
  },
];
