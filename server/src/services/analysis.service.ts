// File: server/src/services/analysis.service.ts
// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE ANALYSIS SERVICE
// Uses LangChain + Google Gemini to analyze landing pages
// ═══════════════════════════════════════════════════════════════════════════════

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { prisma } from "../lib/prisma.js";
import { scraperService } from "./scraper.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalysisScores {
    headlineScore: number;
    valueScore: number;
    ctaScore: number;
    trustScore: number;
    overallScore: number;
    feedback: string;
}

export interface AnalysisResult extends AnalysisScores {
    id: string;
    url: string;
    analyzedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class AnalysisService {
    private model: ChatGoogleGenerativeAI;

    constructor() {
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash-lite", // Lite version has better free tier
            temperature: 0.3, // Lower = more consistent scores
        });
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PRIVATE: AI Analysis
    // ───────────────────────────────────────────────────────────────────────────
    private async analyzeWithAI(
        url: string,
        title: string,
        description: string,
        bodyText: string
    ): Promise<AnalysisScores> {
        const prompt = `You are an expert landing page analyst. Analyze this landing page and provide scores from 1-10 for each category.

URL: ${url}
Title: ${title}
Meta Description: ${description}
Page Content: ${bodyText.slice(0, 3000)}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "headlineScore": <1-10>,
  "valueScore": <1-10>,
  "ctaScore": <1-10>,
  "trustScore": <1-10>,
  "feedback": "<2-3 paragraphs of specific, actionable feedback covering: 1) What's working well, 2) What needs improvement, 3) Top 3 specific recommendations>"
}

Scoring criteria:
- headlineScore: Is the headline clear, compelling, and communicates value in under 10 words?
- valueScore: Is the value proposition immediately obvious? Does it solve a clear problem?
- ctaScore: Are CTAs visible, action-oriented, and well-placed? Is there a clear next step?
- trustScore: Are there testimonials, social proof, trust badges, or credibility signals?`;

        const response = await this.model.invoke(prompt);
        const content = response.content as string;

        // Parse JSON from response (handle potential markdown wrapping)
        let jsonStr = content;
        if (content.includes("```")) {
            jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        }

        const parsed = JSON.parse(jsonStr);

        // Calculate overall score
        const overallScore = Math.round(
            (parsed.headlineScore + parsed.valueScore + parsed.ctaScore + parsed.trustScore) / 4
        );

        return {
            headlineScore: parsed.headlineScore,
            valueScore: parsed.valueScore,
            ctaScore: parsed.ctaScore,
            trustScore: parsed.trustScore,
            overallScore,
            feedback: parsed.feedback,
        };
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Analyze a landing page
    // ───────────────────────────────────────────────────────────────────────────
    async analyze(url: string): Promise<AnalysisResult> {
        // Step 1: Scrape the page (this also saves to ScrapeResult)
        const scraped = await scraperService.scrape(url);

        // Step 2: Analyze with AI
        const scores = await this.analyzeWithAI(
            url,
            scraped.title,
            scraped.description,
            scraped.bodyText
        );

        // Step 3: Save analysis to database
        const saved = await prisma.analysisResult.create({
            data: {
                url,
                ...scores,
            },
        });

        return saved;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Get analysis history
    // ───────────────────────────────────────────────────────────────────────────
    async getHistory(limit: number = 20): Promise<AnalysisResult[]> {
        return prisma.analysisResult.findMany({
            orderBy: { analyzedAt: "desc" },
            take: limit,
        });
    }
}

export const analysisService = new AnalysisService();
