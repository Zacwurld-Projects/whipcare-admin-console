import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { UserCountChart } from "@/app/components/dashboard/UserCountChart";
import { CustomerMapping } from "@/app/components/dashboard/CustomerMapping";
import { TierUpgradeReview } from "@/app/components/dashboard/TierUpgradeReview";
import { UserInfoTable } from "@/app/components/dashboard/UserInfoTable";

export default function ServiceProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal text-[#1D2739]">Service Providers</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="New User Sign Up" value={21} change="+50.8%" trend="up" subtitle="Service Providers" />
        <StatCard title="Total Users" value={504} change="+50.8%" trend="up" subtitle="Service Providers" />
        <StatCard title="No of Active Users" value={400} change="+45.2%" trend="up" subtitle="Service Providers" />
        <StatCard title="No of Inactive Users" value={104} change="-12.8%" trend="down" subtitle="Service Providers" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <UserCountChart />
        <CustomerMapping />
      </div>

      <TierUpgradeReview />

      <UserInfoTable />
    </div>
  );
}
