'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import type { Prisma } from '../../generated/prisma/client';
import { adminFail, auditAdmin, requireAdmin } from '../admin/guard';
import {
  restoreSettingsVersionSchema,
  settingsSchema,
  settingsSnapshotSchema,
  type SettingsInput,
} from './settingsInputs';
import { SETTINGS_CACHE_TAG, SETTINGS_ID } from './settingsQueries';
import type { SettingsSnapshot } from './settingsTypes';
import { appendSettingsVersion } from './settingsVersions';

const SETTINGS_HREF = '/admin/cms/settings';

/** Column values for one save; link lists become JSON. */
function columnsOf(input: SettingsInput) {
  const { navigation, footerLinks, ...fields } = input;
  return {
    ...fields,
    navigation: navigation as unknown as Prisma.InputJsonValue,
    footerLinks: footerLinks as unknown as Prisma.InputJsonValue,
  };
}

function snapshotOf(input: SettingsInput): SettingsSnapshot {
  return {
    ...input,
    navigation: input.navigation.map((link) => ({ ...link })),
    footerLinks: input.footerLinks.map((link) => ({ ...link })),
  };
}

/** Saves the singleton settings row and keeps a version snapshot. */
export async function saveSettingsAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', SETTINGS_HREF);
  const parsed = settingsSchema.safeParse({
    announcementEnabled: formData.get('announcementEnabled'),
    announcementEn: formData.get('announcementEn'),
    announcementBn: formData.get('announcementBn'),
    announcementHref: formData.get('announcementHref'),
    seoTitleEn: formData.get('seoTitleEn'),
    seoTitleBn: formData.get('seoTitleBn'),
    seoDescriptionEn: formData.get('seoDescriptionEn'),
    seoDescriptionBn: formData.get('seoDescriptionBn'),
    shippingPolicyEn: formData.get('shippingPolicyEn'),
    shippingPolicyBn: formData.get('shippingPolicyBn'),
    returnsPolicyEn: formData.get('returnsPolicyEn'),
    returnsPolicyBn: formData.get('returnsPolicyBn'),
    navigation: formData.get('navigation'),
    footerLinks: formData.get('footerLinks'),
  });
  if (!parsed.success) adminFail(SETTINGS_HREF, 'invalid');

  const input = parsed.data;
  const snapshot = snapshotOf(input);
  const prisma = getPrisma();
  const existing = await prisma.siteSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.siteSettings.update({
        where: { id: SETTINGS_ID },
        data: { ...columnsOf(input), updatedByUserId: viewer.id },
      });
    } else {
      await tx.siteSettings.create({
        data: { id: SETTINGS_ID, ...columnsOf(input), updatedByUserId: viewer.id },
      });
    }
    await appendSettingsVersion(
      tx,
      SETTINGS_ID,
      snapshot,
      existing ? 'Saved from editor' : 'Created',
      viewer.id,
    );
  });

  await auditAdmin(
    viewer,
    existing ? 'cms.settings.updated' : 'cms.settings.created',
    'siteSettings',
    SETTINGS_ID,
    {
      announcementEnabled: snapshot.announcementEnabled,
      navigationLinks: snapshot.navigation.length,
      footerLinks: snapshot.footerLinks.length,
    },
  );
  revalidateTag(SETTINGS_CACHE_TAG, { expire: 0 });
  revalidatePath(SETTINGS_HREF);
  revalidatePath('/', 'layout');
  revalidatePath('/policies');
  redirect(`${SETTINGS_HREF}?saved=1`);
}

/** Restores a saved snapshot as a new version, keeping the history intact. */
export async function restoreSettingsVersionAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', SETTINGS_HREF);
  const parsed = restoreSettingsVersionSchema.safeParse({ versionId: formData.get('versionId') });
  if (!parsed.success) adminFail(SETTINGS_HREF, 'invalid');

  const version = await getPrisma().siteSettingsVersion.findUnique({
    where: { id: parsed.data.versionId },
    select: { version: true, snapshot: true },
  });
  if (!version) adminFail(SETTINGS_HREF, 'invalid');

  const snapshot = settingsSnapshotSchema.safeParse(version.snapshot);
  if (!snapshot.success) adminFail(SETTINGS_HREF, 'failed');

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    const data = {
      ...columnsOf(snapshot.data),
      updatedByUserId: viewer.id,
    };
    await tx.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, ...data },
      update: data,
    });
    await appendSettingsVersion(
      tx,
      SETTINGS_ID,
      snapshot.data,
      `Restored from version ${version.version}`,
      viewer.id,
    );
  });

  await auditAdmin(viewer, 'cms.settings.restored', 'siteSettings', SETTINGS_ID, {
    fromVersion: version.version,
  });
  revalidateTag(SETTINGS_CACHE_TAG, { expire: 0 });
  revalidatePath(SETTINGS_HREF);
  revalidatePath('/', 'layout');
  revalidatePath('/policies');
  redirect(`${SETTINGS_HREF}?restored=1`);
}
