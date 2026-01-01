-- CreateTable
CREATE TABLE "RepurposeResult" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "twitterThread" TEXT NOT NULL,
    "linkedinPost" TEXT NOT NULL,
    "newsletter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepurposeResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RepurposeResult_url_idx" ON "RepurposeResult"("url");
