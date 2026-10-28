# API

## Implemented

Better Auth serves authentication endpoints under `/api/auth/*` through [the route handler](../apps/web/app/api/auth/%5B...all%5D/route.ts). The flows in use are:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/sign-in/email` | Email and password sign-in; used server-side by the demo action and available to future forms |
| `POST /api/auth/sign-out` | Revokes the current session |
| `GET /api/auth/get-session` | Returns the current session and user, or null |

Requests are rate limited with a database-backed counter: 10 sign-in attempts per minute and 30 requests per minute per key. The public demo action accepts only the eight seeded demo emails; it does not accept a role or user id from the client. Next.js Server Actions handle theme, language, profile and sign-in forms; they are page actions, not versioned API endpoints.

The catalog and shop have no HTTP API yet. Listing and product pages query Prisma directly on the server and read filters from validated URL parameters. The shop client calls Server Actions, which validate every id and quantity on the server, resolve the viewer from the session and re-read stock before writing.

## Shop Server Actions

Defined in [actions.ts](../apps/web/features/shop/actions.ts). Every action accepts only ids and quantities, never a price, user id or role.

| Action | Input | Behaviour |
|---|---|---|
| `addCartItem` | `variantId`, `quantity` (1–10) | Creates or reuses the guest cookie cart or user cart; rejects inactive products and quantities above stock; returns the full cart rows |
| `updateCartItem` | `variantId`, `quantity` (1–10) | Sets an exact quantity after a stock check; zero is handled by `removeCartItem` |
| `removeCartItem` | `variantId` | Deletes the row and returns the cart rows; removal still works when a product later becomes inactive |
| `toggleWishlist` | `productId` | Requires a session; adds or removes an active product and enforces the 100-item cap |
| `toggleCompare` | `productId` | Adds or removes one active product in the `sd_compare` cookie, capped at four |
| `clearCompare` | none | Deletes the comparison cookie |
| `applyCartCoupon` | `code` (3–24 letters, digits or hyphens) | Looks up an active coupon, evaluates it against the server-side cart rows, saves the code on the cart and returns the rule; rejects expired, vendor-mismatched and below-minimum codes with a code the drawer translates |
| `clearCartCoupon` | none | Removes the code saved on the current cart |
| `placeOrder` | address id or address fields, `paymentMethod` (`cod` or `mockpay`), notes | Requires a session; re-reads the cart, re-prices shipping and coupons, decrements stock conditionally, creates the order, seller sub-orders, payment, reservation, coupon redemption, confirmation mail and audit row in one transaction |
| `payMockPaymentAction` | `paymentId`, signed `token` form fields | Checks the viewer owns the payment and completes the MockPay attempt, then redirects to the receipt |
| `failMockPaymentAction` | `paymentId`, signed `token` form fields | Marks a pending MockPay attempt as failed without touching reserved stock |

MockPay also exposes `POST /api/payments/mockpay` with JSON `{ paymentId, token }`. The token is an HMAC of the payment id and a 30-minute expiry signed with `BETTER_AUTH_SECRET`; the endpoint returns `{ ok, orderNumber, alreadyPaid }` and is safe to call more than once. It is the gateway callback, not a public completion endpoint without the signed token.

Cart rows include server-side variant prices, stock and vendor details. The client never computes the amount sent to the server, and totals shown in the drawer are an estimate until checkout.

## Review, question and return Server Actions

| Action | Input | Behaviour |
|---|---|---|
| `submitReview` | `orderItemId`, `rating` (1–5), `title`, `body`, up to three `photos` | Requires a session; finds the line by id **and** viewer, requires a delivered sub-order and no existing review, inserts the review and photos, recomputes the product's rating and count in one transaction and writes an audit entry |
| `askQuestion` | `productId`, `body` (10–400 characters) | Requires a session; checks the product is active, limits a user to five questions an hour, then stores the public question |
| `requestReturn` | `orderItemId`, `reason` (fixed set), optional `note` | Requires a session; checks line ownership, delivery and the seven-day `deliveredAt` window on the server before inserting one request per line |

All three accept only ids, enums, text and already-resized image data URLs; ownership, prices and the verified-purchase badge are decided from the session and stored rows. Reviews and questions are visible to everyone; return requests are visible only to their owner until the Seller Center and finance phases add queues.

## Seller Center Server Actions

Defined in [storeActions.ts](../apps/web/features/seller/storeActions.ts), [productActions.ts](../apps/web/features/seller/productActions.ts), [inventoryActions.ts](../apps/web/features/seller/inventoryActions.ts) and [orderActions.ts](../apps/web/features/seller/orderActions.ts). Every action resolves the signed-in membership from the session, requires the owner role and `seller:manage`, and scopes the target row by that store's `organizationId`; no store, user or actor id is accepted from the form.

| Action | Input | Behaviour |
|---|---|---|
| `saveStoreAction` | store name, bilingual announcement, about, return and shipping policies, accent, cover tone | Updates the store's public CMS fields; rejects overlong text with an error flag |
| `submitKycAction` | legal name, business type, trade licence, payout phone, district | Stores the business details, sets KYC and store status to pending and clears the previous review note |
| `savePromotionAction` | code, type (`percent`, `fixed`, `free_shipping`), value, minimum subtotal, end date, active | Creates or updates one coupon owned by the store; rejects a code that belongs to another store |
| `togglePromotionAction` | `promotionId` | Flips the active flag without deleting redemption history |
| `saveProductAction` | product id or fields, bilingual title and description, category, price, stock, tone, status | Creates a product with one default variant or updates an owned product; activation requires store and KYC approval |
| `saveVariantAction` | `variantId`, price, stock | Updates an owned variant and records the stock difference as a correction |
| `adjustStockAction` | `variantId`, signed delta, reason, note | Applies the domain stock rule, writes an `inventory_adjustments` row and refreshes the product total |
| `advanceSubOrderAction` | `subOrderId`, next status, courier and tracking for shipping | Enforces the sub-order state machine; cancelling restores stock and the order closes when every sub-order is delivered or cancelled |
| `answerQuestionAction` | `questionId`, answer body | Answers a question only when its product belongs to the store; publishes the answer on the product page |
| `resolveReturnAction` | `returnRequestId`, approved or rejected, optional note | Decides a return request from this store; refunds wait for the finance phase |

`GET /seller/products/export` returns a private CSV download of every variant in the signed-in owner's store, one row per SKU with product, slug, status, price in poisha and stock. It returns 401 for guests and 403 for accounts without an owner membership.

## Finance Server Actions

Defined in [actions.ts](../apps/web/features/finance/actions.ts) and [refundActions.ts](../apps/web/features/finance/refundActions.ts). Every action resolves the session first: a payout request needs an owner membership in the signed-in store, and a queue decision needs `admin:finance:write`. Amounts, target ids and decisions come from the form, but the balance, payout state and refund eligibility are re-read on the server.

| Action | Input | Behaviour |
|---|---|---|
| `requestPayoutAction` | `amount` in taka, optional `note` | Converts the amount to poisha, requires ৳1,000 and no more than the available balance after in-flight payouts, creates a `requested` payout and audits it |
| `processPayoutAction` | `payoutId`, `decision` (`approve`, `pay`, `reject`) | Allows only the transition the current status permits; paying posts the payout ledger transaction and marks it paid in one database transaction |
| `refundReturnAction` | `returnRequestId` | Requires an approved request with no refund; creates the refund, marks the return `refunded` and posts a transaction that reverses the store's payable and the commission proportionally |

## Not yet implemented

There are no marketplace REST endpoints, OpenAPI document or SDK yet. The [architecture specification](spec/03-architecture.md) proposes a versioned `/api/v1` API with RFC 9457 errors and an OpenAPI document. Document endpoints here as they land.
