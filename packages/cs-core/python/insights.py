"""Demand insights reference implementation.

This module is the readable definition of the demand signal used by the Seller
Center. The TypeScript port in `src/insights.ts` must produce the same numbers;
`src/insights.test.ts` checks the port against `fixtures/insights.json`, and the
CI reference job runs this file over the same fixtures.

Run over the fixtures:

    python insights.py fixtures/insights.json

Each case is `{ "input": { units30, units90, stock }, "expected": {...} }`.
"""

from __future__ import annotations

import json
import sys
from typing import Any

COVER_CAP_DAYS = 999
TARGET_COVER_DAYS = 45
RISING_BPS = 12_000
FALLING_BPS = 8_000


def classify(units30: int, units90: int) -> tuple[str, int]:
    """Returns the trend label and the 30-day pace in basis points.

    `units30 * 3` is the 30-day rate extrapolated to 90 days, so comparing it
    with `units90` gives a ratio where 10,000 means "same pace as the quarter".
    """
    if units90 == 0:
        return ("new" if units30 > 0 else "idle", 0)
    if units30 == 0:
        return ("stalled", 0)

    trend_bps = units30 * 30_000 // units90
    if trend_bps >= RISING_BPS:
        return ("rising", trend_bps)
    if trend_bps <= FALLING_BPS:
        return ("falling", trend_bps)
    return ("steady", trend_bps)


def demand_signal(units30: int, units90: int, stock: int) -> dict[str, Any]:
    """Builds the demand signal for one product from recent sales and stock."""
    velocity_milli = units30 * 1000 // 30
    signal, trend_bps = classify(units30, units90)

    if units30 == 0:
        days_of_cover = COVER_CAP_DAYS if stock > 0 else 0
    else:
        days_of_cover = min(COVER_CAP_DAYS, stock * 30 // units30)

    # ceil(units30 * 45 / 30) without floating point
    target_units = -(-units30 * TARGET_COVER_DAYS // 30)
    restock_units = max(0, target_units - stock)

    return {
        "velocityMilli": velocity_milli,
        "trendBps": trend_bps,
        "signal": signal,
        "daysOfCover": days_of_cover,
        "restockUnits": restock_units,
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python insights.py <fixtures.json>", file=sys.stderr)
        return 2

    with open(argv[1], encoding="utf-8") as handle:
        cases = json.load(handle)["cases"]

    results = [
        demand_signal(
            int(case["input"]["units30"]),
            int(case["input"]["units90"]),
            int(case["input"]["stock"]),
        )
        for case in cases
    ]
    print(json.dumps(results, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
