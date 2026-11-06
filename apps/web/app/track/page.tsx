import type { Metadata } from 'next';
import { TrackOrderForm } from '../../features/tracking/components/TrackOrderForm';
import { pageLayout } from '../../features/shell/pageLayout';
import { getLocale } from '../../i18n/getLocale';

export const metadata: Metadata = {
  title: 'Track your order',
  description: 'Enter your order code and the phone or email used at checkout.',
};

/** Public order tracker. Any wrong detail returns the same generic failure message. */
export default async function TrackPage() {
  const locale = await getLocale();
  const labels = trackLabels[locale];

  return (
    <main className={`${pageLayout.article} space-y-8`}>
      <header className="space-y-2">
        <h1 className="font-display text-3xl text-ink">{labels.title}</h1>
        <p className="text-sm text-ink-muted">{labels.intro}</p>
      </header>
      <div className="rounded-md border border-line bg-surface p-6">
        <TrackOrderForm labels={labels.form} />
      </div>
    </main>
  );
}

/** Tracker copy for each supported language, keyed by the locale from the request. */
const trackLabels = {
  en: {
    title: 'Track your order',
    intro: 'Enter the order code from your confirmation and the phone or email you used.',
    form: {
      codeLabel: 'Order code',
      contactLabel: 'Phone or email used at checkout',
      submit: 'Track order',
      pending: 'Checking…',
      codeInvalid: 'Enter the order code, for example SD-261105-K7QM.',
      contactInvalid: 'Enter a Bangladeshi phone number or an email address.',
      failed: "We couldn't find an order with those details.",
    },
  },
  bn: {
    title: 'অর্ডার ট্র্যাক করুন',
    intro: 'আপনার নিশ্চিতকরণের অর্ডার কোড এবং চেকআউটের সময় ব্যবহৃত ফোন বা ইমেইল লিখুন।',
    form: {
      codeLabel: 'অর্ডার কোড',
      contactLabel: 'চেকআউটের সময় ব্যবহৃত ফোন বা ইমেইল',
      submit: 'অর্ডার ট্র্যাক করুন',
      pending: 'যাচাই করা হচ্ছে…',
      codeInvalid: 'অর্ডার কোড লিখুন, যেমন SD-261105-K7QM।',
      contactInvalid: 'একটি বাংলাদেশি ফোন নম্বর বা ইমেইল ঠিকানা লিখুন।',
      failed: 'এই তথ্য দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি।',
    },
  },
} as const;
