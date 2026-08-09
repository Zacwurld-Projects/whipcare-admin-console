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
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.16667 11.1667C6.27831 11.5816 5.11138 11.8333 3.83333 11.8333C3.12272 11.8333 2.44646 11.7555 1.83333 11.6151C1.4392 11.5248 1.24213 11.4797 1.00599 11.2928C0.87131 11.1862 0.703219 10.9753 0.629411 10.8202C0.5 10.5483 0.5 10.2847 0.5 9.75735V2.57598C0.5 1.91943 1.19335 1.46849 1.83333 1.61507C2.44646 1.7555 3.12272 1.83333 3.83333 1.83333C5.11138 1.83333 6.27831 1.58158 7.16667 1.16667C8.05503 0.751758 9.22195 0.5 10.5 0.5C11.2106 0.5 11.8869 0.577832 12.5 0.718265C12.8941 0.808539 13.0912 0.853676 13.3273 1.04052C13.462 1.14709 13.6301 1.35804 13.7039 1.51311C13.8333 1.785 13.8333 2.04866 13.8333 2.57598V9.75735C13.8333 10.4139 13.14 10.8648 12.5 10.7183C11.8869 10.5778 11.2106 10.5 10.5 10.5C9.22195 10.5 8.05503 10.7518 7.16667 11.1667Z" stroke="#1E2939" />
          <path d="M0.5 13.1693C1.38836 13.5842 2.55529 13.8359 3.83333 13.8359C5.11138 13.8359 6.27831 13.5842 7.16667 13.1693C8.05503 12.7544 9.22195 12.5026 10.5 12.5026C11.778 12.5026 12.945 12.7544 13.8333 13.1693" stroke="#1E2939" strokeLinecap="round" />
          <path d="M8.83333 6.16667C8.83333 7.08714 8.08714 7.83333 7.16667 7.83333C6.24619 7.83333 5.5 7.08714 5.5 6.16667C5.5 5.24619 6.24619 4.5 7.16667 4.5C8.08714 4.5 8.83333 5.24619 8.83333 6.16667Z" stroke="#1E2939" />
          <path d="M2.8335 6.83594L2.8335 6.84193" stroke="#1E2939" stroke-width="1.33333" strokeLinecap="round" stroke-linejoin="round" />
          <path d="M11.5 5.49219L11.5 5.49818" stroke="#1E2939" stroke-width="1.33333" strokeLinecap="round" stroke-linejoin="round" />
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
