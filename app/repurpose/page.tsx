"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface RepurposeResult {
    id: string;
    url: string;
    title: string;
    twitterThread: string;
    linkedinPost: string;
    newsletter: string;
    createdAt: string;
}

type ContentFormat = "twitter" | "linkedin" | "newsletter";

// ═══════════════════════════════════════════════════════════════════════════════
// COPY BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-all flex items-center gap-2"
        >
            {copied ? (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORMAT TABS
// ═══════════════════════════════════════════════════════════════════════════════

const FORMAT_CONFIG = {
    twitter: { label: "𝕏 Twitter Thread", icon: "🐦" },
    linkedin: { label: "LinkedIn Post", icon: "💼" },
    newsletter: { label: "Newsletter", icon: "📧" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function RepurposePage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RepurposeResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeFormat, setActiveFormat] = useState<ContentFormat>("twitter");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:4000/api/repurpose", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Repurposing failed");
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getActiveContent = () => {
        if (!result) return "";
        switch (activeFormat) {
            case "twitter": return result.twitterThread;
            case "linkedin": return result.linkedinPost;
            case "newsletter": return result.newsletter;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                        Content Repurposing
                    </h1>
                    <p className="text-lg text-gray-400">
                        Turn any blog post into Twitter threads, LinkedIn posts, and newsletters
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="mb-12"
                >
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://blog-post-url.com/article"
                            required
                            className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                "Repurpose"
                            )}
                        </button>
                    </div>
                </motion.form>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Title */}
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-blue-300">{result.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{result.url}</p>
                            </div>

                            {/* Format Tabs */}
                            <div className="flex justify-center gap-2">
                                {(Object.keys(FORMAT_CONFIG) as ContentFormat[]).map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setActiveFormat(format)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeFormat === format
                                                ? "bg-blue-600 text-white"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                            }`}
                                    >
                                        {FORMAT_CONFIG[format].icon} {FORMAT_CONFIG[format].label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Display */}
                            <motion.div
                                key={activeFormat}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-blue-300">
                                        {FORMAT_CONFIG[activeFormat].icon} {FORMAT_CONFIG[activeFormat].label}
                                    </h3>
                                    <CopyButton text={getActiveContent()} />
                                </div>
                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-sm bg-black/20 p-4 rounded-xl max-h-96 overflow-y-auto">
                                    {getActiveContent()}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
