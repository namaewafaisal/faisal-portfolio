/**
 * ============================================================
 * Vercel Serverless Backend Entry
 * ============================================================
 */
import express from "express";
import cors from "cors";
import NodeCache from "node-cache";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load config from root portfolio.config.js
const { config } = await import(
    path.resolve(__dirname, "../portfolio.config.js")
);

const app = express();

// Cache: 30-minute TTL
const cache = new NodeCache({ stdTTL: config.cache.ttl, checkperiod: 120 });

app.use(cors());
app.use(express.json());

// Utility: Wrap with cache
async function withCache(key, fn) {
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const data = await fn();
    cache.set(key, data);
    return data;
}

// Helper to get GitHub token (checks both standard and Vite-prefixed for Vercel compatibility)
const getGithubToken = () => {
    const t = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
    if (!t) return null;
    // Clean up possible whitespace or quotes from copy-pasting
    return t.trim().replace(/^['"]|['"]$/g, '');
};

// ── DEBUG ROUTE (for troubleshooting Vercel env vars) ───────────────────────────
app.get("/api/github/debug", (req, res) => {
    const token = getGithubToken();
    res.json({
        hasToken: !!token,
        tokenPrefix: token ? `${token.substring(0, 4)}... (length: ${token.length})` : "NONE",
        username: config.github,
        note: "If hasToken is false, check Vercel Project Settings > Environment Variables"
    });
});

// Utility: Fetch repositories (Pinned via GraphQL, with Starred as fallback)
async function fetchRepos() {
    const token = getGithubToken();
    const username = config.github;

    if (token) {
        const query = `query { user(login: "${username}") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name description url stargazerCount primaryLanguage { name color } updatedAt repositoryTopics(first: 5) { nodes { topic { name } } } } } } } }`;
        try {
            const gqlRes = await axios.post("https://api.github.com/graphql", { query }, { headers: { Authorization: `bearer ${token}` } });
            const pinned = gqlRes.data?.data?.user?.pinnedItems?.nodes;
            if (pinned && pinned.length > 0) {
                return pinned.map(p => ({ ...p, isPinned: true }));
            }
        } catch (err) {
            console.error("[Vercel API] GitHub GraphQL error:", err.response?.data || err.message);
        }
    }

    // Fallback: top starred repos
    const headers = token ? { Authorization: `token ${token}` } : {};
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`, { headers });
    return reposRes.data.map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stargazerCount: r.stargazers_count,
        primaryLanguage: r.language ? { name: r.language, color: null } : null,
        updatedAt: r.updated_at,
        repositoryTopics: { nodes: [] },
        isPinned: false
    }));
}

// ── GITHUB ROUTES ─────────────────────────────────────────────────────────────

app.get("/api/github/pinned", async (req, res) => {
    try {
        const data = await withCache(`github_pinned_${config.github}`, () => fetchRepos());
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/github/commits", async (req, res) => {
    try {
        const data = await withCache(`github_commits_${config.github}`, async () => {
            const token = getGithubToken();
            const headers = token ? { Authorization: `token ${token}` } : {};

            // Get the repositories to fetch commits for (check cache first, then fetch)
            let repos = cache.get(`github_pinned_${config.github}`);
            if (!repos) {
                repos = await fetchRepos();
                cache.set(`github_pinned_${config.github}`, repos);
            }

            const commitFetches = repos.slice(0, 6).map((repo) =>
                axios.get(`https://api.github.com/repos/${config.github}/${repo.name}/commits?per_page=3`, { headers })
                    .then((res) => res.data.map((c) => ({
                        sha: c.sha,
                        message: c.commit.message.split("\n")[0],
                        date: c.commit.author.date,
                        repo: repo.name,
                        repoUrl: repo.url,
                        url: c.html_url
                    })))
                    .catch(() => [])
            );

            const allCommits = (await Promise.all(commitFetches)).flat();
            return allCommits
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, config.githubSettings.showCommitCount);
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/github/contributions", async (req, res) => {
    try {
        const data = await withCache(`github_contrib_${config.github}`, async () => {
            const token = getGithubToken();
            if (!token) return null;
            const to = new Date().toISOString();
            const from = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
            const query = `query { user(login: "${config.github}") { contributionsCollection(from: "${from}", to: "${to}") { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date color } } } } } }`;
            const gqlRes = await axios.post("https://api.github.com/graphql", { query }, { headers: { Authorization: `bearer ${token}` } });
            return gqlRes.data?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/github/profile", async (req, res) => {
    try {
        const data = await withCache(`github_profile_${config.github}`, async () => {
            const token = getGithubToken();
            const headers = token ? { Authorization: `token ${token}` } : {};
            const profileRes = await axios.get(`https://api.github.com/users/${config.github}`, { headers });
            const p = profileRes.data;
            return {
                login: p.login,
                name: p.name,
                avatarUrl: p.avatar_url,
                bio: p.bio,
                followers: p.followers,
                publicRepos: p.public_repos
            };
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ── LEETCODE ROUTES ───────────────────────────────────────────────────────────
const LEETCODE_GQL = "https://leetcode.com/graphql";
const LC_HEADERS = { "Content-Type": "application/json", "Referer": "https://leetcode.com", "User-Agent": "Mozilla/5.0", "Origin": "https://leetcode.com" };

app.get("/api/leetcode/stats", async (req, res) => {
    try {
        const data = await withCache(`lc_stats_${config.leetcode}`, async () => {
            const query = `query userStats($username: String!) { matchedUser(username: $username) { username profile { ranking userAvatar realName } submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } } }`;
            const gqlRes = await axios.post(LEETCODE_GQL, { query, variables: { username: config.leetcode } }, { headers: LC_HEADERS });
            const user = gqlRes.data?.data?.matchedUser;
            if (!user) throw new Error("LeetCode user not found");
            const acStats = user.submitStats.acSubmissionNum;
            return { username: user.username, ranking: user.profile.ranking, avatar: user.profile.userAvatar, total: acStats.find(s => s.difficulty === "All")?.count || 0, easy: acStats.find(s => s.difficulty === "Easy")?.count || 0, medium: acStats.find(s => s.difficulty === "Medium")?.count || 0, hard: acStats.find(s => s.difficulty === "Hard")?.count || 0 };
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/leetcode/recent", async (req, res) => {
    try {
        const data = await withCache(`lc_recent_${config.leetcode}`, async () => {
            const query = `query recentSubmissions($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) { id title titleSlug timestamp lang runtime memory } }`;
            const gqlRes = await axios.post(LEETCODE_GQL, { query, variables: { username: config.leetcode, limit: config.leetcodeSettings.showRecentSubmissions } }, { headers: LC_HEADERS });
            const subs = gqlRes.data?.data?.recentAcSubmissionList || [];
            return subs.map((s) => ({ id: s.id, title: s.title, slug: s.titleSlug, url: `https://leetcode.com/problems/${s.titleSlug}/`, timestamp: s.timestamp, lang: s.lang, runtime: s.runtime, memory: s.memory }));
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/leetcode/heatmap", async (req, res) => {
    try {
        const data = await withCache(`lc_heatmap_${config.leetcode}`, async () => {
            const query = `query userYearlyActivity($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar totalActiveDays streak } } }`;
            const gqlRes = await axios.post(LEETCODE_GQL, { query, variables: { username: config.leetcode } }, { headers: LC_HEADERS });
            const cal = gqlRes.data?.data?.matchedUser?.userCalendar;
            if (!cal) return null;
            const rawCalendar = JSON.parse(cal.submissionCalendar || "{}");
            const heatmapData = Object.entries(rawCalendar).map(([ts, count]) => ({ date: new Date(parseInt(ts) * 1000).toISOString().split("T")[0], count }));
            return { heatmapData, totalActiveDays: cal.totalActiveDays, streak: cal.streak };
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/leetcode/topics", async (req, res) => {
    try {
        const data = await withCache(`lc_topics_${config.leetcode}`, async () => {
            const query = `query userTopicTags($username: String!) { matchedUser(username: $username) { tagProblemCounts { advanced { tagName tagSlug problemsSolved } intermediate { tagName tagSlug problemsSolved } fundamental { tagName tagSlug problemsSolved } } } }`;
            const gqlRes = await axios.post(LEETCODE_GQL, { query, variables: { username: config.leetcode } }, { headers: LC_HEADERS });
            const tagData = gqlRes.data?.data?.matchedUser?.tagProblemCounts;
            if (!tagData) return [];
            const all = [...tagData.fundamental, ...tagData.intermediate, ...tagData.advanced];
            const merged = {};
            all.forEach(({ tagName, problemsSolved }) => { merged[tagName] = (merged[tagName] || 0) + problemsSolved; });
            return Object.entries(merged).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 12);
        });
        res.json({ success: true, data });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get("/api/health", (req, res) => res.json({ status: "ok", github: config.github, leetcode: config.leetcode }));

// EXPORT FOR VERCEL
export default app;
