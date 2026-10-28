'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { auditSeller, isUniqueViolation, parseOptionalDate, toMinor } from './actionHelpers';
import { kycSchema, promotionSchema, storeSchema } from './inputs';
import { requireSellerAction } from './session';

function fail(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

/** Saves the storefront identity, announcement and policies in both languages. */
export async function saveStoreAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/store');
  const parsed = storeSchema.safeParse({
    name: formData.get('name'),
    announcementEn: formData.get('announcementEn') ?? '',
    announcementBn: formData.get('announcementBn') ?? '',
    aboutEn: formData.get('aboutEn') ?? '',
    aboutBn: formData.get('aboutBn') ?? '',
    returnPolicyEn: formData.get('returnPolicyEn') ?? '',
    returnPolicyBn: formData.get('returnPolicyBn') ?? '',
    shippingPolicyEn: formData.get('shippingPolicyEn') ?? '',
    shippingPolicyBn: formData.get('shippingPolicyBn') ?? '',
    accent: formData.get('accent'),
    coverTone: formData.get('coverTone'),
  });
  if (!parsed.success) fail('/seller/store', 'invalid');

  try {
    await getPrisma().organization.update({
      where: { id: access.organizationId },
      data: parsed.data,
    });
    await auditSeller(access, 'seller.store.updated', 'organization', access.organizationId);
    revalidatePath('/seller/store');
    revalidatePath(`/store/${access.organizationSlug}`);
  } catch {
    fail('/seller/store', 'failed');
  }

  redirect('/seller/store?saved=1');
}

/** Submits business details and moves KYC back to pending review. */
export async function submitKycAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/store');
  const parsed = kycSchema.safeParse({
    legalName: formData.get('legalName'),
    businessType: formData.get('businessType'),
    tradeLicense: formData.get('tradeLicense'),
    payoutPhone: formData.get('payoutPhone'),
    district: formData.get('district'),
  });
  if (!parsed.success) fail('/seller/store', 'invalid');

  try {
    await getPrisma().organization.update({
      where: { id: access.organizationId },
      data: {
        ...parsed.data,
        kycStatus: 'pending',
        status: 'pending',
        kycSubmittedAt: new Date(),
        kycReviewedAt: null,
        kycNote: null,
      },
    });
    await auditSeller(access, 'seller.kyc.submitted', 'organization', access.organizationId);
    revalidatePath('/seller/store');
    revalidatePath('/seller');
  } catch {
    fail('/seller/store', 'failed');
  }

  redirect('/seller/store?kyc=submitted');
}

/** Creates or updates one store-scoped coupon. */
export async function savePromotionAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/promotions');
  const parsed = promotionSchema.safeParse({
    code: formData.get('code'),
    type: formData.get('type'),
    value: formData.get('value') ?? '0',
    minSubtotal: formData.get('minSubtotal') ?? '0',
    endsAt: formData.get('endsAt') ?? '',
    active: formData.get('active') ?? '',
  });
  if (!parsed.success) fail('/seller/promotions', 'invalid');

  const { code, type, value, minSubtotal, endsAt, active } = parsed.data;
  if (type === 'percent' && value > 100) fail('/seller/promotions', 'invalid');
  const endsAtDate = parseOptionalDate(endsAt);
  if (endsAt && !endsAtDate) fail('/seller/promotions', 'invalid');

  const prisma = getPrisma();
  const existing = await prisma.coupon.findUnique({
    where: { code },
    select: { id: true, organizationId: true },
  });
  if (existing && existing.organizationId !== access.organizationId) {
    fail('/seller/promotions', 'conflict');
  }

  try {
    const data = {
      type,
      value: type === 'fixed' ? toMinor(value) : Math.round(value),
      scope: 'vendor',
      organizationId: access.organizationId,
      minSubtotalMinor: toMinor(minSubtotal),
      endsAt: endsAtDate,
      active,
    };

    if (existing) {
      await prisma.coupon.update({ where: { id: existing.id }, data });
    } else {
      await prisma.coupon.create({
        data: { id: randomUUID(), code, ...data },
      });
    }

    await auditSeller(access, 'seller.promotion.saved', 'coupon', existing?.id ?? code, {
      code,
      type,
      active,
    });
    revalidatePath('/seller/promotions');
    revalidatePath('/catalog');
  } catch (error) {
    if (isUniqueViolation(error)) fail('/seller/promotions', 'conflict');
    fail('/seller/promotions', 'failed');
  }

  redirect('/seller/promotions?saved=1');
}

/** Stops or restarts one store coupon without deleting its history. */
export async function togglePromotionAction(formData: FormData): Promise<void> {
  const access = await requireSellerAction('/seller/promotions');
  const id = String(formData.get('promotionId') ?? '');
  if (!id) fail('/seller/promotions', 'invalid');

  const coupon = await getPrisma().coupon.findFirst({
    where: { id, organizationId: access.organizationId },
    select: { id: true, active: true },
  });
  if (!coupon) fail('/seller/promotions', 'invalid');

  await getPrisma().coupon.update({
    where: { id: coupon.id },
    data: { active: !coupon.active },
  });
  await auditSeller(access, 'seller.promotion.toggled', 'coupon', coupon.id, {
    active: !coupon.active,
  });
  revalidatePath('/seller/promotions');
  redirect('/seller/promotions?toggled=1');
}
