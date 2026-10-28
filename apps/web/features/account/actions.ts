'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { getPrisma } from '../../lib/prisma';
import { recordAuditLog, requestDetails } from '../auth/audit';
import { requireViewer } from '../auth/session';

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .union([
      z.literal(''),
      z
        .string()
        .trim()
        .regex(/^(?:\+8801|01)[3-9]\d{8}$/),
    ])
    .transform((value) => value || null),
  district: z
    .string()
    .trim()
    .max(60)
    .transform((value) => value || null),
  bio: z
    .string()
    .trim()
    .max(280)
    .transform((value) => value || null),
});

export type ProfileState = { status: 'idle' | 'success' | 'invalid' | 'failed' };

/**
 * Validates and saves the signed-in user's basic profile. The session decides
 * whose row is written; no user id is accepted from the form.
 */
export async function updateProfile(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const viewer = await requireViewer('/account');

  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone') ?? '',
    district: formData.get('district') ?? '',
    bio: formData.get('bio') ?? '',
  });

  if (!parsed.success) return { status: 'invalid' };
  const { name, phone, district, bio } = parsed.data;

  try {
    const prisma = getPrisma();
    await prisma.$transaction([
      prisma.user.update({ where: { id: viewer.id }, data: { name } }),
      prisma.profile.upsert({
        where: { userId: viewer.id },
        create: { id: randomUUID(), userId: viewer.id, phone, district, bio },
        update: { phone, district, bio },
      }),
    ]);

    const requestHeaders = await headers();
    const details = requestDetails(requestHeaders);
    await recordAuditLog({
      actorUserId: viewer.id,
      actorEmail: viewer.email,
      action: 'profile.updated',
      targetType: 'user',
      targetId: viewer.id,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
    });

    revalidatePath('/account');
    return { status: 'success' };
  } catch {
    return { status: 'failed' };
  }
}
