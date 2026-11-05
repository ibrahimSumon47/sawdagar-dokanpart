-- AlterTable
ALTER TABLE "cms_entries"
ADD COLUMN "coverImageUrl" TEXT,
ADD COLUMN "coverImageAltEn" TEXT,
ADD COLUMN "coverImageAltBn" TEXT,
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "cms_entries_tags_idx" ON "cms_entries" USING GIN ("tags");
