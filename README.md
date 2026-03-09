# 📊 Modern Developer Portfolio

A responsive, data-driven developer portfolio designed for modern software engineers. It integrates real-time data from **GitHub** and **LeetCode**, featuring a premium dark-themed UI with glassmorphism effects and dynamic activity trackers.

---

## 🚀 Overview

This portfolio goes beyond static pages. It is a **full-stack application** that acts as a live dashboard for your development journey.

- **GitHub Integration**: Automatically pulls your pinned repositories (or top starred ones as fallback), recent commits across all projects, and your contribution heatmap.
- **LeetCode Progress**: Showcases your problem-solving ranking, solved counts by difficulty (Easy, Medium, Hard), top topic strengths, and a custom submission heatmap.
- **Activity Dashboard**: Provides a unified "Last 24 Hours" summary of your coding and problem-solving activity.
- **Premium Design**: Built with a "Developer First" aesthetic—using dark modes, noise textures, glow effects, and smooth CSS animations.

---

## 🛠️ Technology Stack

### Frontend
- **React.js**: Powering the UI with a component-based architecture.
- **Vite**: The build tool ensuring ultra-fast HMR (Hot Module Replacement) and optimized production builds.
- **Tailwind CSS v4**: Leveraging the latest in utility-first CSS for complex, high-performance styling.
- **React Icons**: Specialized icons for languages (Java, Python) and platforms (GitHub, LeetCode).
- **Custom CSS**: Implementing specialized "noise" textures and glow animations for a premium feel.

### Backend (Proxy Server)
- **Node.js & Express**: A lightweight server that sits between the frontend and external APIs.
- **NodeCache**: An in-memory cache with a 30-minute TTL (Time To Live). This ensures the portfolio is fast and avoids hitting GitHub/LeetCode rate limits.
- **Axios**: Handles all external GraphQL and REST requests.

---

## 🏗️ Architecture: How It Works

### 1. The Proxy Pattern
To protect your **GitHub Personal Access Token** and bypass **CORS (Cross-Origin Resource Sharing)** restrictions from LeetCode, the app uses a proxy architecture:
1. The **Frontend** requests data from its own backend (e.g., `GET /api/leetcode/stats`).
2. The **Backend** checks if that data is in its **Cache**.
3. If not in cache, the backend fetches the data from GitHub/LeetCode APIs using your credentials stored in `.env.local`.
4. The backend simplifies the complex API response and returns a clean JSON to the frontend.

### 2. GraphQL & Scraping Logic
- **GitHub**: Uses the **GraphQL v4 API** to fetch "Pinned Items"—a feature not available in the standard REST API.
- **LeetCode**: Since LeetCode doesn't have an "Official" Public REST API for all stats, the backend mimics a browser request to their **GraphQL endpoint** to retrieve ranking, problem counts, and submission history.

### 3. Config-Driven Design
Personalizing the portfolio is done entirely through `portfolio.config.js`. You don't need to dig into the React code to change your bio, skills, or social links. The entire site—including the backend scrapers—reads from this single source of truth.

---

## ⚙️ Setup & Deployment

### Environment Variables
Create a `.env.local` file in the root directory:
```env
# Optional: GitHub Personal Access Token (for pinned repos/heatmap)
GITHUB_TOKEN=your_token_here_abc123

# Port for the backend API server
PORT=3001
```

### Installation
```bash
# Install all dependencies
npm install

# Start the Backend Server (Term 1)
npm run server

# Start the Frontend Development (Term 2)
npm run dev
```

### Deployment (Vercel)
The project includes a `vercel.json` and a specific folder structure (`api/`) that allows the Express backend to run as **Serverless Functions** on Vercel, making deployment free and easy.

---

## 📄 Documentation Summary

| Feature | Logic Location | API Source |
| :--- | :--- | :--- |
| GitHub Data | `server/index.js` | GitHub GraphQL + REST |
| LeetCode Stats | `server/index.js` | LeetCode GraphQL |
| UI Components | `src/components/` | Custom React + Tailwind |
| Personal Info | `portfolio.config.js` | Static Config |
| Security | Backend Proxy | Environment Variables |

---

Developed with ❤️ as a modern showcase for **Mohamed Faisal**.
