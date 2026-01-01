// File: server/src/errors/index.ts
// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM ERROR CLASSES
// These are domain-specific errors that the Service layer throws.
// The Controller catches them and maps to HTTP status codes.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Base class for all scraper-related errors.
 * Extends the built-in Error class.
 */
export class ScraperError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ScraperError";

        // This line is needed for proper prototype chain in TypeScript
        // Without it, `instanceof ScraperError` might not work correctly
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Thrown when the URL format is invalid.
 * Maps to HTTP 400 Bad Request.
 */
export class InvalidUrlError extends ScraperError {
    constructor(url: string) {
        super(`Invalid URL format: ${url}`);
        this.name = "InvalidUrlError";
    }
}

/**
 * Thrown when the target website blocks our request (403, 429).
 * Maps to HTTP 403 Forbidden.
 */
export class ScrapingBlockedError extends ScraperError {
    public statusCode: number;

    constructor(url: string, statusCode: number) {
        super(`Blocked by ${url} with status ${statusCode}`);
        this.name = "ScrapingBlockedError";
        this.statusCode = statusCode;
    }
}

/**
 * Thrown when the request times out.
 * Maps to HTTP 504 Gateway Timeout.
 */
export class ScrapingTimeoutError extends ScraperError {
    constructor(url: string, timeoutMs: number) {
        super(`Request to ${url} timed out after ${timeoutMs}ms`);
        this.name = "ScrapingTimeoutError";
    }
}
