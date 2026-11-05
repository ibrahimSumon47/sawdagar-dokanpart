-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "announcementEnabled" BOOLEAN NOT NULL DEFAULT false,
    "announcementEn" TEXT,
    "announcementBn" TEXT,
    "announcementHref" TEXT,
    "seoTitleEn" TEXT,
    "seoTitleBn" TEXT,
    "seoDescriptionEn" TEXT,
    "seoDescriptionBn" TEXT,
    "shippingPolicyEn" TEXT,
    "shippingPolicyBn" TEXT,
    "returnsPolicyEn" TEXT,
    "returnsPolicyBn" TEXT,
    "navigation" JSONB NOT NULL DEFAULT '[]',
    "footerLinks" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedByUserId" TEXT,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings_versions" (
    "id" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_settings_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_versions_settingsId_version_key" ON "site_settings_versions"("settingsId", "version");

-- AddForeignKey
ALTER TABLE "site_settings_versions" ADD CONSTRAINT "site_settings_versions_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "site_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
