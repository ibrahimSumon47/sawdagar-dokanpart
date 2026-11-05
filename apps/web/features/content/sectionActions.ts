'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { adminFail, auditAdmin, requireAdmin } from '../admin/guard';
import {
  restoreSectionVersionSchema,
  sectionOrderSchema,
  sectionSchema,
  sectionSnapshotSchema,
} from './sectionInputs';
import type { SectionSnapshot } from './sectionTypes';
import { appendSectionVersion } from './sectionVersions';
import { publishDateToInstant } from './urls';

const CMS_HREF = '/admin/cms';

function snapshotOf(input: SectionSnapshot): SectionSnapshot {
  return {
    titleEn: input.titleEn,
    titleBn: input.titleBn,
    bodyEn: input.bodyEn,
    bodyBn: input.bodyBn,
    imageUrl: input.imageUrl,
    ctaLabelEn: input.ctaLabelEn,
    ctaLabelBn: input.ctaLabelBn,
    ctaHref: input.ctaHref,
  };
}

/** Creates or updates one homepage section, keeping a version snapshot. */
export async function saveSectionAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', CMS_HREF);
  const parsed = sectionSchema.safeParse({
    id: formData.get('id'),
    kind: formData.get('kind'),
    titleEn: formData.get('titleEn'),
    titleBn: formData.get('titleBn'),
    bodyEn: formData.get('bodyEn'),
    bodyBn: formData.get('bodyBn'),
    imageUrl: formData.get('imageUrl'),
    ctaLabelEn: formData.get('ctaLabelEn'),
    ctaLabelBn: formData.get('ctaLabelBn'),
    ctaHref: formData.get('ctaHref'),
    status: formData.get('status'),
    publishDate: formData.get('publishDate'),
  });
  if (!parsed.success) adminFail(CMS_HREF, 'invalid');

  const input = parsed.data;
  const publishAt =
    input.status === 'scheduled'
      ? publishDateToInstant(input.publishDate ?? null)
      : input.status === 'published'
        ? new Date()
        : null;
  if (input.status === 'scheduled' && !publishAt) adminFail(CMS_HREF, 'invalid');

  const snapshot = snapshotOf(input);
  const prisma = getPrisma();
  const existing = input.id
    ? await prisma.cmsSection.findUnique({ where: { id: input.id }, select: { id: true } })
    : null;
  if (input.id && !existing) adminFail(CMS_HREF, 'invalid');

  const savedId = existing?.id ?? randomUUID();
  await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.cmsSection.update({
        where: { id: existing.id },
        data: { ...snapshot, status: input.status, publishAt },
      });
    } else {
      const last = await tx.cmsSection.aggregate({ _max: { sortOrder: true } });
      await tx.cmsSection.create({
        data: {
          id: savedId,
          kind: input.kind,
          ...snapshot,
          status: input.status,
          publishAt,
          sortOrder: (last._max.sortOrder ?? 0) + 10,
        },
      });
    }
    await appendSectionVersion(
      tx,
      savedId,
      snapshot,
      existing ? 'Saved from editor' : 'Created',
      viewer.id,
    );
  });

  await auditAdmin(
    viewer,
    existing ? 'cms.section.updated' : 'cms.section.created',
    'cmsSection',
    savedId,
    {
      kind: input.kind,
      status: input.status,
    },
  );
  revalidatePath(CMS_HREF);
  revalidatePath('/');
  redirect(`/admin/cms/sections/${savedId}?saved=1`);
}

/** Saves the order chosen by dragging or by the move buttons. */
export async function reorderSectionsAction(
  ids: string[],
): Promise<{ ok: boolean; error?: 'invalid' | 'failed' }> {
  const viewer = await requireAdmin('admin:cms:write', CMS_HREF);
  const parsed = sectionOrderSchema.safeParse({ ids });
  if (!parsed.success) return { ok: false, error: 'invalid' };

  const prisma = getPrisma();
  const known = await prisma.cmsSection.findMany({
    where: { id: { in: parsed.data.ids } },
    select: { id: true },
  });
  if (known.length !== parsed.data.ids.length) return { ok: false, error: 'invalid' };

  try {
    await prisma.$transaction(
      parsed.data.ids.map((id, index) =>
        prisma.cmsSection.update({ where: { id }, data: { sortOrder: (index + 1) * 10 } }),
      ),
    );
  } catch {
    return { ok: false, error: 'failed' };
  }

  await auditAdmin(viewer, 'cms.sections.reordered', 'cmsSection', 'homepage', {
    count: parsed.data.ids.length,
  });
  revalidatePath(CMS_HREF);
  revalidatePath('/');
  return { ok: true };
}

/** Restores a saved snapshot as a new version, keeping the history intact. */
export async function restoreSectionVersionAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', CMS_HREF);
  const parsed = restoreSectionVersionSchema.safeParse({ versionId: formData.get('versionId') });
  if (!parsed.success) adminFail(CMS_HREF, 'invalid');

  const version = await getPrisma().cmsSectionVersion.findUnique({
    where: { id: parsed.data.versionId },
    select: { sectionId: true, version: true, snapshot: true },
  });
  if (!version) adminFail(CMS_HREF, 'invalid');

  const snapshot = sectionSnapshotSchema.safeParse(version.snapshot);
  if (!snapshot.success) adminFail(CMS_HREF, 'failed');

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    await tx.cmsSection.update({ where: { id: version.sectionId }, data: snapshot.data });
    await appendSectionVersion(
      tx,
      version.sectionId,
      snapshot.data,
      `Restored from version ${version.version}`,
      viewer.id,
    );
  });

  await auditAdmin(viewer, 'cms.section.restored', 'cmsSection', version.sectionId, {
    fromVersion: version.version,
  });
  revalidatePath(CMS_HREF);
  revalidatePath('/');
  redirect(`/admin/cms/sections/${version.sectionId}?restored=1`);
}
