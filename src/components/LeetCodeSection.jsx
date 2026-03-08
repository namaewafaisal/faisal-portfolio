/**
 * LeetCodeSection
 * ─────────────────────────────────────────────────────────────
 * Displays:
 *   1. Total stats (easy / medium / hard / ranking)
 *   2. Top problem categories (tag analysis)
 *   3. Recent accepted submissions
 *   4. Submission heatmap calendar
 *
 * All data is fetched from /api/leetcode/*
 */
import React, { useMemo } from "react";
import { SiLeetcode } from "react-icons/si";
import { FaTrophy, FaFire, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import { useFetch } from "../hooks/useFetch";
import { SectionLoader, ErrorCard, SectionTitle, Badge } from "./ui";
import ContributionHeatmap from "./ContributionHeatmap";

// ── Circular progress ring for easy/medium/hard ──────────────────────────────
function RingProgress({ value, max, color, label, count }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = max > 0 ? (value / max) * circumference : 0;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="88" height="88" viewBox="0 0 88 88">
                {/* Background circle */}
                <circle
                    cx="44" cy="44" r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="7"
                    fill="none"
                />
                {/* Progress arc */}
                <circle
                    cx="44" cy="44" r={radius}
                    stroke={color}
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 44 44)"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                />
                {/* Center text */}
                <text x="44" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" dominantBaseline="middle">
                    {count}
                </text>
                <text x="44" y="57" textAnchor="middle" fontSize="9" fill="#9ca3af">
                    solved
                </text>
            </svg>
            <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
    );
}

// ── Category bar for topic strengths ─────────────────────────────────────────
function TopicBar({ tag, count, max }) {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300 w-28 flex-shrink-0 truncate">{tag}</span>
            <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-400"
                    style={{ width: `${pct}%`, transition: "width 0.8s ease" }}
                />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
        </div>
    );
}

// ── Language tag color ────────────────────────────────────────────────────────
function langColor(lang) {
    const map = {
        python3: "python", python: "python", java: "java", cpp: "green",
        c: "gray", javascript: "yellow", typescript: "blue", go: "blue",
        rust: "orange", kotlin: "purple",
    };
    return map[lang?.toLowerCase()] || "gray";
}

function SubmissionItem({ sub }) {
    const date = new Date(sub.timestamp * 1000);
    const timeAgo = getTimeAgo(date);

    return (
        <a
            href={sub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/5
                 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all duration-200 group"
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-200 group-hover:text-white truncate">{sub.title}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <Badge color={langColor(sub.lang)}>{sub.lang}</Badge>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FaClock size={9} />
                    {timeAgo}
                </span>
                <FaExternalLinkAlt className="text-gray-600 group-hover:text-yellow-400" size={11} />
            </div>
        </a>
    );
}

function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Max problems per difficulty (for ring progress) ───────────────────────────
const DIFFICULTY_MAX = { Easy: 845, Medium: 1777, Hard: 779 };

export default function LeetCodeSection() {
    const { data: stats, loading: statsLoading, error: statsError } = useFetch("/api/leetcode/stats");
    const { data: recent, loading: recentLoading, error: recentError } = useFetch("/api/leetcode/recent");
    const { data: heatmapRaw, loading: heatmapLoading } = useFetch("/api/leetcode/heatmap");
    const { data: topics, loading: topicsLoading } = useFetch("/api/leetcode/topics");

    const topicMax = useMemo(() => {
        if (!topics?.length) return 1;
        return Math.max(...topics.map((t) => t.count));
    }, [topics]);

    return (
        <section id="leetcode" className="max-w-6xl mx-auto px-6 py-20">
            <SectionTitle>LeetCode Progress</SectionTitle>

            {/* ── Stats Header ────────────────────────────────────────── */}
            {statsLoading && <SectionLoader rows={1} />}
            {statsError && <ErrorCard message={statsError} />}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                    {/* Left: Total + Ranking */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/2 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <SiLeetcode className="text-yellow-400" size={28} />
                            <div>
                                <div className="text-3xl font-bold text-white">{stats.total}</div>
                                <div className="text-sm text-gray-400">Problems Solved</div>
                            </div>
                        </div>
                        {stats.ranking > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <FaTrophy className="text-yellow-500" />
                                <span className="text-sm text-gray-300">
                                    Global Rank: <span className="text-white font-semibold">#{stats.ranking.toLocaleString()}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: Easy / Medium / Hard rings */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/2">
                        <div className="flex justify-around items-center">
                            <RingProgress
                                value={stats.easy}
                                max={DIFFICULTY_MAX.Easy}
                                color="#22c55e"
                                label="Easy"
                                count={stats.easy}
                            />
                            <RingProgress
                                value={stats.medium}
                                max={DIFFICULTY_MAX.Medium}
                                color="#f59e0b"
                                label="Medium"
                                count={stats.medium}
                            />
                            <RingProgress
                                value={stats.hard}
                                max={DIFFICULTY_MAX.Hard}
                                color="#ef4444"
                                label="Hard"
                                count={stats.hard}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Top Topics ──────────────────────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                🏆 Strongest Topics
            </h3>
            <div className="p-5 rounded-xl border border-white/10 bg-white/2 mb-14">
                {topicsLoading && <SectionLoader rows={4} />}
                {!topicsLoading && topics?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topics.map((t) => (
                            <TopicBar key={t.tag} tag={t.tag} count={t.count} max={topicMax} />
                        ))}
                    </div>
                )}
                {!topicsLoading && !topics?.length && (
                    <p className="text-sm text-gray-500 text-center py-4">No topic data available yet.</p>
                )}
            </div>

            {/* ── Recent Accepted Submissions ─────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                ✅ Recent Accepted Submissions
            </h3>
            {recentLoading && <SectionLoader rows={5} />}
            {recentError && <ErrorCard message={recentError} />}
            {recent && (
                <div className="space-y-2 mb-14">
                    {recent.map((sub) => (
                        <SubmissionItem key={sub.id} sub={sub} />
                    ))}
                    {recent.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No accepted submissions yet.</p>
                    )}
                </div>
            )}

            {/* ── LeetCode Submission Heatmap ─────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <FaFire className="text-orange-400" /> Submission Activity
            </h3>
            <div className="p-5 rounded-xl border border-white/10 bg-white/2">
                {heatmapLoading && <SectionLoader rows={1} />}
                {!heatmapLoading && heatmapRaw?.heatmapData?.length > 0 && (
                    <>
                        <div className="flex gap-6 mb-4 text-sm">
                            <span className="text-gray-400">
                                🔥 Current streak:{" "}
                                <span className="text-orange-400 font-bold">{heatmapRaw.streak} days</span>
                            </span>
                            <span className="text-gray-400">
                                📅 Active days:{" "}
                                <span className="text-white font-bold">{heatmapRaw.totalActiveDays}</span>
                            </span>
                        </div>
                        <ContributionHeatmap
                            data={heatmapRaw.heatmapData}
                            colorScale={["#1a1a1a", "#7c2d12", "#b45309", "#d97706", "#fbbf24"]}
                            title="LeetCode Submissions"
                            totalLabel="submissions"
                        />
                    </>
                )}
                {!heatmapLoading && !heatmapRaw?.heatmapData?.length && (
                    <p className="text-sm text-gray-500 text-center py-4">No submission activity data available.</p>
                )}
            </div>
        </section>
    );
}
