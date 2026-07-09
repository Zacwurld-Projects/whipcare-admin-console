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
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#F3F4F6" />
          <path d="M8.38505 14.3198C7.44187 14.8814 4.96891 16.0281 6.47511 17.4631C7.21087 18.164 8.03033 18.6654 9.06058 18.6654H14.9394C15.9697 18.6654 16.7891 18.164 17.5249 17.4631C19.0311 16.0281 16.5581 14.8814 15.615 14.3198C13.4032 13.0028 10.5968 13.0028 8.38505 14.3198Z" stroke="#141B34" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15 8.33203C15 9.98889 13.6569 11.332 12 11.332C10.3431 11.332 9 9.98889 9 8.33203C9 6.67518 10.3431 5.33203 12 5.33203C13.6569 5.33203 15 6.67518 15 8.33203Z" stroke="#141B34" />
        </svg>

        <p className="text-[14px] font-bold text-[#364153]">{title}</p>
      </div>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-3xl font-medium text-[#1E2939]">{value}</span>
        <span
          className={`mb-1 flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-500"
            }`}
        >
          {isUp ? <TrendUpIcon /> : <TrendDownIcon />}
          {change}
        </span>
      </div>
      <p className="mt-1 text-xs text-[#6A7282]">{subtitle}</p>
    </div>
  );
}
