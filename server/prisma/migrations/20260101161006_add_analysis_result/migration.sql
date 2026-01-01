-- CreateTable
CREATE TABLE "AnalysisResult" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headlineScore" INTEGER NOT NULL,
    "valueScore" INTEGER NOT NULL,
    "ctaScore" INTEGER NOT NULL,
    "trustScore" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisResult_url_idx" ON "AnalysisResult"("url");
