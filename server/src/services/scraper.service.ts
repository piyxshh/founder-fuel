// File: server/src/services/scraper.service.ts
// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPER SERVICE
// This is the "business logic" layer. It knows HOW to scrape.
// It does NOT know about HTTP, Express, or request/response objects.
// ═══════════════════════════════════════════════════════════════════════════════

import * as cheerio from "cheerio";
import { prisma } from "../lib/prisma.js";
import {
    InvalidUrlError,
    ScrapingBlockedError,
    ScraperError
} from "../errors/index.js";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** The clean result we return after scraping */
export interface ScrapeResult {
    id: string;
    url: string;
    title: string;
    description: string;
    bodyText: string;
    scrapedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class ScraperService {

    // ───────────────────────────────────────────────────────────────────────────
    // PRIVATE: URL Validation
    // Why private? Only the public scrape() method should be called externally.
    // ───────────────────────────────────────────────────────────────────────────
    private validateUrl(url: string): URL {
        try {
            const parsed = new URL(url);

            // Only allow http and https protocols
            if (!["http:", "https:"].includes(parsed.protocol)) {
                throw new InvalidUrlError(url);
            }

            return parsed;
        } catch (error) {
            // URL constructor throws TypeError for invalid URLs
            throw new InvalidUrlError(url);
        }
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PRIVATE: Fetch HTML
    // Handles the HTTP request. Could be extracted to a FetcherService later.
    // ───────────────────────────────────────────────────────────────────────────
    private async fetchHtml(url: string): Promise<string> {
        const response = await fetch(url, {
            headers: {
                // Be a good web citizen - identify yourself
                "User-Agent": "FounderFuel Bot 1.0 (Educational Project)",
                // Request HTML specifically
                "Accept": "text/html,application/xhtml+xml",
            },
        });

        // Handle blocked requests (403 Forbidden, 429 Too Many Requests)
        if (response.status === 403 || response.status === 429) {
            throw new ScrapingBlockedError(url, response.status);
        }

        // Handle other HTTP errors
        if (!response.ok) {
            throw new ScraperError(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.text();
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PRIVATE: Parse HTML
    // Extracts structured data from raw HTML using Cheerio.
    // ───────────────────────────────────────────────────────────────────────────
    private parseHtml(html: string): { title: string; description: string; bodyText: string } {
        // Load HTML into Cheerio (jQuery-like API for server-side)
        const $ = cheerio.load(html);

        // Extract title from <title> tag
        const title = $("title").text().trim() || "No title found";

        // Extract meta description
        const description = $('meta[name="description"]').attr("content")?.trim()
            || $('meta[property="og:description"]').attr("content")?.trim()
            || "No description found";

        // Extract body text, removing scripts and styles
        $("script, style, noscript, iframe").remove();
        const bodyText = $("body")
            .text()
            .replace(/\s+/g, " ")  // Collapse multiple whitespace
            .trim()
            .slice(0, 5000);       // Limit to 5000 chars to prevent huge responses

        return { title, description, bodyText };
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Main scrape method
    // This is the ONLY method the Controller should call.
    // Clean API surface = easier to test and maintain.
    // ───────────────────────────────────────────────────────────────────────────
    async scrape(url: string): Promise<ScrapeResult> {
        // Step 1: Validate the URL format
        this.validateUrl(url);

        // Step 2: Fetch the HTML
        const html = await this.fetchHtml(url);

        // Step 3: Parse and extract data
        const { title, description, bodyText } = this.parseHtml(html);

        // Step 4: Save to database using Prisma
        const saved = await prisma.scrapeResult.create({
            data: {
                url,
                title,
                description,
                bodyText,
            },
        });

        // Step 5: Return the saved result (includes id and scrapedAt from DB)
        return saved;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // PUBLIC: Get all scraped results (for history endpoint)
    // ───────────────────────────────────────────────────────────────────────────
    async getHistory(limit: number = 20): Promise<ScrapeResult[]> {
        return prisma.scrapeResult.findMany({
            orderBy: { scrapedAt: "desc" },
            take: limit,
        });
    }
}

// Export a singleton instance for convenience
// (Could also export the class and let the DI container handle instantiation)
export const scraperService = new ScraperService();

