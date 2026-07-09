import { TrendUpIcon, TrendDownIcon } from "./icons";

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  subtitle: string;
};

export function StatCard({ title, value, change, trend, subtitle }: StatCardProps) {
  const isUp = trend === "up";

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span
          className={`mb-1 flex items-center gap-0.5 text-xs font-semibold ${
            isUp ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isUp ? <TrendUpIcon /> : <TrendDownIcon />}
          {change}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}
