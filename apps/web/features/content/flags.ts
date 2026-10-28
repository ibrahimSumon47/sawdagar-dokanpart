import { DatabaseNotConfiguredError, getPrisma } from '../../lib/prisma';

export interface FeatureFlagRecord {
  key: string;
  labelEn: string;
  labelBn: string;
  descriptionEn: string | null;
  descriptionBn: string | null;
  enabled: boolean;
  updatedAt: Date;
}

/** Defaults keep the public routes usable before the first seed. */
const defaults: Record<string, boolean> = {
  help_center_enabled: true,
  journal_enabled: true,
};

/** Every feature flag, alphabetical by key. */
export async function getFeatureFlags(): Promise<FeatureFlagRecord[]> {
  try {
    return await getPrisma().featureFlag.findMany({ orderBy: { key: 'asc' } });
  } catch (error) {
    // A build without DATABASE_URL must still render the storefront; the seed
    // creates the rows before any public route is used.
    if (error instanceof DatabaseNotConfiguredError) return [];
    throw error;
  }
}

/** Reads one flag, falling back to the seeded default when the row is absent. */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  try {
    const flag = await getPrisma().featureFlag.findUnique({
      where: { key },
      select: { enabled: true },
    });
    return flag?.enabled ?? defaults[key] ?? false;
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return defaults[key] ?? false;
    throw error;
  }
}
