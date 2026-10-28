-- AlterTable
ALTER TABLE "organizations"
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN "kycStatus" TEXT NOT NULL DEFAULT 'not_started',
  ADD COLUMN "kycSubmittedAt" TIMESTAMP(3),
  ADD COLUMN "kycReviewedAt" TIMESTAMP(3),
  ADD COLUMN "kycNote" TEXT,
  ADD COLUMN "legalName" TEXT,
  ADD COLUMN "businessType" TEXT,
  ADD COLUMN "tradeLicense" TEXT,
  ADD COLUMN "payoutPhone" TEXT,
  ADD COLUMN "accent" TEXT NOT NULL DEFAULT 'accent',
  ADD COLUMN "coverTone" TEXT NOT NULL DEFAULT 'highlight',
  ADD COLUMN "announcementEn" TEXT,
  ADD COLUMN "announcementBn" TEXT,
  ADD COLUMN "aboutEn" TEXT,
  ADD COLUMN "aboutBn" TEXT,
  ADD COLUMN "returnPolicyEn" TEXT,
  ADD COLUMN "returnPolicyBn" TEXT,
  ADD COLUMN "shippingPolicyEn" TEXT,
  ADD COLUMN "shippingPolicyBn" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sub_orders"
  ADD COLUMN "confirmedAt" TIMESTAMP(3),
  ADD COLUMN "packedAt" TIMESTAMP(3),
  ADD COLUMN "shippedAt" TIMESTAMP(3),
  ADD COLUMN "cancelledAt" TIMESTAMP(3),
  ADD COLUMN "courier" TEXT,
  ADD COLUMN "trackingNumber" TEXT;

-- CreateTable
CREATE TABLE "inventory_adjustments" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "stockAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_adjustments_variantId_createdAt_idx" ON "inventory_adjustments"("variantId", "createdAt");

-- AddForeignKey
ALTER TABLE "inventory_adjustments" ADD CONSTRAINT "inventory_adjustments_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
