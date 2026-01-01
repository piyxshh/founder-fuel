// File: server/src/routes/repurpose.routes.ts
// ═══════════════════════════════════════════════════════════════════════════════
// REPURPOSE ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

import { Router } from "express";
import { repurposeController } from "../controllers/repurpose.controller.js";

const router = Router();

// POST /api/repurpose - Repurpose a blog post
router.post("/repurpose", repurposeController.repurpose);

// GET /api/repurpose/history - Get repurpose history
router.get("/repurpose/history", repurposeController.getHistory);

export default router;
