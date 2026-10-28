import type { Dictionary } from '../../../../i18n';
import { tokenSwatches } from '../../sampleData';
import { GallerySection } from '../GallerySection';

export interface TokenSectionProps {
  copy: Dictionary['design'];
}

/** Shows every colour token and the three type families in the active theme. */
export function TokenSection({ copy }: TokenSectionProps) {
  return (
    <GallerySection id="tokens" title={copy.tokensTitle} description={copy.tokensDescription}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tokenSwatches.map((token) => (
          <li key={token} className="rounded-sm border border-line bg-surface p-2">
            <span
              aria-hidden="true"
              className="block h-14 rounded-sm border border-line"
              style={{ backgroundColor: `var(--color-${token})` }}
            />
            <span className="mt-2 block text-xs font-medium text-ink">{token}</span>
            <span className="block text-[11px] text-ink-muted">{`--color-${token}`}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-6 rounded-sm border border-line bg-surface p-5 sm:p-7">
        <div>
          <p className="mb-1 text-xs uppercase tracking-widest text-ink-muted">{copy.typeTitle}</p>
          <p className="text-hero font-serif leading-[1.02] tracking-tight">
            {copy.typographyHeadline}
          </p>
        </div>
        <p className="text-title font-serif">{copy.typographyProduct}</p>
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted">{copy.typeDescription}</p>
        <p lang="bn" className="max-w-2xl">
          প্রতিটি দোকান, এক বাজার। বাংলা লেখা ফ্রান্সেসের সঙ্গে নয়, নোটো সান্স বাংলায় পড়া হয়।
        </p>
        <p className="font-serif text-2xl tabular-nums">৳1,25,000</p>
      </div>
    </GallerySection>
  );
}
