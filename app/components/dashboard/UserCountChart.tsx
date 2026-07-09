"use client";

import { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const data = [30, 45, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85];

export function UserCountChart() {
  const [period, setPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  const width = 560;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (v / max) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">User Count</h3>
        <div className="flex rounded-lg border border-slate-200 p-0.5">
          {(["Monthly", "Weekly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-[#FE915D] text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FE915D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FE915D" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + chartH * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#areaGradient)" />
        <path d={linePath} fill="none" stroke="#FE915D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {months.map((m, i) => (
          <text
            key={m}
            x={padding.left + (i / (months.length - 1)) * chartW}
            y={height - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
          >
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}
