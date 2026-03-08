/**
 * ============================================================
 * Portfolio Backend API Server
 * ============================================================
 * - Fetches GitHub pinned repos, commits, and contribution graph
 * - Fetches LeetCode stats, recent submissions, and heatmap
 * - Caches all responses for 30 minutes (NodeCache)
 * - Serves as a proxy so API keys never reach the frontend
 * ============================================================
 */

import express from "express";
import cors from "cors";
import NodeCache from "node-cache";
import axios from "axios";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load config from root portfolio.config.js (ESM-safe dynamic import)
const { config } = await import(
    path.resolve(__dirname, "../portfolio.config.js")
);

const app = express();
const PORT = process.env.PORT || 3001;

// ── Cache: 30-minute TTL ──────────────────────────────────────────────────────
const cache = new NodeCache({ stdTTL: config.cache.ttl, checkperiod: 120 });

app.use(cors());
app.use(express.json());

// ── Utility: Wrap with cache ──────────────────────────────────────────────────
/**
 * Generic cache wrapper.
 * @param {string} key   - Cache key
 * @param {Function} fn  - Async function that fetches data
 */
async function withCache(key, fn) {
    const cached = cache.get(key);
    if (cached !== undefined) {
        console.log(`[cache HIT] ${key}`);
        return cached;
    }
    console.log(`[cache MISS] ${key} — fetching...`);
    const data = await fn();
    cache.set(key, data);
    return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB ROUTES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/github/pinned
 * Uses GitHub GraphQL API to fetch pinned repositories.
 * Falls back to starred repos if user has no pinned repos.
 *
 * NOTE: Requires a GitHub Personal Access Token (PAT) in env
 *       GITHUB_TOKEN for GraphQL (pinned repos). REST API is used
 *       as fallback without auth.
 */
app.get("/api/github/pinned", async (req, res) => {
    try {
        const data = await withCache(`github_pinned_${config.github}`, async () => {
            const token = process.env.GITHUB_TOKEN;
            if (token) {
                // GraphQL query to get pinned repositories
                const query = `
          query {
            user(login: "${config.github}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    url
                    stargazerCount
                    primaryLanguage { name color }
                    updatedAt
                    repositoryTopics(first: 5) {
                      nodes { topic { name } }
                    }
                  }
                }
              }
            }
          }
        `;
                const gqlRes = await axios.post(
                    "https://api.github.com/graphql",
                    { query },
                    { headers: { Authorization: `bearer ${token}` } }
                );
                const pinned = gqlRes.data?.data?.user?.pinnedItems?.nodes;
                if (pinned && pinned.length > 0) return pinned;
            }

            // Fallback: top starred repos from REST API (no auth required)
            const reposRes = await axios.get(
                `https://api.github.com/users/${config.github}/repos?sort=stars&per_page=6`,
                token ? { headers: { Authorization: `token ${token}` } } : {}
            );
            return reposRes.data.map((r) => ({
                name: r.name,
                description: r.description,
                url: r.html_url,
                stargazerCount: r.stargazers_count,
                primaryLanguage: r.language ? { name: r.language, color: null } : null,
                updatedAt: r.updated_at,
                repositoryTopics: { nodes: [] },
            }));
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/github/pinned]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/github/commits
 * Fetches the latest N commits scoped ONLY to pinned repositories.
 *
 * Strategy:
 *   1. Re-use the same pinned repo fetch logic to get repo names.
 *   2. For each pinned repo, call the REST commits endpoint.
 *   3. Merge all results, sort by date descending, return top N.
 *
 * This ensures the "Recent Commits" section only shows work from
 * the repos you've chosen to highlight on your profile.
 */
app.get("/api/github/commits", async (req, res) => {
    try {
        const data = await withCache(`github_commits_${config.github}`, async () => {
            const token = process.env.GITHUB_TOKEN;
            const headers = token ? { Authorization: `token ${token}` } : {};

            // ── Step 1: Get pinned repo names ────────────────────────────
            // Check cache first to avoid a redundant network call
            let pinnedRepos = cache.get(`github_pinned_${config.github}`);

            if (!pinnedRepos) {
                // Same logic as /api/github/pinned — fetch and use inline
                if (token) {
                    const query = `
                        query {
                          user(login: "${config.github}") {
                            pinnedItems(first: 6, types: REPOSITORY) {
                              nodes {
                                ... on Repository { name url updatedAt
                                  description stargazerCount
                                  primaryLanguage { name color }
                                  repositoryTopics(first: 5) { nodes { topic { name } } }
                                }
                              }
                            }
                          }
                        }
                    `;
                    const gqlRes = await axios.post(
                        "https://api.github.com/graphql",
                        { query },
                        { headers: { Authorization: `bearer ${token}` } }
                    );
                    pinnedRepos = gqlRes.data?.data?.user?.pinnedItems?.nodes;
                }

                // Fallback to top-starred repos
                if (!pinnedRepos || pinnedRepos.length === 0) {
                    const reposRes = await axios.get(
                        `https://api.github.com/users/${config.github}/repos?sort=stars&per_page=6`,
                        { headers }
                    );
                    pinnedRepos = reposRes.data.map((r) => ({
                        name: r.name,
                        url: r.html_url,
                        description: r.description,
                        stargazerCount: r.stargazers_count,
                        primaryLanguage: r.language ? { name: r.language, color: null } : null,
                        updatedAt: r.updated_at,
                        repositoryTopics: { nodes: [] },
                    }));
                }

                // Populate the pinned cache too, so /api/github/pinned benefits
                cache.set(`github_pinned_${config.github}`, pinnedRepos);
            }

            // ── Step 2: Fetch recent commits from each pinned repo ───────
            // Fetch in parallel — 3 commits per repo is enough to get the top 5 total
            const perRepo = 3;
            const commitFetches = pinnedRepos.map((repo) =>
                axios
                    .get(
                        `https://api.github.com/repos/${config.github}/${repo.name}/commits?per_page=${perRepo}`,
                        { headers }
                    )
                    .then((res) =>
                        res.data.map((c) => ({
                            sha: c.sha,
                            message: c.commit.message.split("\n")[0], // first line only
                            date: c.commit.author.date,
                            repo: repo.name,
                            repoUrl: repo.url,
                            url: c.html_url,
                        }))
                    )
                    .catch(() => []) // if a repo fails (e.g. empty), skip it gracefully
            );

            const allCommits = (await Promise.all(commitFetches)).flat();

            // ── Step 3: Sort by date desc, take top N ────────────────────
            return allCommits
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, config.githubSettings.showCommitCount);
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/github/commits]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/github/contributions
 * Fetches the GitHub contribution calendar data using GraphQL.
 * Returns daily contribution counts for the past year.
 */
app.get("/api/github/contributions", async (req, res) => {
    try {
        const data = await withCache(`github_contrib_${config.github}`, async () => {
            const token = process.env.GITHUB_TOKEN;

            // Determine the date range (past 52 weeks)
            const to = new Date().toISOString();
            const from = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

            if (!token) {
                // Without a token, we can't call GraphQL, so return null
                return null;
            }

            const query = `
        query {
          user(login: "${config.github}") {
            contributionsCollection(from: "${from}", to: "${to}") {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                  }
                }
              }
            }
          }
        }
      `;

            const gqlRes = await axios.post(
                "https://api.github.com/graphql",
                { query },
                { headers: { Authorization: `bearer ${token}` } }
            );

            return gqlRes.data?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/github/contributions]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/github/profile
 * Returns basic GitHub profile info (avatar, bio, followers, etc.)
 */
app.get("/api/github/profile", async (req, res) => {
    try {
        const data = await withCache(`github_profile_${config.github}`, async () => {
            const token = process.env.GITHUB_TOKEN;
            const headers = token ? { Authorization: `token ${token}` } : {};
            const profileRes = await axios.get(
                `https://api.github.com/users/${config.github}`,
                { headers }
            );
            const p = profileRes.data;
            return {
                login: p.login,
                name: p.name,
                avatarUrl: p.avatar_url,
                bio: p.bio,
                followers: p.followers,
                following: p.following,
                publicRepos: p.public_repos,
                htmlUrl: p.html_url,
            };
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/github/profile]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// LEETCODE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

const LEETCODE_GQL = "https://leetcode.com/graphql";

// Headers to mimic a browser request to LeetCode
const LC_HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "Origin": "https://leetcode.com",
};

/**
 * GET /api/leetcode/stats
 * Fetches overall problem solving stats (total, easy, medium, hard, ranking).
 * Uses LeetCode's public GraphQL endpoint.
 */
app.get("/api/leetcode/stats", async (req, res) => {
    try {
        const data = await withCache(`lc_stats_${config.leetcode}`, async () => {
            const query = `
        query userStats($username: String!) {
          matchedUser(username: $username) {
            username
            profile { ranking userAvatar realName }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }
      `;
            const gqlRes = await axios.post(
                LEETCODE_GQL,
                { query, variables: { username: config.leetcode } },
                { headers: LC_HEADERS }
            );

            const user = gqlRes.data?.data?.matchedUser;
            if (!user) throw new Error("LeetCode user not found");

            const acStats = user.submitStats.acSubmissionNum;
            const total = acStats.find((s) => s.difficulty === "All")?.count || 0;
            const easy = acStats.find((s) => s.difficulty === "Easy")?.count || 0;
            const medium = acStats.find((s) => s.difficulty === "Medium")?.count || 0;
            const hard = acStats.find((s) => s.difficulty === "Hard")?.count || 0;

            return {
                username: user.username,
                ranking: user.profile.ranking,
                avatar: user.profile.userAvatar,
                total, easy, medium, hard,
            };
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/leetcode/stats]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/leetcode/recent
 * Fetches the most recent N accepted submissions.
 */
app.get("/api/leetcode/recent", async (req, res) => {
    try {
        const data = await withCache(`lc_recent_${config.leetcode}`, async () => {
            const query = `
        query recentSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
            lang
            runtime
            memory
          }
        }
      `;
            const gqlRes = await axios.post(
                LEETCODE_GQL,
                {
                    query,
                    variables: {
                        username: config.leetcode,
                        limit: config.leetcodeSettings.showRecentSubmissions,
                    },
                },
                { headers: LC_HEADERS }
            );

            const subs = gqlRes.data?.data?.recentAcSubmissionList || [];
            return subs.map((s) => ({
                id: s.id,
                title: s.title,
                slug: s.titleSlug,
                url: `https://leetcode.com/problems/${s.titleSlug}/`,
                timestamp: s.timestamp,
                lang: s.lang,
                runtime: s.runtime,
                memory: s.memory,
            }));
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/leetcode/recent]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/leetcode/heatmap
 * Fetches the LeetCode submission calendar (daily activity heatmap).
 * The calendar is a JSON object mapping UNIX timestamps to submission counts.
 */
app.get("/api/leetcode/heatmap", async (req, res) => {
    try {
        const data = await withCache(`lc_heatmap_${config.leetcode}`, async () => {
            const query = `
        query userYearlyActivity($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
              totalActiveDays
              streak
            }
          }
        }
      `;
            const gqlRes = await axios.post(
                LEETCODE_GQL,
                { query, variables: { username: config.leetcode } },
                { headers: LC_HEADERS }
            );

            const cal = gqlRes.data?.data?.matchedUser?.userCalendar;
            if (!cal) return null;

            // submissionCalendar is a stringified JSON: { "timestamp": count, ... }
            const rawCalendar = JSON.parse(cal.submissionCalendar || "{}");

            // Convert to array of { date, count } for our heatmap component
            const heatmapData = Object.entries(rawCalendar).map(([ts, count]) => ({
                date: new Date(parseInt(ts) * 1000).toISOString().split("T")[0],
                count,
            }));

            return {
                heatmapData,
                totalActiveDays: cal.totalActiveDays,
                streak: cal.streak,
            };
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/leetcode/heatmap]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/leetcode/topics
 * Fetches problem tags/categories from user's solved problems.
 * Shows which topics the user is strongest in.
 */
app.get("/api/leetcode/topics", async (req, res) => {
    try {
        const data = await withCache(`lc_topics_${config.leetcode}`, async () => {
            const query = `
        query userTopicTags($username: String!) {
          matchedUser(username: $username) {
            tagProblemCounts {
              advanced {
                tagName
                tagSlug
                problemsSolved
              }
              intermediate {
                tagName
                tagSlug
                problemsSolved
              }
              fundamental {
                tagName
                tagSlug
                problemsSolved
              }
            }
          }
        }
      `;
            const gqlRes = await axios.post(
                LEETCODE_GQL,
                { query, variables: { username: config.leetcode } },
                { headers: LC_HEADERS }
            );

            const tagData = gqlRes.data?.data?.matchedUser?.tagProblemCounts;
            if (!tagData) return [];

            // Merge all categories and sort by problems solved
            const all = [
                ...tagData.fundamental,
                ...tagData.intermediate,
                ...tagData.advanced,
            ];
            const merged = {};
            all.forEach(({ tagName, problemsSolved }) => {
                merged[tagName] = (merged[tagName] || 0) + problemsSolved;
            });

            return Object.entries(merged)
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 12); // Top 12 categories
        });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[/api/leetcode/topics]", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        github: config.github,
        leetcode: config.leetcode,
        cacheKeys: cache.keys(),
    });
});

// ── Clear cache endpoint (for development) ───────────────────────────────────
app.post("/api/cache/clear", (req, res) => {
    cache.flushAll();
    res.json({ success: true, message: "Cache cleared" });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio API server running at http://localhost:${PORT}`);
    console.log(`   GitHub user : ${config.github}`);
    console.log(`   LeetCode user: ${config.leetcode}`);
    console.log(`   Cache TTL   : ${config.cache.ttl}s (${config.cache.ttl / 60} min)\n`);
});
