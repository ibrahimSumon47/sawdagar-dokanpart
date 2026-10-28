import { Moon, Sun } from 'lucide-react';
import { setTheme } from '../../actions';
import type { Theme } from '../../theme';

export interface ThemeToggleProps {
  /** Theme currently rendered by the server. */
  theme: Theme;
  labels: { useLight: string; useDark: string };
}

/**
 * Sun/moon button that stores the opposite theme in a cookie. It is a plain
 * form submission, so it works before client JavaScript loads.
 */
export function ThemeToggle({ theme, labels }: ThemeToggleProps) {
  const next: Theme = theme === 'light' ? 'dark' : 'light';
  const label = next === 'light' ? labels.useLight : labels.useDark;

  return (
    <form action={setTheme}>
      <input type="hidden" name="theme" value={next} />
      <button
        type="submit"
        aria-label={label}
        title={label}
        className="grid size-11 place-items-center rounded-sm text-ink transition-colors hover:bg-surface hover:text-accent"
      >
        {next === 'dark' ? (
          <Moon aria-hidden="true" className="size-5" />
        ) : (
          <Sun aria-hidden="true" className="size-5" />
        )}
      </button>
    </form>
  );
}
