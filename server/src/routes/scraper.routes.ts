// File: server/src/routes/scraper.routes.ts
// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPER ROUTES
// Defines the URL paths and maps them to controller methods.
// ═══════════════════════════════════════════════════════════════════════════════

import { Router } from "express";
import { scraperController } from "../controllers/scraper.controller.js";

const router = Router();

// POST /api/scrape - Scrape a URL and return extracted content
router.post("/scrape", scraperController.scrape);

// GET /api/history - Get past scrape results
router.get("/history", scraperController.getHistory);

export default router;

