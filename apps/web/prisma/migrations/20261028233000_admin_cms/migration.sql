-- CreateTable
CREATE TABLE "cms_entries" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "excerptEn" TEXT,
    "excerptBn" TEXT,
    "bodyEn" TEXT NOT NULL,
    "bodyBn" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishAt" TIMESTAMP(3),
    "seoTitleEn" TEXT,
    "seoTitleBn" TEXT,
    "seoDescriptionEn" TEXT,
    "seoDescriptionBn" TEXT,
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_versions" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "key" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionBn" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedByUserId" TEXT,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "cms_entries_kind_slug_key" ON "cms_entries"("kind", "slug");

-- CreateIndex
CREATE INDEX "cms_entries_kind_status_publishAt_idx" ON "cms_entries"("kind", "status", "publishAt");

-- CreateIndex
CREATE INDEX "cms_entries_updatedAt_idx" ON "cms_entries"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cms_versions_entryId_version_key" ON "cms_versions"("entryId", "version");

-- CreateIndex
CREATE INDEX "cms_versions_entryId_version_idx" ON "cms_versions"("entryId", "version");

-- AddForeignKey
ALTER TABLE "cms_versions" ADD CONSTRAINT "cms_versions_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "cms_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
