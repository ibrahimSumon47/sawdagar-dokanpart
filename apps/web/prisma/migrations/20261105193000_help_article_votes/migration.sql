-- CreateTable
CREATE TABLE "help_article_votes" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_article_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "help_article_votes_entryId_visitorId_key" ON "help_article_votes"("entryId", "visitorId");

-- CreateIndex
CREATE INDEX "help_article_votes_entryId_helpful_idx" ON "help_article_votes"("entryId", "helpful");

-- AddForeignKey
ALTER TABLE "help_article_votes" ADD CONSTRAINT "help_article_votes_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "cms_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
