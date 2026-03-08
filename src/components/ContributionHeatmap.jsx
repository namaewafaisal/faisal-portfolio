/**
 * ContributionHeatmap
 * ─────────────────────────────────────────────────────────────
 * A custom SVG-based heatmap calendar component.
 * Works for both GitHub contributions and LeetCode submissions.
 *
 * Props:
 *   data        - Array of { date: "YYYY-MM-DD", count: number }
 *   colorScale  - Array of 5 CSS colors (0 submissions → max)
 *   title       - Label shown above the heatmap
 *   totalLabel  - Label for the total count shown
 */
import React, { useState, useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getColor(count, maxCount, colorScale) {
    if (count === 0) return colorScale[0];
    const ratio = count / maxCount;
    if (ratio < 0.25) return colorScale[1];
    if (ratio < 0.5) return colorScale[2];
    if (ratio < 0.75) return colorScale[3];
    return colorScale[4];
}

export default function ContributionHeatmap({
    data = [],
    colorScale = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    title = "Activity",
    totalLabel = "contributions",
}) {
    const [tooltip, setTooltip] = useState(null);

    // Build a map of date → count for O(1) lookup
    const dateMap = useMemo(() => {
        const m = {};
        data.forEach(({ date, count }) => { m[date] = count; });
        return m;
    }, [data]);

    const maxCount = useMemo(
        () => Math.max(1, ...data.map((d) => d.count)),
        [data]
    );

    const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);

    // Build 52-week grid, starting from Sunday 52 weeks ago
    const weeks = useMemo(() => {
        const today = new Date();
        // Align to last Sunday
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 52 * 7);

        const grid = [];
        let current = new Date(startDate);

        for (let w = 0; w < 53; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateStr = current.toISOString().split("T")[0];
                week.push({
                    date: dateStr,
                    count: dateMap[dateStr] || 0,
                    dayOfWeek: d,
                    month: current.getMonth(),
                    day: current.getDate(),
                });
                current.setDate(current.getDate() + 1);
            }
            grid.push(week);
        }
        return grid;
    }, [dateMap]);

    const CELL = 13; // cell size
    const GAP = 3;   // gap between cells
    const STEP = CELL + GAP;

    // Build month labels
    const monthLabels = useMemo(() => {
        const labels = [];
        weeks.forEach((week, wi) => {
            const firstDay = week[0];
            if (firstDay.day <= 7) {
                labels.push({ month: MONTHS[firstDay.month], x: wi * STEP });
            }
        });
        return labels;
    }, [weeks]);

    const svgWidth = weeks.length * STEP;
    const svgHeight = 7 * STEP + 20; // 7 rows + label space

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">
                    <span className="text-white font-semibold">{total.toLocaleString()}</span>{" "}
                    {totalLabel} in the last year
                </span>
                {/* Legend */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>Less</span>
                    {colorScale.map((c, i) => (
                        <div
                            key={i}
                            style={{ background: c, width: 11, height: 11, borderRadius: 2 }}
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {/* Scrollable on mobile */}
            <div className="overflow-x-auto">
                <svg
                    width={svgWidth + 28}
                    height={svgHeight}
                    style={{ fontFamily: "monospace" }}
                >
                    {/* Month labels */}
                    {monthLabels.map(({ month, x }) => (
                        <text
                            key={`${month}-${x}`}
                            x={x + 28}
                            y={10}
                            fontSize={10}
                            fill="#6b7280"
                        >
                            {month}
                        </text>
                    ))}

                    {/* Day labels */}
                    {["Mon", "Wed", "Fri"].map((day, i) => (
                        <text
                            key={day}
                            x={4}
                            y={20 + (i * 2 + 1) * STEP + CELL / 2}
                            fontSize={9}
                            fill="#6b7280"
                            dominantBaseline="middle"
                        >
                            {day}
                        </text>
                    ))}

                    {/* Heatmap cells */}
                    {weeks.map((week, wi) =>
                        week.map((cell, di) => {
                            const color = getColor(cell.count, maxCount, colorScale);
                            const cx = wi * STEP + 28;
                            const cy = di * STEP + 20;
                            return (
                                <g key={`${wi}-${di}`}>
                                    <rect
                                        x={cx}
                                        y={cy}
                                        width={CELL}
                                        height={CELL}
                                        rx={2}
                                        ry={2}
                                        fill={color}
                                        stroke="rgba(255,255,255,0.04)"
                                        strokeWidth={0.5}
                                        style={{ cursor: "pointer" }}
                                        onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setTooltip({
                                                date: cell.date,
                                                count: cell.count,
                                                x: rect.left + window.scrollX + CELL / 2,
                                                y: rect.top + window.scrollY - 28,
                                            });
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                </g>
                            );
                        })
                    )}
                </svg>
            </div>

            {/* Tooltip rendered outside SVG */}
            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none text-xs bg-gray-900 border border-white/20 text-white px-2 py-1 rounded-lg shadow-lg"
                    style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
                >
                    <strong>{tooltip.count}</strong> {totalLabel} on {tooltip.date}
                </div>
            )}
        </div>
    );
}
