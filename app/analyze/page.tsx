"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
// SCORE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ScoreCard({ label, score, delay }: { label: string; score: number; delay: number }) {
    const getScoreColor = (s: number) => {
        if (s >= 8) return "from-emerald-500 to-green-400";
        if (s >= 6) return "from-yellow-500 to-amber-400";
        if (s >= 4) return "from-orange-500 to-amber-500";
        return "from-red-500 to-rose-400";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6"
        >
            <div className="text-sm text-gray-400 mb-2">{label}</div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
                {score}/10
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ delay: delay + 0.2, duration: 0.6 }}
                    className={`h-full bg-gradient-to-r ${getScoreColor(score)} rounded-full`}
                />
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AnalyzePage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:4000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Analysis failed");
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                        Landing Page Audit
                    </h1>
                    <p className="text-lg text-gray-400">
                        Get AI-powered scores and actionable feedback for your landing page
                    </p>
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
                            placeholder="https://your-landing-page.com"
                            required
                            className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                "Analyze"
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
                            className="space-y-8"
                        >
                            {/* Overall Score */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/20"
                            >
                                <div className="text-lg text-purple-300 mb-2">Overall Score</div>
                                <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                                    {result.overallScore}/10
                                </div>
                                <div className="text-sm text-gray-500 mt-2">{result.url}</div>
                            </motion.div>

                            {/* Score Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ScoreCard label="Headline Clarity" score={result.headlineScore} delay={0.1} />
                                <ScoreCard label="Value Proposition" score={result.valueScore} delay={0.2} />
                                <ScoreCard label="CTA Strength" score={result.ctaScore} delay={0.3} />
                                <ScoreCard label="Trust Signals" score={result.trustScore} delay={0.4} />
                            </div>

                            {/* Feedback */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <h3 className="text-lg font-semibold mb-4 text-purple-300">AI Feedback</h3>
                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {result.feedback}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
