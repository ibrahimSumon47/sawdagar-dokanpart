import { Languages, ShieldCheck, Sprout } from 'lucide-react';

export interface TrustPoint {
  title: string;
  body: string;
}

export interface TrustStripProps {
  points: readonly TrustPoint[];
}

const icons = [ShieldCheck, Languages, Sprout] as const;

/** Three short promises shown under the home hero. */
export function TrustStrip({ points }: TrustStripProps) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
      {points.map((point, index) => {
        const Icon = icons[index % icons.length];
        return (
          <li key={point.title} className="bg-surface p-5">
            <Icon aria-hidden="true" className="size-5 text-accent" />
            <p className="mt-3 text-sm font-semibold text-ink">{point.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{point.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
