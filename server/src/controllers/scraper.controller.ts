// File: server/src/controllers/scraper.controller.ts
// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPER CONTROLLER
// This is the "HTTP boundary" layer. It knows about request/response.
// It calls the Service, catches domain errors, and maps them to HTTP status codes.
// ═══════════════════════════════════════════════════════════════════════════════

import { Request, Response } from "express";
import { scraperService } from "../services/scraper.service.js";
import {
    InvalidUrlError,
    ScrapingBlockedError,
    ScrapingTimeoutError,
    ScraperError
} from "../errors/index.js";

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST/RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ScrapeRequestBody {
    url: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────

export const scraperController = {

    /**
     * POST /api/scrape
     * 
     * Receives: { url: string }
     * Returns: ScrapeResult or error
     */
    async scrape(req: Request<{}, {}, ScrapeRequestBody>, res: Response) {
        try {
            // 1. Validate request body
            const { url } = req.body;

            if (!url || typeof url !== "string") {
                res.status(400).json({
                    error: "Bad Request",
                    message: "Request body must include a 'url' string",
                });
                return;
            }

            // 2. Call the service (business logic)
            const result = await scraperService.scrape(url);

            // 3. Return success response
            res.status(200).json(result);

        } catch (error) {
            // ─────────────────────────────────────────────────────────────────────
            // ERROR MAPPING: Domain errors → HTTP status codes
            // This is the Controller's job - the Service doesn't know about HTTP!
            // ─────────────────────────────────────────────────────────────────────

            if (error instanceof InvalidUrlError) {
                // 400 Bad Request - client sent invalid data
                res.status(400).json({
                    error: "Invalid URL",
                    message: error.message,
                });
                return;
            }

            if (error instanceof ScrapingBlockedError) {
                // 403 Forbidden - target site blocked us
                res.status(403).json({
                    error: "Scraping Blocked",
                    message: error.message,
                    statusCode: error.statusCode,
                });
                return;
            }

            if (error instanceof ScrapingTimeoutError) {
                // 504 Gateway Timeout - target site too slow
                res.status(504).json({
                    error: "Timeout",
                    message: error.message,
                });
                return;
            }

            if (error instanceof ScraperError) {
                // 502 Bad Gateway - something went wrong with target site
                res.status(502).json({
                    error: "Scraping Failed",
                    message: error.message,
                });
                return;
            }

            // Unknown error - log it and return 500
            console.error("Unexpected error in scraperController:", error);
            res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred",
            });
        }
    },

    /**
     * GET /api/history
     * 
     * Returns: Array of past ScrapeResults
     */
    async getHistory(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const results = await scraperService.getHistory(limit);
            res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching history:", error);
            res.status(500).json({
                error: "Internal Server Error",
                message: "Failed to fetch scrape history",
            });
        }
    },
};

