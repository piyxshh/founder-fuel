// File: server/src/lib/prisma.ts
// ═══════════════════════════════════════════════════════════════════════════════
// PRISMA CLIENT SINGLETON
// Ensures we reuse the same Prisma client instance across the app.
// This prevents creating too many database connections.
// ═══════════════════════════════════════════════════════════════════════════════

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// In development, we want to reuse the client across hot reloads
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Prisma 7 uses driver adapters
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
