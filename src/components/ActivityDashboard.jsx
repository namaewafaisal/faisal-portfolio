/**
 * ActivityDashboard
 * ─────────────────────────────────────────────────────────────
 * Combines GitHub and LeetCode activity into one unified view.
 * Also shows "Currently Building" based on repos with recent commits.
 */
import React, { useMemo } from "react";
import { FaGithub, FaCodeBranch, FaHammer } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { useFetch } from "../hooks/useFetch";
import { SectionLoader, ErrorCard, SectionTitle, Badge } from "./ui";

function TimelineItem({ icon, title, subtitle, time, color }) {
    return (
        <div className="flex gap-3 items-start">
            <div
                className="mt-1 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                style={{ background: `${color}22`, border: `1px solid ${color}44` }}
            >
                <span style={{ color }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate font-medium">{title}</p>
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            </div>
            <span className="text-xs text-gray-600 flex-shrink-0">{time}</span>
        </div>
    );
}

function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityDashboard() {
    const { data: commits, loading: commitsLoading } = useFetch("/api/github/commits");
    const { data: recent, loading: recentLoading } = useFetch("/api/leetcode/recent");
    const { data: repos, loading: reposLoading } = useFetch("/api/github/pinned");

    // Merge and sort GitHub commits + LeetCode submissions by time
    const timeline = useMemo(() => {
        const events = [];

        if (commits) {
            commits.forEach((c) => {
                events.push({
                    id: `gh-${c.sha}`,
                    type: "github",
                    title: c.message,
                    subtitle: c.repo,
                    timestamp: new Date(c.date),
                    icon: <FaCodeBranch />,
                    color: "#3b82f6",
                });
            });
        }

        if (recent) {
            recent.forEach((s) => {
                events.push({
                    id: `lc-${s.id}`,
                    type: "leetcode",
                    title: s.title,
                    subtitle: `LeetCode · ${s.lang}`,
                    timestamp: new Date(s.timestamp * 1000),
                    icon: <SiLeetcode />,
                    color: "#f59e0b",
                });
            });
        }

        // Sort by most recent first
        return events.sort((a, b) => b.timestamp - a.timestamp);
    }, [commits, recent]);

    // "Currently Building" = repos updated in the last 2 weeks
    const currentlyBuilding = useMemo(() => {
        if (!repos) return [];
        const twoWeeksAgo = new Date(Date.now() - 14 * 86400 * 1000);
        return repos.filter((r) => r.updatedAt && new Date(r.updatedAt) > twoWeeksAgo);
    }, [repos]);

    const isLoading = commitsLoading || recentLoading;

    return (
        <section id="activity" className="max-w-6xl mx-auto px-6 py-20">
            <SectionTitle>Activity Dashboard</SectionTitle>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Combined Timeline ─────────────────────────────────── */}
                <div className="lg:col-span-2 p-6 rounded-xl border border-white/10 bg-white/2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
                        Recent Activity
                    </h3>
                    {isLoading && <SectionLoader rows={6} />}
                    {!isLoading && timeline.length > 0 && (
                        <div className="space-y-5">
                            {timeline.slice(0, 8).map((event) => (
                                <TimelineItem
                                    key={event.id}
                                    icon={event.icon}
                                    title={event.title}
                                    subtitle={event.subtitle}
                                    time={getTimeAgo(event.timestamp)}
                                    color={event.color}
                                />
                            ))}
                        </div>
                    )}
                    {!isLoading && timeline.length === 0 && (
                        <p className="text-sm text-gray-500 py-4 text-center">No recent activity available.</p>
                    )}
                    {/* Legend */}
                    <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FaCodeBranch className="text-blue-400" size={11} />
                            GitHub commit
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <SiLeetcode className="text-yellow-400" size={11} />
                            LeetCode solve
                        </span>
                    </div>
                </div>

                {/* ── Currently Building ────────────────────────────────── */}
                <div className="p-6 rounded-xl border border-white/10 bg-white/2 flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <FaHammer className="text-orange-400" />
                        Currently Building
                    </h3>
                    {reposLoading && <SectionLoader rows={2} />}
                    {!reposLoading && currentlyBuilding.length > 0 ? (
                        <div className="space-y-4 flex-1">
                            {currentlyBuilding.map((repo) => (
                                <a
                                    key={repo.name}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 rounded-lg border border-orange-500/20 bg-orange-500/5
                             hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                        <span className="text-sm font-medium text-white group-hover:text-orange-300">
                                            {repo.name}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 pl-4">
                                        {repo.description || "Active development"}
                                    </p>
                                    {repo.primaryLanguage && (
                                        <div className="mt-2 pl-4">
                                            <Badge color="orange">{repo.primaryLanguage.name}</Badge>
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    ) : !reposLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-sm text-gray-500 text-center">
                                No active repositories in the last 2 weeks.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
