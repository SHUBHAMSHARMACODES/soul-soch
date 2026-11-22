# Security Specification & Threat Model — Soul & Soch

## 1. Data Invariants
1. **Books (`/books/{bookId}`)**: Publicly readable for the reading platform, but only an email-verified Admin (`7509shubham@gmail.com`) may create, update, or delete books. All URLs (`pdfUrl`, `coverUrl`) must be bounded strings (`<= 1000` chars) and non-javascript schemes. `createdAt` is immutable and equals `request.time` on creation.
2. **Insights (`/insights/{insightId}`)**: Publicly readable weekly wisdom, Bhagavad Gita shlokas, and reading lists; writable solely by verified Admin.
3. **Ad Settings (`/adSettings/{slotId}`)**: Publicly readable slot configurations (`adsense_global`, `slot_banner`, `slot_sidebar`, `slot_reader`) so visitors see active ads; writable solely by verified Admin.
4. **Newsletter Subscribers (`/subscribers/{subscriberId}`)**: Strictly PII-isolated. Public visitors can submit (`create`) a valid email subscription (`email` regex validated, `createdAt == request.time`, strict keys `['email', 'createdAt']`), but CANNOT `get`, `list`, `update`, or `delete` any subscriber record. Only verified Admin can `get`, `list`, or `delete` subscribers.
5. **Admins (`/admins/{adminId}`)**: Cannot be self-assigned. Only the verified root admin (`7509shubham@gmail.com`) can read or manage admin records.

## 2. Adversarial Test Payloads ("Dirty Dozen")
1. **Unauthenticated Book Creation**: Anonymous client attempts `create` on `/books/evil-book` -> `PERMISSION_DENIED`.
2. **Non-Admin Authenticated Book Write**: Random Google user (`user@example.com`) attempts `create`/`update`/`delete` on `/books/bhagavad-gita` -> `PERMISSION_DENIED`.
3. **Email Spoofing Attack**: Token with `email == '7509shubham@gmail.com'` and `email_verified == false` attempts write on `/books/test` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection on Book**: Admin attempts `create` on `/books/new-book` with extra ghost key `isHijacked: true` -> `PERMISSION_DENIED`.
5. **ID Poisoning on Book**: Admin attempts `create` on `/books/` with a 200-char or invalid-char document ID `../../etc` -> `PERMISSION_DENIED`.
6. **Unbounded Summary / Denial-of-Wallet**: Admin attempts `create` on `/books/huge` with 50,000-character `summary` -> `PERMISSION_DENIED`.
7. **Immutable `createdAt` Tampering**: Admin attempts `update` on `/books/bhagavad-gita` modifying `createdAt` -> `PERMISSION_DENIED`.
8. **Subscriber PII Enumeration**: Anonymous or non-admin authenticated user attempts `list` or `get` on `/subscribers` -> `PERMISSION_DENIED`.
9. **Subscriber Malformed Email / Shadow Field**: Anonymous user attempts `create` on `/subscribers/sub1` with `email: "not-an-email"` or extra key `role: "admin"` -> `PERMISSION_DENIED`.
10. **Subscriber Timestamp Forgery**: Anonymous user attempts `create` on `/subscribers/sub1` with forged `createdAt` != `request.time` -> `PERMISSION_DENIED`.
11. **Ad Setting Hijacking**: Non-admin authenticated user attempts `update` on `/adSettings/slot_banner` to redirect `sponsorUrl` -> `PERMISSION_DENIED`.
12. **Self-Assigned Admin Escalation**: Regular user attempts `create` on `/admins/{uid}` with `role: 'admin'` -> `PERMISSION_DENIED`.
