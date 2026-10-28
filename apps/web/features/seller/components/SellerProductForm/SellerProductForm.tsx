import { Button } from '@sd/ui';
import type { Dictionary } from '../../../../i18n';
import { saveProductAction } from '../../productActions';
import type { SellerProductRecord } from '../../queries';

export interface SellerCategoryOption {
  id: string;
  nameEn: string;
  nameBn: string;
  parentNameEn: string | null;
}

export interface SellerProductFormProps {
  /** Existing product when editing; omitted when creating. */
  product?: SellerProductRecord;
  categories: readonly SellerCategoryOption[];
  copy: Dictionary['seller'];
}

const toneKeys = [
  ['accent', 'toneAccent'],
  ['secondary', 'toneSecondary'],
  ['highlight', 'toneHighlight'],
  ['ink', 'toneInk'],
] as const;

const fieldClass =
  'mt-1 block w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Create or edit form for one product, without its variants. */
export function SellerProductForm({ product, categories, copy }: SellerProductFormProps) {
  return (
    <form
      action={saveProductAction}
      className="space-y-5 rounded-sm border border-line bg-surface p-5"
    >
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      {product ? <input type="hidden" name="stock" value={product.totalStock} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="titleEn" className="text-xs font-semibold text-ink">
            {copy.titleEn}
          </label>
          <input
            id="titleEn"
            name="titleEn"
            required
            minLength={3}
            maxLength={120}
            defaultValue={product?.titleEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="titleBn" className="text-xs font-semibold text-ink">
            {copy.titleBn}
          </label>
          <input
            id="titleBn"
            name="titleBn"
            required
            maxLength={120}
            defaultValue={product?.titleBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="descriptionEn" className="text-xs font-semibold text-ink">
            {copy.descriptionEn}
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            required
            minLength={20}
            maxLength={2000}
            rows={4}
            defaultValue={product?.descriptionEn ?? ''}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="descriptionBn" className="text-xs font-semibold text-ink">
            {copy.descriptionBn}
          </label>
          <textarea
            id="descriptionBn"
            name="descriptionBn"
            required
            maxLength={2000}
            rows={4}
            defaultValue={product?.descriptionBn ?? ''}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="categoryId" className="text-xs font-semibold text-ink">
            {copy.category}
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ''}
            className={fieldClass}
          >
            <option value="" disabled>
              {copy.category}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parentNameEn ? `${category.parentNameEn} / ` : ''}
                {category.nameEn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="text-xs font-semibold text-ink">
            {copy.price}
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={product ? Math.round(product.priceMinor / 100) : ''}
            className={fieldClass}
          />
        </div>
        {product ? null : (
          <div>
            <label htmlFor="stock" className="text-xs font-semibold text-ink">
              {copy.stock}
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={0}
              className={fieldClass}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="text-xs font-semibold text-ink">
            {copy.status}
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? 'draft'}
            className={fieldClass}
          >
            <option value="draft">{copy.productDraft}</option>
            <option value="active">{copy.productActive}</option>
            <option value="archived">{copy.productArchived}</option>
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="text-xs font-semibold text-ink">
            {copy.tone}
          </label>
          <select id="tone" name="tone" defaultValue="accent" className={fieldClass}>
            {toneKeys.map(([value, key]) => (
              <option key={value} value={value}>
                {copy[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit">{product ? copy.saveProduct : copy.createProduct}</Button>
    </form>
  );
}
