import { Button } from '@sd/ui';
import Link from 'next/link';
import type { Dictionary } from '../../../../i18n';
import { catalogResetHref, type CatalogFilters as Filters } from '../../catalogQuery';

export interface CatalogFiltersProps {
  filters: Filters;
  copy: Dictionary['catalog'];
}

const inputClass =
  'min-h-10 w-full rounded-sm border border-line bg-background px-2.5 text-sm tabular-nums text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Facet form. It is a plain GET form, so every filter remains in the URL. */
export function CatalogFilters({ filters, copy }: CatalogFiltersProps) {
  return (
    <form
      key={`${filters.q}-${filters.category}-${filters.vendor}-${filters.minPrice}-${filters.maxPrice}-${filters.rating}-${filters.inStock}-${filters.sort}`}
      action="/catalog"
      method="get"
      className="space-y-6 rounded-sm border border-line bg-surface p-4"
    >
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
      {filters.vendor ? <input type="hidden" name="vendor" value={filters.vendor} /> : null}

      <fieldset>
        <legend className="text-sm font-semibold text-ink">{copy.price}</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs text-ink-muted">{copy.minPrice}</span>
            <input
              type="number"
              name="minPrice"
              min={0}
              max={10_000_000}
              step={1}
              defaultValue={filters.minPrice ?? ''}
              inputMode="numeric"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-ink-muted">{copy.maxPrice}</span>
            <input
              type="number"
              name="maxPrice"
              min={0}
              max={10_000_000}
              step={1}
              defaultValue={filters.maxPrice ?? ''}
              inputMode="numeric"
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">{copy.rating}</legend>
        <div className="mt-2 space-y-2 text-sm text-ink-muted">
          {[
            { value: '', label: copy.anyRating },
            { value: '4', label: copy.rating4 },
            { value: '4.5', label: copy.rating45 },
          ].map((option) => (
            <label key={option.value} className="flex min-h-9 items-center gap-2">
              <input
                type="radio"
                name="rating"
                value={option.value}
                defaultChecked={
                  option.value === ''
                    ? filters.rating === undefined
                    : Number(option.value) === filters.rating
                }
                className="size-4 accent-accent"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-9 items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="inStock"
          value="1"
          defaultChecked={filters.inStock}
          className="size-4 accent-accent"
        />
        {copy.inStockOnly}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">{copy.sort}</span>
        <select name="sort" defaultValue={filters.sort} className={inputClass}>
          <option value="newest">{copy.sortNewest}</option>
          <option value="price-asc">{copy.sortPriceAsc}</option>
          <option value="price-desc">{copy.sortPriceDesc}</option>
          <option value="rating">{copy.sortRating}</option>
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm">
          {copy.apply}
        </Button>
        <Link
          href={catalogResetHref}
          className="text-sm text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
        >
          {copy.clear}
        </Link>
      </div>
    </form>
  );
}
