"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface AnalysisResult {
    id: string;
    url: string;
    headlineScore: number;
    valueScore: number;
    ctaScore: number;
    trustScore: number;
    overallScore: number;
    feedback: string;
    analyzedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ScoreBadge({ score }: { score: number }) {
    const getColor = (s: number) => {
        if (s >= 8) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (s >= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        if (s >= 4) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getColor(score)}`}>
            {score}/10
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function HistoryPage() {
    const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch("http://localhost:4000/api/analyses");
                if (!response.ok) throw new Error("Failed to fetch history");
                const data = await response.json();
                setAnalyses(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                            Analysis History
                        </h1>
                        <p className="text-gray-400 mt-2">Your past landing page audits</p>
                    </div>
                    <Link
                        href="/analyze"
                        className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold transition-all"
                    >
                        + New Analysis
                    </Link>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
                        <p className="text-gray-400 mt-4">Loading history...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && analyses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-xl font-semibold mb-2">No analyses yet</h2>
                        <p className="text-gray-400 mb-6">Start by analyzing your first landing page</p>
                        <Link
                            href="/analyze"
                            className="inline-block px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold transition-all"
                        >
                            Analyze a Page
                        </Link>
                    </motion.div>
                )}

                {/* Results List */}
                <div className="space-y-4">
                    {analyses.map((analysis, index) => (
                        <motion.div
                            key={analysis.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">{analysis.url}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(analysis.analyzedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <ScoreBadge score={analysis.overallScore} />
                            </div>

                            {/* Score breakdown */}
                            <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                                <div className="text-center p-2 rounded-lg bg-white/5">
                                    <div className="text-gray-400">Headline</div>
                                    <div className="font-semibold">{analysis.headlineScore}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-white/5">
                                    <div className="text-gray-400">Value</div>
                                    <div className="font-semibold">{analysis.valueScore}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-white/5">
                                    <div className="text-gray-400">CTA</div>
                                    <div className="font-semibold">{analysis.ctaScore}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-white/5">
                                    <div className="text-gray-400">Trust</div>
                                    <div className="font-semibold">{analysis.trustScore}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
