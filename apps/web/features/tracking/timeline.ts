/** The steps a package moves through, in display order. */
export const TIMELINE_STEPS = [
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'outForDelivery',
  'delivered',
] as const;

export type TimelineStep = (typeof TIMELINE_STEPS)[number];

/** Terminal states that replace the normal step list. */
export type TerminalState = 'cancelled' | 'returned' | null;

export interface TimelineInput {
  status: string;
  placedAt: Date;
  confirmedAt: Date | null;
  packedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
}

export interface TimelineStepState {
  step: TimelineStep;
  done: boolean;
  /** The date a step was reached, when the database recorded one. */
  at: Date | null;
}

/** Maps a sub-order's stored status to its position in the step list. */
const STATUS_RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  packed: 2,
  shipped: 3,
  delivered: 5,
};

/**
 * Works out which steps are done for one package. The stored status sets the
 * furthest step reached; the timestamps only supply the dates shown beside it.
 * "Out for delivery" has no status of its own in this schema, so it counts as
 * done only once the package is delivered.
 */
export function buildTimeline(input: TimelineInput): {
  terminal: TerminalState;
  steps: TimelineStepState[];
} {
  if (input.status === 'cancelled') {
    return { terminal: 'cancelled', steps: stepsFrom(0, input) };
  }

  const rank = STATUS_RANK[input.status] ?? 0;
  return { terminal: null, steps: stepsFrom(rank, input) };
}

function stepsFrom(rank: number, input: TimelineInput): TimelineStepState[] {
  const dates: Record<TimelineStep, Date | null> = {
    placed: input.placedAt,
    confirmed: input.confirmedAt,
    packed: input.packedAt,
    shipped: input.shippedAt,
    outForDelivery: null,
    delivered: input.deliveredAt,
  };

  return TIMELINE_STEPS.map((step, index) => ({
    step,
    done: index <= rank,
    at: index <= rank ? dates[step] : null,
  }));
}
