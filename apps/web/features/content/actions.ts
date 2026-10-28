'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma } from '../../generated/prisma/client';
import { getPrisma } from '../../lib/prisma';
import { adminFail, auditAdmin, requireAdmin } from '../admin/guard';
import { contentSchema, restoreVersionSchema, snapshotSchema } from './inputs';
import type { ContentSnapshot } from './contentTypes';
import { publishDateToInstant } from './urls';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

function snapshotOf(input: {
  titleEn: string;
  titleBn: string;
  excerptEn: string | null;
  excerptBn: string | null;
  bodyEn: string;
  bodyBn: string;
  seoTitleEn: string | null;
  seoTitleBn: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionBn: string | null;
}): ContentSnapshot {
  return {
    titleEn: input.titleEn,
    titleBn: input.titleBn,
    excerptEn: input.excerptEn,
    excerptBn: input.excerptBn,
    bodyEn: input.bodyEn,
    bodyBn: input.bodyBn,
    seoTitleEn: input.seoTitleEn,
    seoTitleBn: input.seoTitleBn,
    seoDescriptionEn: input.seoDescriptionEn,
    seoDescriptionBn: input.seoDescriptionBn,
  };
}

/** Creates or updates one CMS entry and appends a version snapshot. */
export async function saveContentAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', '/admin/content');
  const parsed = contentSchema.safeParse({
    id: formData.get('id'),
    kind: formData.get('kind'),
    slug: formData.get('slug'),
    titleEn: formData.get('titleEn'),
    titleBn: formData.get('titleBn'),
    excerptEn: formData.get('excerptEn'),
    excerptBn: formData.get('excerptBn'),
    bodyEn: formData.get('bodyEn'),
    bodyBn: formData.get('bodyBn'),
    seoTitleEn: formData.get('seoTitleEn'),
    seoTitleBn: formData.get('seoTitleBn'),
    seoDescriptionEn: formData.get('seoDescriptionEn'),
    seoDescriptionBn: formData.get('seoDescriptionBn'),
    status: formData.get('status'),
    publishDate: formData.get('publishDate'),
  });
  if (!parsed.success) adminFail('/admin/content', 'invalid');

  const input = parsed.data;
  const publishAt =
    input.status === 'scheduled'
      ? publishDateToInstant(input.publishDate ?? null)
      : input.status === 'published'
        ? new Date()
        : null;
  if (input.status === 'scheduled' && !publishAt) adminFail('/admin/content', 'invalid');

  const snapshot = snapshotOf(input);
  const prisma = getPrisma();
  const existing = input.id
    ? await prisma.cmsEntry.findUnique({ where: { id: input.id }, select: { id: true } })
    : null;
  if (input.id && !existing) adminFail('/admin/content', 'invalid');

  const savedId = existing?.id ?? randomUUID();
  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        kind: input.kind,
        slug: input.slug,
        ...snapshot,
        status: input.status,
        publishAt,
      };
      if (existing) {
        await tx.cmsEntry.update({ where: { id: existing.id }, data });
      } else {
        await tx.cmsEntry.create({
          data: { id: savedId, ...data, authorUserId: viewer.id },
        });
      }
      const last = await tx.cmsVersion.aggregate({
        where: { entryId: savedId },
        _max: { version: true },
      });
      await tx.cmsVersion.create({
        data: {
          id: randomUUID(),
          entryId: savedId,
          version: (last._max.version ?? 0) + 1,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          note: existing ? 'Saved from editor' : 'Created',
          authorUserId: viewer.id,
        },
      });
    });
  } catch (error) {
    if (isUniqueViolation(error)) adminFail('/admin/content', 'conflict');
    adminFail('/admin/content', 'failed');
  }

  await auditAdmin(viewer, existing ? 'cms.updated' : 'cms.created', 'cmsEntry', savedId, {
    kind: input.kind,
    status: input.status,
  });
  revalidatePath('/admin/content');
  revalidatePath('/help');
  revalidatePath('/help/[slug]', 'page');
  revalidatePath('/journal');
  revalidatePath('/journal/[slug]', 'page');
  revalidatePath('/pages/[slug]', 'page');
  redirect(`/admin/content/${savedId}?saved=1`);
}

/** Restores a previous snapshot as a new version, keeping the history intact. */
export async function restoreContentVersionAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', '/admin/content');
  const parsed = restoreVersionSchema.safeParse({ versionId: formData.get('versionId') });
  if (!parsed.success) adminFail('/admin/content', 'invalid');

  const version = await getPrisma().cmsVersion.findUnique({
    where: { id: parsed.data.versionId },
    include: { entry: { select: { id: true, kind: true, slug: true } } },
  });
  if (!version) adminFail('/admin/content', 'invalid');

  const snapshot = snapshotSchema.safeParse(version.snapshot);
  if (!snapshot.success) adminFail(`/admin/content/${version.entry.id}`, 'failed');

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    await tx.cmsEntry.update({
      where: { id: version.entry.id },
      data: snapshot.data,
    });
    const last = await tx.cmsVersion.aggregate({
      where: { entryId: version.entry.id },
      _max: { version: true },
    });
    await tx.cmsVersion.create({
      data: {
        id: randomUUID(),
        entryId: version.entry.id,
        version: (last._max.version ?? 0) + 1,
        snapshot: snapshot.data as unknown as Prisma.InputJsonValue,
        note: `Restored from version ${version.version}`,
        authorUserId: viewer.id,
      },
    });
  });

  await auditAdmin(viewer, 'cms.version.restored', 'cmsEntry', version.entry.id, {
    fromVersion: version.version,
  });
  revalidatePath(`/admin/content/${version.entry.id}`);
  revalidatePath('/help');
  revalidatePath('/help/[slug]', 'page');
  revalidatePath('/journal');
  revalidatePath('/journal/[slug]', 'page');
  revalidatePath('/pages/[slug]', 'page');
  redirect(`/admin/content/${version.entry.id}?restored=1`);
}
