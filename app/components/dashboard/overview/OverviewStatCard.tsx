import type { ReactNode } from "react";

type OverviewStatCardProps = {
  title: string;
  icon: ReactNode;
  value: string | number;
  change: string;
  trend: "up" | "down";
  unit: string;
  action?: ReactNode;
};

export function OverviewStatCard({ title, icon, value, change, trend, unit, action }: OverviewStatCardProps) {
  const isUp = trend === "up";

  return (
    <div className="relative rounded-2xl bg-white p-4">
      <div className="flex items-center gap-1">
        <span className="flex size-6 items-center justify-center rounded bg-[#F3F4F6]">{icon}</span>
        <p className="text-[14px] font-semibold text-[#364153]">{title}</p>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-mb-1 flex items-center gap-2">
          <span className="text-[32px] font-medium leading-[1.4] text-[#1E2939]">{value}</span>
          <TrendBadge change={change} isUp={isUp} />
        </div>
        <p className="text-[12px] font-medium leading-[1.4] text-[#6A7282]">{unit}</p>
      </div>
      {action && <div className="absolute bottom-4 right-4">{action}</div>}
    </div>
  );
}

export function TrendBadge({ change, isUp }: { change: string; isUp: boolean }) {
  return (
    <span
      className={`flex items-center justify-center gap-0.5 rounded px-1 py-0.5 text-[14px] font-semibold leading-[1.4] ${
        isUp ? "bg-[#F0FDF4] text-[#008236]" : "bg-[#FEF2F2] text-[#C10007]"
      }`}
    >
      {change}
      <span className="flex size-6 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isUp ? "/icons/overview/arrow-up.svg" : "/icons/overview/arrow-down.svg"}
          alt=""
          width={13.5}
          height={13.5}
          className={isUp ? "" : "-scale-y-100"}
        />
      </span>
    </span>
  );
}
