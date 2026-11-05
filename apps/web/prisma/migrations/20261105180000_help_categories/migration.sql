-- CreateTable
CREATE TABLE "help_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionBn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_category_versions" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "authorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "help_category_versions_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "cms_entries" ADD COLUMN "helpCategoryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "help_categories_slug_key" ON "help_categories"("slug");

-- CreateIndex
CREATE INDEX "help_categories_sortOrder_idx" ON "help_categories"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "help_category_versions_categoryId_version_key" ON "help_category_versions"("categoryId", "version");

-- CreateIndex
CREATE INDEX "help_category_versions_categoryId_version_idx" ON "help_category_versions"("categoryId", "version");

-- CreateIndex
CREATE INDEX "cms_entries_helpCategoryId_idx" ON "cms_entries"("helpCategoryId");

-- AddForeignKey
ALTER TABLE "help_category_versions" ADD CONSTRAINT "help_category_versions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "help_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_entries" ADD CONSTRAINT "cms_entries_helpCategoryId_fkey" FOREIGN KEY ("helpCategoryId") REFERENCES "help_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
