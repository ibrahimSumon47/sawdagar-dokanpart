import type { Metadata } from 'next';
import { getPublicSettings } from '../../features/content/settingsQueries';
import { pageLayout } from '../../features/shell/pageLayout';
import { getDictionary } from '../../i18n';
import { getLocale } from '../../i18n/getLocale';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.policies.title, description: copy.policies.description };
}

/** Shipping and return text, both edited in site settings. */
export default async function PoliciesPage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);
  const settings = await getPublicSettings();
  const bangla = locale === 'bn';
  const pick = (bn: string | null, en: string | null) => (bangla ? bn || en : en || bn);
  const sections = [
    {
      title: copy.policies.shippingTitle,
      body: pick(settings.shippingPolicyBn, settings.shippingPolicyEn),
    },
    {
      title: copy.policies.returnsTitle,
      body: pick(settings.returnsPolicyBn, settings.returnsPolicyEn),
    },
  ];

  return (
    <div className={pageLayout.article}>
      <h1 className="font-serif text-title leading-tight text-ink">{copy.policies.title}</h1>
      <p className="mt-2 text-ink-muted">{copy.policies.description}</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-xl text-ink">{section.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
              {section.body ?? copy.policies.empty}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
