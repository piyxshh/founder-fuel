// File: server/src/index.ts
// ═══════════════════════════════════════════════════════════════════════════════
// EXPRESS SERVER ENTRY POINT
// Sets up middleware, routes, and starts listening.
// ═══════════════════════════════════════════════════════════════════════════════

import express from "express";
import cors from "cors";
import scraperRoutes from "./routes/scraper.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";

// ─────────────────────────────────────────────────────────────────────────────
// APP SETUP
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

// CORS: Allow requests from Next.js frontend (localhost:3000)
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
}));

// Parse JSON request bodies
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount routes at /api
app.use("/api", scraperRoutes);
app.use("/api", analysisRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 FounderFuel Backend Server                               ║
║                                                               ║
║   Local:   http://localhost:${PORT}                            ║
║   Health:  http://localhost:${PORT}/health                     ║
║   API:     http://localhost:${PORT}/api/scrape                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
