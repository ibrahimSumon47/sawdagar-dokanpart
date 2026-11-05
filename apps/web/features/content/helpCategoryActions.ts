'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { adminFail, auditAdmin, requireAdmin } from '../admin/guard';
import {
  helpCategoryMoveSchema,
  helpCategorySchema,
  helpCategorySnapshotSchema,
  restoreHelpCategoryVersionSchema,
} from './helpCategoryInputs';
import type { HelpCategorySnapshot } from './helpCategoryTypes';
import { appendHelpCategoryVersion } from './helpCategoryVersions';

const HELP_HREF = '/admin/cms/help';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

function snapshotOf(input: HelpCategorySnapshot): HelpCategorySnapshot {
  return {
    slug: input.slug,
    nameEn: input.nameEn,
    nameBn: input.nameBn,
    descriptionEn: input.descriptionEn,
    descriptionBn: input.descriptionBn,
  };
}

function revalidateHelp(): void {
  revalidatePath(HELP_HREF);
  revalidatePath('/admin/cms');
  revalidatePath('/help');
}

/** Creates or updates one Help Center category, keeping a version snapshot. */
export async function saveHelpCategoryAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', HELP_HREF);
  const parsed = helpCategorySchema.safeParse({
    id: formData.get('id'),
    slug: formData.get('slug'),
    nameEn: formData.get('nameEn'),
    nameBn: formData.get('nameBn'),
    descriptionEn: formData.get('descriptionEn'),
    descriptionBn: formData.get('descriptionBn'),
  });
  if (!parsed.success) adminFail(HELP_HREF, 'invalid');

  const input = parsed.data;
  const snapshot = snapshotOf(input);
  const prisma = getPrisma();
  const existing = input.id
    ? await prisma.helpCategory.findUnique({ where: { id: input.id }, select: { id: true } })
    : null;
  if (input.id && !existing) adminFail(HELP_HREF, 'invalid');

  const savedId = existing?.id ?? randomUUID();
  try {
    await prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.helpCategory.update({ where: { id: existing.id }, data: snapshot });
      } else {
        const last = await tx.helpCategory.aggregate({ _max: { sortOrder: true } });
        await tx.helpCategory.create({
          data: { id: savedId, ...snapshot, sortOrder: (last._max.sortOrder ?? 0) + 10 },
        });
      }
      await appendHelpCategoryVersion(
        tx,
        savedId,
        snapshot,
        existing ? 'Saved from editor' : 'Created',
        viewer.id,
      );
    });
  } catch (error) {
    if (isUniqueViolation(error)) adminFail(HELP_HREF, 'conflict');
    adminFail(HELP_HREF, 'failed');
  }

  await auditAdmin(
    viewer,
    existing ? 'cms.helpCategory.updated' : 'cms.helpCategory.created',
    'helpCategory',
    savedId,
    { slug: input.slug },
  );
  revalidateHelp();
  redirect(`${HELP_HREF}/${savedId}?saved=1`);
}

/** Swaps a category with its neighbour in one direction. */
export async function moveHelpCategoryAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', HELP_HREF);
  const parsed = helpCategoryMoveSchema.safeParse({
    id: formData.get('id'),
    direction: formData.get('direction'),
  });
  if (!parsed.success) adminFail(HELP_HREF, 'invalid');

  const prisma = getPrisma();
  const categories = await prisma.helpCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, sortOrder: true },
  });
  const index = categories.findIndex((category) => category.id === parsed.data.id);
  const target = parsed.data.direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= categories.length) {
    adminFail(HELP_HREF, 'invalid');
  }

  const current = categories[index];
  const neighbour = categories[target];
  await prisma.$transaction([
    prisma.helpCategory.update({
      where: { id: current.id },
      data: { sortOrder: neighbour.sortOrder },
    }),
    prisma.helpCategory.update({
      where: { id: neighbour.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  await auditAdmin(viewer, 'cms.helpCategories.reordered', 'helpCategory', 'help', {
    moved: parsed.data.direction,
  });
  revalidateHelp();
}

/** Restores a saved category snapshot as a new version, keeping the history. */
export async function restoreHelpCategoryVersionAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:cms:write', HELP_HREF);
  const parsed = restoreHelpCategoryVersionSchema.safeParse({
    versionId: formData.get('versionId'),
  });
  if (!parsed.success) adminFail(HELP_HREF, 'invalid');

  const version = await getPrisma().helpCategoryVersion.findUnique({
    where: { id: parsed.data.versionId },
    select: { categoryId: true, version: true, snapshot: true },
  });
  if (!version) adminFail(HELP_HREF, 'invalid');

  const snapshot = helpCategorySnapshotSchema.safeParse(version.snapshot);
  if (!snapshot.success) adminFail(HELP_HREF, 'failed');

  await getPrisma().$transaction(async (tx) => {
    await tx.helpCategory.update({ where: { id: version.categoryId }, data: snapshot.data });
    await appendHelpCategoryVersion(
      tx,
      version.categoryId,
      snapshot.data,
      `Restored from version ${version.version}`,
      viewer.id,
    );
  });

  await auditAdmin(viewer, 'cms.helpCategory.restored', 'helpCategory', version.categoryId, {
    fromVersion: version.version,
  });
  revalidateHelp();
  redirect(`${HELP_HREF}/${version.categoryId}?restored=1`);
}
