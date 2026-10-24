"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { curveCardinal } from "d3-shape";
import { TrendBadge } from "./OverviewStatCard";
import { CappedBarChart } from "./charts";

// Values in millions of naira.
const revenueByMonth = [
  { name: "JAN", value: 1 },
  { name: "FEB", value: 6 },
  { name: "MAR", value: 12 },
  { name: "APR", value: 9 },
  { name: "MAY", value: 19 },
  { name: "JUN", value: 20 },
  { name: "JULY", value: 13 },
  { name: "AUG", value: 17 },
  { name: "SEPT", value: 9 },
  { name: "OCT", value: 10 },
  { name: "NOV", value: 20 },
  { name: "DEC", value: 18 },
];

const revenueByProvider = [
  { name: "Mechanic", value: 15 },
  { name: "Detailer", value: 25 },
  { name: "Technician", value: 10 },
  { name: "Wash", value: 5 },
  { name: "Hauler", value: 20 },
];

const cardinal = curveCardinal.tension(0.2);
const axisTick = { fill: "#555", fontSize: 8, fontWeight: 500 };
const formatMillions = (value: number) => (value === 0 ? "0" : `${value}M`);

export function RevenueCard() {
  return (
    <section className="rounded-2xl bg-white p-4">
      <h3 className="text-[14px] font-semibold text-[#364153]">Revenue</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[32px] font-medium leading-[1.4] text-[#1E2939]">₦100.7M</span>
        <TrendBadge change="12.8%" isUp={false} />
      </div>

      <div className="mt-4 grid gap-6 xl:grid-cols-[596px_1fr]">
        <div className="rounded-lg bg-[#F9FAFB] p-4">
          <ResponsiveContainer width="100%" height={176}>
            <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F1A68B" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#F1A68B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#D1D5DC" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} interval={0} />
              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                axisLine={false}
                tickLine={false}
                tick={{ ...axisTick, fontSize: 10 }}
                tickFormatter={formatMillions}
                width={32}
              />
              <Tooltip
                formatter={(value) => [`₦${value}M`, "Revenue"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #F3F4F6", fontSize: 12 }}
              />
              <Area
                type={cardinal}
                dataKey="value"
                stroke="#711E00"
                strokeWidth={1.5}
                fill="url(#revenueGradient)"
                activeDot={{ r: 4, fill: "#711E00", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <CappedBarChart data={revenueByProvider} max={30} step={5} height={236} formatTick={formatMillions} />
      </div>
    </section>
  );
}
