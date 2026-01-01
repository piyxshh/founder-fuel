-- CreateTable
CREATE TABLE "ScrapeResult" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScrapeResult_url_idx" ON "ScrapeResult"("url");
