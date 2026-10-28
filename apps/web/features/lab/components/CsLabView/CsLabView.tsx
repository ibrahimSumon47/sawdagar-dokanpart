import { getSearchCore } from '@sd/cs-core';
import { ButtonLink } from '@sd/ui';
import type { Dictionary, Locale } from '../../../../i18n';
import { insightRows, scoreRows, settlementRun, settlementRows, skuRows } from '../../labData';
import { CsModuleSection } from '../CsModuleSection';
import { InsightTable } from '../InsightTable';
import { ScoreTable } from '../ScoreTable';
import { SettlementTable } from '../SettlementTable';
import { SkuTable } from '../SkuTable';

export interface CsLabViewProps {
  copy: Dictionary['csLab'];
  locale: Locale;
}

/** Shows each CS core module with real output from this server process. */
export function CsLabView({ copy, locale }: CsLabViewProps) {
  const engine = getSearchCore() ? copy.webassembly : copy.typescript;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
        <h1 className="mt-3 font-serif text-title leading-tight text-ink">{copy.title}</h1>
        <p className="mt-3 text-ink-muted">{copy.description}</p>
        <div className="mt-5">
          <ButtonLink href="/catalog" variant="secondary" size="sm">
            {copy.catalogLink}
          </ButtonLink>
        </div>
      </header>

      <div className="mt-8 space-y-5">
        <CsModuleSection
          title={copy.searchTitle}
          body={copy.searchBody}
          meta={`${copy.engine}: ${engine} · ${copy.score}`}
        >
          <ScoreTable rows={scoreRows} copy={copy} />
        </CsModuleSection>

        <CsModuleSection
          title={copy.skuTitle}
          body={copy.skuBody}
          meta={`${copy.engine}: ${engine} · ${copy.check}`}
        >
          <SkuTable rows={skuRows} copy={copy} />
        </CsModuleSection>

        <CsModuleSection
          title={copy.insightsTitle}
          body={copy.insightsBody}
          meta={`${copy.engine}: Python · ${copy.signal}`}
        >
          <InsightTable rows={insightRows} copy={copy} />
        </CsModuleSection>

        <CsModuleSection
          title={copy.settlementTitle}
          body={copy.settlementBody}
          meta={`${copy.engine}: Java · ${copy.paid}`}
        >
          <SettlementTable rows={settlementRows} run={settlementRun} copy={copy} locale={locale} />
        </CsModuleSection>
      </div>
    </div>
  );
}
