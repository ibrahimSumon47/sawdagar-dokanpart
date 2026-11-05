/** Shared styling for the CMS editor inputs, so every field lines up. */
export const controlClass =
  'mt-1 block min-h-10 w-full rounded-sm border border-line bg-background px-2 py-1.5 text-sm text-ink';

/** Multi-line inputs, taller than a single control. */
export const areaClass = `${controlClass} min-h-40 leading-relaxed`;

/** Label above a field. */
export const labelClass = 'block text-xs font-semibold text-ink';

/** Small explanatory line under a field. */
export const hintClass = 'mt-1 block text-xs font-normal text-ink-muted';
