# ADR-008: Integer poisha for money, with pure ledger builders

- Status: accepted
- Date: 2026-10-30

## Context

Prices, discounts, shipping, commission, refunds and payouts all have to add up to the same total in the cart, the order, the invoice and the ledger. Floating point would introduce fractions of a poisha, and formatting Taka with Bengali numerals is a display concern that must not leak into storage or arithmetic. The marketplace also needs percentage commission, fixed and free-shipping coupons, and a ledger that proves every transaction balances.

## Decision

- Store every amount as an integer number of poisha in a `*Minor` column, and keep exchange rates out of the model. A Taka amount is converted once at an input boundary (for example an admin payout form) and formatted once at render time.
- Format with `Intl.NumberFormat` for `en-GB` or `bn-BD`, so English shows Western digits and Bangla shows Bengali digits and the taka sign. Stored values never contain separators or symbols.
- Keep percentage rates in basis points. Commission is rounded down once per amount, and the rounding rule lives beside the calculation so a statement, a ledger entry and a test cannot disagree.
- Put pricing, coupon evaluation, shipping and the ledger entry builders in `@sd/domain` as pure functions. [`ledger.ts`](../../packages/domain/src/finance/ledger.ts) returns balanced debit and credit entries; the application writes them inside the caller's database transaction.
- Never accept a price, total or discount from the browser. The server re-reads variants and coupons and recomputes every amount before writing an order.

## Alternatives considered

1. **Floating point Taka.** Rejected: repeated percentage discounts and refunds produce values such as `3199.9999999999995`, and equality checks in tests become meaningless.
2. **PostgreSQL `numeric` with a decimal library.** Correct for arbitrary precision, but adds a serialization boundary and a dependency for a currency with a fixed two-decimal minor unit.
3. **A third-party money library.** Viable, but the operations needed here are addition, a rounded percentage and an allocation of a discount across order lines; a small tested helper is easier to audit.
4. **Storing formatted strings.** Rejected: sorting, summing and refunding would require parsing display text.

## Consequences

- There is no multi-currency support and no exchange-rate field; the demo prices in Taka only.
- A percentage of a very small amount can round to zero poisha. That is intentional and covered by the domain tests.
- Ledger balances can be negative after a refund of an already-paid order; the sign is part of the meaning and must be preserved, including a `-৳0` display that the formatter normalises.
- Finance pages sum ledger entries in JavaScript at demo volume. A later pass should aggregate in SQL, but the stored representation does not need to change.
