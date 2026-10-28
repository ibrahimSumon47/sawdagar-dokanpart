import type { ContentKind } from './contentTypes';

/** 09:00 in Dhaka, the time a scheduled entry becomes visible. */
const DHAKA_OFFSET = '+06:00';

/** Converts a `YYYY-MM-DD` form value into 09:00 Dhaka time. */
export function publishDateToInstant(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T09:00:00${DHAKA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats an instant for a date input in Dhaka local time. */
export function instantToDateInput(value: Date | null): string {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value);
  return parts;
}

/** Public URL of a content entry. */
export function contentHref(kind: ContentKind, slug: string): string {
  if (kind === 'help') return `/help/${slug}`;
  if (kind === 'journal') return `/journal/${slug}`;
  return `/pages/${slug}`;
}

/** Admin editor URL of a content entry. */
export function contentEditHref(id: string): string {
  return `/admin/content/${id}`;
}
