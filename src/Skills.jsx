/**
 * Skills — Displays technology stack from portfolio.config.js
 * Grouped by category (Languages, Backend, Frontend, Tools).
 */
import React from "react";
import { SectionTitle } from "./components/ui";
import { config } from "../portfolio.config.js";

// Category-specific icons/accent colors
const CATEGORY_META = {
  Languages: { emoji: "📝", color: "blue" },
  Backend: { emoji: "⚙️", color: "green" },
  Frontend: { emoji: "🎨", color: "purple" },
  Databases: { emoji: "🗄️", color: "yellow" },
  Tools: { emoji: "🛠️", color: "orange" },
};

const COLOR_CLASSES = {
  blue: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60",
  green: "border-green-500/30 bg-green-500/5 hover:border-green-500/60",
  purple: "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60",
  yellow: "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60",
  orange: "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60",
};

const BADGE_COLORS = {
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  green: "bg-green-500/15 text-green-300 border-green-500/25",
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  yellow: "bg-yellow-500/15 text-yellow-200 border-yellow-500/25",
  orange: "bg-orange-500/15 text-orange-300 border-orange-500/25",
};

export default function Skills() {
  const categories = Object.entries(config.skills);

  return (
    <section id="skills" className="max-w-6xl mx-auto px-6 py-20">
      <SectionTitle>Skills & Stack</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(([category, items]) => {
          const meta = CATEGORY_META[category] || { emoji: "⚡", color: "blue" };
          const colorKey = meta.color;

          return (
            <div
              key={category}
              className={`p-5 rounded-xl border transition-all duration-300 ${COLOR_CLASSES[colorKey] || COLOR_CLASSES.blue}`}
            >
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>{meta.emoji}</span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 text-xs rounded-md border font-mono ${BADGE_COLORS[colorKey] || BADGE_COLORS.blue}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}