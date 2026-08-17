# EarnET — Watch & Earn prototype

A front-end prototype for an Ethiopian watch-and-earn platform.

## Included
- Email/password sign-up and login UI
- 30-second demo ad timer
- $0.10 simulated reward per completed view
- 100 demo views/day limit
- Dashboard
- Withdrawal UI: Telebirr, CBE, Bank transfer
- $10 minimum / $100 maximum
- Profile and referral UI
- Responsive mobile design

## Important
This is a front-end prototype. It does NOT provide real authentication, advertising verification, or real payments.

For a production service, add:
1. Secure backend authentication
2. PostgreSQL/MySQL database
3. Server-side balance and transaction ledger
4. Real ad-network integration with valid completed-view callbacks
5. Official payment-provider/bank integrations
6. KYC/AML, privacy, terms, fraud prevention and applicable Ethiopian legal/compliance review
7. HTTPS, rate limiting, audit logs and admin controls

Never credit money merely because a browser timer reaches zero. A production system should credit rewards only after the advertising provider confirms a valid completed event.
