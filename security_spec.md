# Security Specification: Aqdas Travel Firestore Rules

## 1. Data Invariants
1. **Packages (`packages/{packageId}`)**: Publicly readable catalog items. Only admins can create, delete, or arbitrarily edit packages. Signed-in verified users can only decrement `availableSlots` by 1 and increment `bookedSlots` by 1 when atomically creating a matching booking document in the same batch.
2. **Site Content & Navigation (`siteContent/{sectionKey}`, `navigation/{menuId}`)**: Publicly readable CMS sections and menu trees. Only `isAdmin()` can create, update, or delete.
3. **Quotes (`quotes/{quoteId}`)**: Visitors can submit a quote inquiry (`create`) with strict schema/size validation, `status == 'New'`, and `createdAt == request.time`. Only `isAdmin()` or the authenticated quote owner (`userId == request.auth.uid`) can `get`/`list` quotes; only `isAdmin()` can `update`/`delete`.
4. **Bookings (`bookings/{bookingId}`)**: Authenticated & email-verified users (`request.auth.token.email_verified == true`) can create a booking with `userId == request.auth.uid`, referencing an existing active `packageId`, `bookingStatus == 'Inquiry Received'`, and `createdAt == request.time`. Users can read/list only their own bookings (`resource.data.userId == request.auth.uid`); admins can read/list/update/delete all bookings. Users cannot mutate `bookingStatus` or `totalAmountGbp` directly except updating `paidAmountGbp`/`paymentStatus` when recording a payment or toggling `passportSubmitted`/`vaccineSubmitted` before terminal `Completed`/`Cancelled` states.
5. **Payments (`payments/{paymentId}`)**: Owned by `userId == request.auth.uid`, referencing an existing booking owned by the same user. Immutable after creation (except admin).
6. **Notifications (`notifications/{notificationId}`)**: Automated travel & visa reminders readable/listable only by `resource.data.userId == request.auth.uid` or `isAdmin()`. Users may only update the `read` boolean on their own notifications.
7. **Admin Notifications (`adminNotifications/{notifId}`)**: Strictly readable/updatable/deletable by `isAdmin()`. Validated creation allowed when a quote or booking is submitted.
8. **Admin Settings & Admins (`adminSettings/{settingId}`, `admins/{uid}`)**: Strictly `isAdmin()` only for all operations.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Booking Creation**: `{ userId: 'attacker', packageId: 'pkg1', ... }` with `auth == null` -> DENIED.
2. **Identity Spoofing on Booking**: Signed in as `userA`, create booking with `userId: 'userB'` -> DENIED.
3. **Shadow Field Injection on Booking**: Valid booking + `isAdmin: true` or `discountOverride: 9999` -> DENIED by `hasOnly()`.
4. **Orphaned Booking**: Booking referencing non-existent `packageId: 'non_existent'` -> DENIED by `exists()`.
5. **Client Timestamp Forgery**: Creating booking with `createdAt: '2020-01-01T00:00:00Z'` instead of `request.time` -> DENIED.
6. **Status Shortcutting by Customer**: Customer updating their booking `bookingStatus` from `'Inquiry Received'` to `'Confirmed'` -> DENIED by `affectedKeys().hasOnly()`.
7. **Terminal State Tampering**: Customer modifying a booking whose `bookingStatus` is `'Completed'` or `'Cancelled'` -> DENIED.
8. **Cross-User Booking List**: Signed in as `userA`, querying `bookings` without `where('userId', '==', 'userA')` -> DENIED by `allow list`.
9. **PII Leak on Quotes**: Unauthenticated or non-admin user attempting `get` or `list` on `/quotes` -> DENIED.
10. **Admin Settings Tampering**: Regular signed-in user attempting `get` or `update` on `/adminSettings/security` -> DENIED.
11. **Path ID Poisoning**: Creating package or booking with 200-char or invalid-char ID `../../etc/passwd` -> DENIED by `isValidId()`.
12. **Unverified Email Spoof**: Signed in with `email: 'shafiq.rehman31@gmail.com'` and `email_verified: false` attempting admin write -> DENIED.
