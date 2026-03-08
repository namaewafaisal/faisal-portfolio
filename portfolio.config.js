/**
 * ============================================================
 * PORTFOLIO CONFIGURATION FILE
 * ============================================================
 * Edit this file to set your usernames and personal details.
 * The backend server and frontend will read from here.
 * ============================================================
 */

export const config = {
    // ── Personal Info ──────────────────────────────────────────
    name: "Mohamed Faisal",
    title: "Software Developer | Java | Spring Boot | Linux",
    bio: "Java Developer and Linux enthusiast passionate about building scalable backend applications and improving problem-solving skills.",
    location: "India",
    email: "mohamed.faisal.4626@gmail.com",

    // ── Social Links ───────────────────────────────────────────
    github: "namaewafaisal",          // GitHub username
    leetcode: "namaewafaisal",        // LeetCode username
    linkedin: "https://www.linkedin.com/in/mohamed-faisal-811418351/",
    hackerrank: "namaewafaisal",

    // ── GitHub Settings ────────────────────────────────────────
    githubSettings: {
        pinnedReposFallback: "starred",  // "starred" if no pinned repos
        showCommitCount: 5,              // How many recent commits to show
    },

    // ── LeetCode Settings ──────────────────────────────────────
    leetcodeSettings: {
        showRecentSubmissions: 5,        // How many recent accepted subs to show
    },

    // ── Cache Settings (in seconds) ────────────────────────────
    cache: {
        ttl: 1800, // 30 minutes
    },

    // ── Skills (Static - you control this) ────────────────────
    skills: {
        Languages: ["Java", "Python", "C", "JavaScript", "Solidity", "Assembly"],
        Backend: ["Spring Boot", "Spring Security (JWT)", "REST APIs", "Microservices", "Node.js"],
        Frontend: ["React.js", "Vite", "HTML5", "TailwindCSS"],
        Databases: ["MySQL", "MongoDB"],
        Tools: ["Git", "GitHub", "Linux", "Hyprland", "Docker (learning)"],
    },
};
