// File: server/src/controllers/analysis.controller.ts
// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS CONTROLLER
// HTTP boundary for landing page analysis
// ═══════════════════════════════════════════════════════════════════════════════

import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service.js";
import { InvalidUrlError, ScraperError } from "../errors/index.js";

interface AnalyzeRequestBody {
    url: string;
}

export const analysisController = {
    /**
     * POST /api/analyze
     * Analyze a landing page and return scores + feedback
     */
    async analyze(req: Request<{}, {}, AnalyzeRequestBody>, res: Response) {
        try {
            const { url } = req.body;

            if (!url || typeof url !== "string") {
                res.status(400).json({
                    error: "Bad Request",
                    message: "Request body must include a 'url' string",
                });
                return;
            }

            const result = await analysisService.analyze(url);
            res.status(200).json(result);

        } catch (error) {
            if (error instanceof InvalidUrlError) {
                res.status(400).json({
                    error: "Invalid URL",
                    message: error.message,
                });
                return;
            }

            if (error instanceof ScraperError) {
                res.status(502).json({
                    error: "Scraping Failed",
                    message: error.message,
                });
                return;
            }

            console.error("Analysis error:", error);
            res.status(500).json({
                error: "Analysis Failed",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    /**
     * GET /api/analyses
     * Get analysis history
     */
    async getHistory(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const results = await analysisService.getHistory(limit);
            res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching analyses:", error);
            res.status(500).json({
                error: "Internal Server Error",
                message: "Failed to fetch analysis history",
            });
        }
    },
};
