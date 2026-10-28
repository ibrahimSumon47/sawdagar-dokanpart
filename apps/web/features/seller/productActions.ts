'use server';

import { skuWithCheckCharacter } from '@sd/cs-core';
import { canSell, slugify } from '@sd/domain';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditSeller, isUniqueViolation, toMinor } from './actionHelpers';
import { productSchema } from './inputs';
import { requireSellerAction } from './session';

async function createUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || 'product';
  for (let suffix = 1; suffix <= 50; suffix += 1) {
    const candidate = suffix === 1 ? root : `${root}-${suffix}`;
    const taken = await getPrisma().product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }
  return `${root}-${randomUUID().slice(0, 6)}`;
}

function fail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

/**
 * Creates a product with one default variant, or updates the fields of an
 * existing product owned by the signed-in store. Activation needs an approved
 * store and KYC because buyers can only see active products.
 */
export async function saveProductAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/products');
  const parsed = productSchema.safeParse({
    productId: formData.get('productId') ?? '',
    titleEn: formData.get('titleEn'),
    titleBn: formData.get('titleBn'),
    descriptionEn: formData.get('descriptionEn'),
    descriptionBn: formData.get('descriptionBn'),
    categoryId: formData.get('categoryId'),
    price: formData.get('price'),
    stock: formData.get('stock') ?? '0',
    tone: formData.get('tone'),
    status: formData.get('status'),
  });
  if (!parsed.success) fail('/seller/products', 'invalid');

  const data = parsed.data;
  const returnPath = data.productId ? `/seller/products/${data.productId}` : '/seller/products';
  const prisma = getPrisma();

  const [category, store] = await Promise.all([
    prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } }),
    prisma.organization.findUnique({
      where: { id: access.organizationId },
      select: { status: true, kycStatus: true },
    }),
  ]);
  if (!category) fail(returnPath, 'invalid');
  if (data.status === 'active' && !canSell(store?.status, store?.kycStatus)) {
    fail(returnPath, 'kyc');
  }

  const fields = {
    titleEn: data.titleEn,
    titleBn: data.titleBn,
    descriptionEn: data.descriptionEn,
    descriptionBn: data.descriptionBn,
    categoryId: data.categoryId,
    priceMinor: toMinor(data.price),
    tone: data.tone,
    status: data.status,
  };

  try {
    if (data.productId) {
      const result = await prisma.product.updateMany({
        where: { id: data.productId, organizationId: access.organizationId },
        data: fields,
      });
      if (result.count === 0) fail(returnPath, 'invalid');
      await auditSeller(access, 'seller.product.updated', 'product', data.productId);
    } else {
      const slug = await createUniqueSlug(data.titleEn);
      const productId = randomUUID();
      await prisma.product.create({
        data: {
          id: productId,
          slug,
          ...fields,
          totalStock: data.stock,
          organizationId: access.organizationId,
          variants: {
            create: {
              id: randomUUID(),
              sku: skuWithCheckCharacter(`SD-${randomUUID().slice(0, 8)}`),
              nameEn: 'Standard',
              nameBn: 'স্ট্যান্ডার্ড',
              priceMinor: toMinor(data.price),
              stock: data.stock,
              isDefault: true,
            },
          },
        },
      });
      await auditSeller(access, 'seller.product.created', 'product', productId);
    }

    revalidatePath('/seller/products');
    revalidatePath('/catalog');
    revalidatePath('/');
  } catch (error) {
    if (isUniqueViolation(error)) fail(returnPath, 'conflict');
    fail(returnPath, 'failed');
  }

  redirect(data.productId ? `${returnPath}?saved=1` : '/seller/products?created=1');
}
