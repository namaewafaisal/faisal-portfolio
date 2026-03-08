/**
 * Shared UI components used across sections.
 * - SectionLoader: skeleton loading animation
 * - ErrorCard: error message display
 * - SectionTitle: consistent heading style
 */
import React from "react";

export function SectionLoader({ rows = 3 }) {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/10" />
            ))}
        </div>
    );
}

export function ErrorCard({ message }) {
    return (
        <div className="w-full p-5 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
            <span className="font-bold">Failed to load:</span> {message}
        </div>
    );
}

export function SectionTitle({ children }) {
    return (
        <h2 className="text-3xl font-bold mb-10 tracking-tight flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full inline-block" />
            {children}
        </h2>
    );
}

export function Badge({ children, color = "blue" }) {
    const colors = {
        blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        green: "bg-green-500/15 text-green-300 border-green-500/30",
        orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        red: "bg-red-500/15 text-red-300 border-red-500/30",
        purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
        gray: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    };
    return (
        <span className={`inline-block px-2 py-0.5 text-xs rounded-md border font-mono ${colors[color] || colors.blue}`}>
            {children}
        </span>
    );
}
