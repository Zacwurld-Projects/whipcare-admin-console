"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { curveCardinal } from "d3-shape";

const monthlyData = [
  { name: "JAN", count: 180 },
  { name: "FEB", count: 80 },
  { name: "MAR", count: 280 },
  { name: "APR", count: 180 },
  { name: "MAY", count: 320 },
  { name: "JUN", count: 380 },
  { name: "JULY", count: 280 },
  { name: "AUG", count: 180 },
  { name: "SEPT", count: 380 },
  { name: "OCT", count: 250 },
  { name: "NOV", count: 180 },
  { name: "DEC", count: 380 },
];

const weeklyData = [
  { name: "W1", count: 120 },
  { name: "W2", count: 60 },
  { name: "W3", count: 200 },
  { name: "W4", count: 140 },
  { name: "W5", count: 260 },
  { name: "W6", count: 320 },
  { name: "W7", count: 220 },
  { name: "W8", count: 150 },
  { name: "W9", count: 340 },
  { name: "W10", count: 210 },
  { name: "W11", count: 160 },
  { name: "W12", count: 360 },
];

const cardinal = curveCardinal.tension(0.2);

const axisTickStyle = { fill: "#9CA3AF", fontSize: 11 };

export function UserCountChart() {
  const [period, setPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  const data = useMemo(
    () => (period === "Monthly" ? monthlyData : weeklyData),
    [period],
  );

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1F2937]">User Count</h3>
        <div className="flex rounded-full bg-[#FDF3F0] p-1">
          {(["Monthly", "Weekly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${period === p
                  ? "bg-[#FE915D] text-white shadow-sm"
                  : "text-[#4B5563] hover:text-[#374151]"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <AreaChart
        style={{ width: "100%", height: 280 }}
        responsive
        data={data}
        margin={{ top: 8, right: 16, left: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient id="userCountGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FE915D" stopOpacity={0.45} />
            <stop offset="55%" stopColor="#FE915D" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#FE915D" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#E5E7EB"
          strokeDasharray="4 4"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={axisTickStyle}
          dy={10}
          interval={0}
        />
        <YAxis
          domain={[0, 500]}
          ticks={[0, 100, 200, 300, 400, 500]}
          axisLine={false}
          tickLine={false}
          tick={axisTickStyle}
          width={36}
          label={{
            angle: -90,
            position: "insideLeft",
            offset: 12,
            style: {
              fill: "#9CA3AF",
              fontSize: 11,
              textAnchor: "middle",
            },
          }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #F3F4F6",
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
          labelStyle={{ color: "#6B7280", fontWeight: 500 }}
          itemStyle={{ color: "#711E00" }}
        />
        <Area
          type={cardinal}
          dataKey="count"
          stroke="#711E00"
          strokeWidth={2}
          fill="url(#userCountGradient)"
          activeDot={{ r: 4, fill: "#711E00", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </div>
  );
}
