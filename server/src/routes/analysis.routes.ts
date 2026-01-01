// File: server/src/routes/analysis.routes.ts
// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller.js";

const router = Router();

// POST /api/analyze - Analyze a landing page
router.post("/analyze", analysisController.analyze);

// GET /api/analyses - Get analysis history
router.get("/analyses", analysisController.getHistory);

export default router;
