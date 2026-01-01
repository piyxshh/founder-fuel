// File: server/src/controllers/repurpose.controller.ts
// ═══════════════════════════════════════════════════════════════════════════════
// REPURPOSE CONTROLLER
// HTTP boundary for content repurposing
// ═══════════════════════════════════════════════════════════════════════════════

import { Request, Response } from "express";
import { repurposeService } from "../services/repurpose.service.js";
import { InvalidUrlError, ScraperError } from "../errors/index.js";

interface RepurposeRequestBody {
    url: string;
}

export const repurposeController = {
    /**
     * POST /api/repurpose
     * Repurpose a blog post into multiple content formats
     */
    async repurpose(req: Request<{}, {}, RepurposeRequestBody>, res: Response) {
        try {
            const { url } = req.body;

            if (!url || typeof url !== "string") {
                res.status(400).json({
                    error: "Bad Request",
                    message: "Request body must include a 'url' string",
                });
                return;
            }

            const result = await repurposeService.repurpose(url);
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

            console.error("Repurpose error:", error);
            res.status(500).json({
                error: "Repurpose Failed",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },

    /**
     * GET /api/repurpose/history
     * Get repurpose history
     */
    async getHistory(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const results = await repurposeService.getHistory(limit);
            res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching repurpose history:", error);
            res.status(500).json({
                error: "Internal Server Error",
                message: "Failed to fetch repurpose history",
            });
        }
    },
};
