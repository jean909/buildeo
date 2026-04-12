-- CreateTable
CREATE TABLE "SearchAlertSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "filtersQuery" VARCHAR(2048),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchAlertSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SearchAlertSignup_email_key" ON "SearchAlertSignup"("email");
