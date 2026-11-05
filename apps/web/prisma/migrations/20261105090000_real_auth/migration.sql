-- Real registration: phone and terms on the user, plus seller applications.
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

CREATE TABLE "seller_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seller_applications_userId_key" ON "seller_applications"("userId");
CREATE INDEX "seller_applications_status_createdAt_idx" ON "seller_applications"("status", "createdAt");

ALTER TABLE "seller_applications"
  ADD CONSTRAINT "seller_applications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
