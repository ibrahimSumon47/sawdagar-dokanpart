-- CreateTable
CREATE TABLE "cms_sections" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyBn" TEXT NOT NULL,
    "imageUrl" TEXT,
    "ctaLabelEn" TEXT,
    "ctaLabelBn" TEXT,
    "ctaHref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_section_versions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_section_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cms_sections_status_publishAt_idx" ON "cms_sections"("status", "publishAt");

-- CreateIndex
CREATE INDEX "cms_sections_sortOrder_idx" ON "cms_sections"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "cms_section_versions_sectionId_version_key" ON "cms_section_versions"("sectionId", "version");

-- AddForeignKey
ALTER TABLE "cms_section_versions" ADD CONSTRAINT "cms_section_versions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "cms_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
