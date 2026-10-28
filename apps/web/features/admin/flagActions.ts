'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getPrisma } from '../../lib/prisma';
import { adminFail, auditAdmin, requireAdmin } from './guard';

const flagSchema = z.object({
  key: z.string().trim().min(1).max(60),
  enabled: z.enum(['on', 'off']),
});

/** Enables or disables one storefront flag. */
export async function toggleFeatureFlagAction(formData: FormData): Promise<void> {
  const viewer = await requireAdmin('admin:settings:write', '/admin/flags');
  const parsed = flagSchema.safeParse({
    key: formData.get('key'),
    enabled: formData.get('enabled'),
  });
  if (!parsed.success) adminFail('/admin/flags', 'invalid');

  const updated = await getPrisma().featureFlag.updateMany({
    where: { key: parsed.data.key },
    data: { enabled: parsed.data.enabled === 'on', updatedByUserId: viewer.id },
  });
  if (updated.count === 0) adminFail('/admin/flags', 'invalid');

  await auditAdmin(viewer, 'feature_flag.updated', 'featureFlag', parsed.data.key, {
    enabled: parsed.data.enabled,
  });
  revalidatePath('/admin/flags');
  revalidatePath('/', 'layout');
  redirect('/admin/flags?saved=1');
}
