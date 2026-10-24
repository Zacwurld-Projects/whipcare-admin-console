import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import { RevenueCard } from "@/app/components/dashboard/overview/RevenueCard";
import { VehiclesTable } from "./VehiclesTable";

const carIcon = <img src="/icons/overview/car-vehicles.svg" alt="" className="size-4" />;

const stats = [
  { title: "Total Vehicles", value: "3,000", unit: "Vehicles" },
  { title: "Total Fleets", value: "100", unit: "Fleets" },
  { title: "Active Vehicles", value: "2,500", unit: "Vehicles" },
  { title: "Inactive Vehicles", value: "500", unit: "Vehicles" },
];

export function VehicleManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Vehicles Management</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, unit }) => (
          <OverviewStatCard
            key={title}
            title={title}
            icon={carIcon}
            value={value}
            change="12.8%"
            trend="down"
            unit={unit}
          />
        ))}
      </div>

      <RevenueCard />

      <VehiclesTable />
    </div>
  );
}
