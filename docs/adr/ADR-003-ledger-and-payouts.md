# ADR-003: Double-entry ledger, commissions and payouts

- Status: accepted
- Date: 2026-10-28

## Context

Phase 8 needs money movement that can be explained after the fact: what a store
earned on each delivered sub-order, which commission the platform took, what was
withdrawn, and what came back through a return. The demo has no real payment
provider, but the accounting rules still have to survive retries and partial
failures, and the finance screens must never show a total that disagrees with
its history.

## Decision

Every money movement is one `ledger_transactions` row with two or more
`ledger_entries` whose debits equal credits. Account codes are stable strings:
`platform:cash`, `platform:commission_revenue` and
`seller:<organizationId>:payable`. Balances are sums of entries, never stored
columns.

- **Commission** comes from discounted goods only, in basis points, rounded
  down. Shipping is passed to the seller, because the courier cost belongs to
  the seller and the platform did not earn it.
- **Delivery** debits cash and credits the store payable and commission revenue.
  It uses the sub-order id as its reference.
- **Payouts** are requested by a store owner, need at least ৳1,000 and stay
  inside the available balance after requested and approved payouts. Paying one
  debits the store payable and credits cash.
- **Refunds** settle an approved return: a `refunds` row records the amount and
  reversed commission, and a transaction debits the store payable and commission
  revenue and credits cash.
- **Idempotency** comes from a unique `(kind, referenceId)` pair. A retried
  delivery or payout finds the existing transaction and does not post twice. The
  ledger write shares the caller's database transaction with the order, payout
  or refund row.

## Alternatives considered

- **Mutable balance columns on `organizations`.** Simpler reads, but every
  failure path has to repair the number, and there is no way to explain a
  balance that looks wrong.
- **A separate accounts table.** Correct for a large system, but the three
  account families are fixed in this demo and string codes keep queries and
  tests readable.
- **Commission on goods plus shipping.** Easier to state, but charges the
  platform a share of a courier fee it does not receive.

## Consequences

- A store can carry a negative payable after refunding an order it already
  withdrew; the balance is carried forward rather than clamped.
- The finance pages read entries and sum them in JavaScript. At demo volume this
  is fine; a later change should group balances in SQL.
- Payout payment is a manual admin action in the sandbox. There is no bKash,
  Nagad or bank API and no settlement export.
- `docs/DATABASE.md` documents the tables and indexes, and
  `packages/domain/src/finance/ledger.test.ts` proves each transaction balances.
