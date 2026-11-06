-- Guest checkout: an order may belong to no account, identified by its email and phone.
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL,
ADD COLUMN "orderCode" TEXT,
ADD COLUMN "guestEmail" TEXT,
ADD COLUMN "guestPhone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderCode_key" ON "orders"("orderCode");

-- CreateIndex
CREATE INDEX "orders_guestEmail_idx" ON "orders"("guestEmail");
