import { cn } from '@sd/ui';
import type { Locale } from '../../../../i18n';
import { setLocale } from '../../actions';

export interface LocaleSwitcherProps {
  /** Locale currently rendered by the server. */
  locale: Locale;
  /** Localised accessible name for the control, for example "Language". */
  label: string;
}

const options: readonly { value: Locale; text: string; lang: string }[] = [
  { value: 'en', text: 'EN', lang: 'en' },
  { value: 'bn', text: 'বাংলা', lang: 'bn' },
];

/** Two-state language control that stores the choice in a cookie. */
export function LocaleSwitcher({ locale, label }: LocaleSwitcherProps) {
  return (
    <form
      action={setLocale}
      aria-label={label}
      className="flex items-center gap-0.5 rounded-sm border border-line p-0.5"
    >
      {options.map((option) => {
        const active = option.value === locale;
        return (
          <button
            key={option.value}
            type="submit"
            name="locale"
            value={option.value}
            lang={option.lang}
            aria-pressed={active}
            className={cn(
              'min-h-11 rounded-sm px-2.5 text-xs font-semibold transition-colors',
              active ? 'bg-accent text-accent-contrast' : 'text-ink-muted hover:text-accent',
            )}
          >
            {option.text}
          </button>
        );
      })}
    </form>
  );
}
