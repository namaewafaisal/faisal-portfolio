/**
 * GitHubSection
 * ─────────────────────────────────────────────────────────────
 * Displays:
 *   1. Pinned / starred GitHub repositories as project cards
 *   2. Latest 5 commits across all repos
 *   3. GitHub contribution heatmap calendar
 *
 * All data is fetched from our backend at /api/github/*
 */
import React from "react";
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useFetch } from "../hooks/useFetch";
import { SectionLoader, ErrorCard, SectionTitle, Badge } from "./ui";
import ContributionHeatmap from "./ContributionHeatmap";

// Language → color mapping (matches GitHub's colors)
const LANG_COLORS = {
    Java: "#b07219",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    C: "#555555",
    "C++": "#f34b7d",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Solidity: "#AA6746",
    Go: "#00ADD8",
    Rust: "#dea584",
};

function LanguageDot({ language, color }) {
    const dotColor = color || LANG_COLORS[language] || "#8b949e";
    return (
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: dotColor }}
            />
            {language}
        </span>
    );
}

function RepoCard({ repo }) {
    const lang = repo.primaryLanguage;
    const topics = repo.repositoryTopics?.nodes?.map((n) => n.topic?.name).filter(Boolean) || [];

    return (
        <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col h-full border border-white/10 bg-white/3 rounded-xl p-5
                 hover:border-blue-500/50 hover:bg-blue-500/5
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <FaGithub className="text-gray-400 flex-shrink-0" size={16} />
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                        {repo.name}
                    </h3>
                </div>
                <FaExternalLinkAlt
                    className="text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0"
                    size={12}
                />
            </div>

            {/* Description */}
            <p className="text-gray-400 text-xs leading-relaxed mb-3 flex-grow min-h-[2.5rem]">
                {repo.description || "No description provided."}
            </p>

            {/* Topics */}
            {topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {topics.slice(0, 3).map((t) => (
                        <Badge key={t} color="blue">{t}</Badge>
                    ))}
                </div>
            )}

            {/* Footer: language + stars */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                {lang ? (
                    <LanguageDot language={lang.name} color={lang.color} />
                ) : (
                    <span />
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400">
                    <FaStar className="text-yellow-500" size={11} />
                    {repo.stargazerCount}
                </span>
            </div>
        </a>
    );
}

function CommitItem({ commit }) {
    const date = new Date(commit.date);
    const timeAgo = getTimeAgo(date);

    return (
        <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/2
                 hover:bg-white/5 hover:border-white/15 transition-all duration-200 group"
        >
            <FaCodeBranch className="text-gray-500 group-hover:text-blue-400 mt-0.5 flex-shrink-0" size={14} />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate group-hover:text-white">{commit.message}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-blue-400/80 truncate">{commit.repo}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FaClock size={9} />
                        {timeAgo}
                    </span>
                </div>
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

export default function GitHubSection() {
    const { data: repos, loading: reposLoading, error: reposError } = useFetch("/api/github/pinned");
    const { data: commits, loading: commitsLoading, error: commitsError } = useFetch("/api/github/commits");
    const { data: contribs, loading: contribsLoading } = useFetch("/api/github/contributions");

    // Convert GitHub contribution calendar to our heatmap format
    const heatmapData = React.useMemo(() => {
        if (!contribs?.weeks) return [];
        return contribs.weeks.flatMap((week) =>
            week.contributionDays.map((day) => ({
                date: day.date,
                count: day.contributionCount,
            }))
        );
    }, [contribs]);

    return (
        <section id="github" className="max-w-6xl mx-auto px-6 py-20">
            <SectionTitle>GitHub Activity</SectionTitle>

            {/* ── Pinned Repos ───────────────────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <FaGithub /> Pinned Repositories
            </h3>
            {reposLoading && <SectionLoader rows={2} />}
            {reposError && <ErrorCard message={reposError} />}
            {repos && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
                    {repos.map((repo) => (
                        <RepoCard key={repo.name} repo={repo} />
                    ))}
                </div>
            )}

            {/* ── Recent Commits ─────────────────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <FaCodeBranch /> Recent Commits
            </h3>
            {commitsLoading && <SectionLoader rows={5} />}
            {commitsError && <ErrorCard message={commitsError} />}
            {commits && (
                <div className="space-y-2 mb-14">
                    {commits.map((c) => (
                        <CommitItem key={c.sha} commit={c} />
                    ))}
                </div>
            )}

            {/* ── Contribution Heatmap ───────────────────────────────── */}
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
                📅 GitHub Contributions
            </h3>
            <div className="p-5 rounded-xl border border-white/10 bg-white/2">
                {contribsLoading && <SectionLoader rows={1} />}
                {!contribsLoading && heatmapData.length > 0 && (
                    <ContributionHeatmap
                        data={heatmapData}
                        colorScale={["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]}
                        title="GitHub Contributions"
                        totalLabel="contributions"
                    />
                )}
                {!contribsLoading && heatmapData.length === 0 && (
                    <div className="text-sm text-gray-500 py-4 text-center">
                        Contribution graph requires a GitHub token (GITHUB_TOKEN env variable).
                        <a
                            href="https://github.com/settings/tokens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-400 hover:underline"
                        >
                            Create one here →
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
