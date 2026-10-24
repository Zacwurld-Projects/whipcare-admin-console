"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const axisTick = { fill: "#555", fontSize: 10, fontWeight: 500 };

type CappedBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  background?: { x: number; y: number; width: number; height: number };
};

// Light-grey column with a 4px primary cap, as in the design.
function CappedBar({ x = 0, y = 0, width = 0, height = 0, background }: CappedBarProps) {
  const barWidth = Math.min(width, 48);
  const barX = x + (width - barWidth) / 2;
  const bottom = background ? background.y + background.height : y + height;

  return (
    <g>
      <rect x={barX} y={y} width={barWidth} height={Math.max(bottom - y, 0)} fill="#F3F4F6" />
      <rect x={barX} y={y} width={barWidth} height={4} fill="#711E00" />
    </g>
  );
}

type CappedBarChartProps = {
  data: { name: string; value: number }[];
  max: number;
  step: number;
  height: number;
  formatTick?: (value: number) => string;
  yLabel?: string;
};

export function CappedBarChart({ data, max, step, height, formatTick, yLabel }: CappedBarChartProps) {
  const ticks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#D1D5DC" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} interval={0} />
        <YAxis
          domain={[0, max]}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tick={axisTick}
          tickFormatter={formatTick}
          width={yLabel ? 52 : 36}
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: "insideLeft", style: { ...axisTick, textAnchor: "middle" } }
              : undefined
          }
        />
        <Bar dataKey="value" shape={<CappedBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
