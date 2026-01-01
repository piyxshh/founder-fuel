// File: server/src/services/repurpose.service.ts
// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT REPURPOSING SERVICE
// Takes scraped content and generates multiple formats using AI
// ═══════════════════════════════════════════════════════════════════════════════

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { prisma } from "../lib/prisma.js";
import { scraperService } from "./scraper.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface RepurposeResult {
    id: string;
    url: string;
    title: string;
    twitterThread: string;
    linkedinPost: string;
    newsletter: string;
    createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class RepurposeService {
    private model: ChatGoogleGenerativeAI;

    constructor() {
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash-lite",
            temperature: 0.7, // Higher for more creative output
        });
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PRIVATE: Generate content with AI
    // ───────────────────────────────────────────────────────────────────────────
    private async generateContent(
        title: string,
        content: string
    ): Promise<{ twitterThread: string; linkedinPost: string; newsletter: string }> {
        const prompt = `You are an expert content repurposing specialist for founders and entrepreneurs.

Given this blog post, create three different content formats:

BLOG TITLE: ${title}
BLOG CONTENT: ${content.slice(0, 4000)}

Generate the following (respond ONLY with valid JSON, no markdown):

{
  "twitterThread": "A Twitter/X thread of 5-7 tweets. Each tweet should be on its own line, starting with a number (1/, 2/, etc). Keep each tweet under 280 characters. Make it engaging with hooks and insights.",
  
  "linkedinPost": "A professional LinkedIn post (300-500 words). Start with a hook, share key insights, add personal perspective, end with a question or CTA. Use line breaks for readability.",
  
  "newsletter": "A newsletter-style snippet (200-300 words). Conversational tone, highlight the key takeaway, include a brief summary and why readers should care."
}`;

        const response = await this.model.invoke(prompt);
        const responseContent = response.content as string;

        // Parse JSON from response
        let jsonStr = responseContent;
        if (responseContent.includes("```")) {
            jsonStr = responseContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        }

        return JSON.parse(jsonStr);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Repurpose a blog post
    // ───────────────────────────────────────────────────────────────────────────
    async repurpose(url: string): Promise<RepurposeResult> {
        // Step 1: Scrape the content
        const scraped = await scraperService.scrape(url);

        // Step 2: Generate repurposed content with AI
        const { twitterThread, linkedinPost, newsletter } = await this.generateContent(
            scraped.title,
            scraped.bodyText
        );

        // Step 3: Save to database
        const saved = await prisma.repurposeResult.create({
            data: {
                url,
                title: scraped.title,
                twitterThread,
                linkedinPost,
                newsletter,
            },
        });

        return saved;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Get repurpose history
    // ───────────────────────────────────────────────────────────────────────────
    async getHistory(limit: number = 20): Promise<RepurposeResult[]> {
        return prisma.repurposeResult.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}

export const repurposeService = new RepurposeService();
