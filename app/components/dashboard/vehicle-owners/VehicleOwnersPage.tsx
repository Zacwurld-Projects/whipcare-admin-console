import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { CustomerMapping } from "@/app/components/dashboard/CustomerMapping";
import { UserCountChart } from "@/app/components/dashboard/UserCountChart";
import { OverviewStatCard, TrendBadge } from "@/app/components/dashboard/overview/OverviewStatCard";
import { VehicleOwnersTable } from "./VehicleOwnersTable";

const userIcon = <img src="/icons/overview/user.svg" alt="" className="size-4" />;

const stats = [
  { title: "New User Sign Up", value: 21, change: "50.8%", trend: "up" },
  { title: "Total Users", value: 504, change: "50.8%", trend: "up" },
  { title: "No of Active Users", value: 400, change: "45.2%", trend: "up" },
  { title: "No of Inactive Users", value: 104, change: "12.8%", trend: "down" },
  { title: "No of Subscribed Users", value: 310, change: "12.8%", trend: "down" },
] as const;

const growth = [
  { title: "User Growth", value: "200", change: "50.8%" },
  { title: "Subscription rate", value: "80.4%", change: "50.8%" },
  { title: "Churn Rate", value: "50.4%", change: "50.8%" },
];

export function VehicleOwnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Vehicle Owners</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {stats.map(({ title, value, change, trend }) => (
          <OverviewStatCard
            key={title}
            title={title}
            icon={userIcon}
            value={value}
            change={change}
            trend={trend}
            unit="Vehicle Owners"
          />
        ))}
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 flex-col gap-6">
          <UserCountChart />
          <div className="grid gap-6 sm:grid-cols-3">
            {growth.map(({ title, value, change }) => (
              <section key={title} className="rounded-2xl bg-white p-4">
                <h3 className="text-[14px] font-semibold text-[#364153]">{title}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[32px] font-medium leading-[1.4] text-[#1E2939]">{value}</span>
                  <TrendBadge change={change} isUp />
                </div>
              </section>
            ))}
          </div>
        </div>
        <CustomerMapping />
      </div>

      <VehicleOwnersTable />
    </div>
  );
}
