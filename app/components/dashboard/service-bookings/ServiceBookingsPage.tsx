/* eslint-disable @next/next/no-img-element */
import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import { RevenueCard } from "@/app/components/dashboard/overview/RevenueCard";
import { ServiceBookingsTable } from "./ServiceBookingsTable";

const bookingsIcon = (
  <span className="relative block size-4">
    <img src="/icons/overview/car-bookings.svg" alt="" className="absolute left-0 top-[0.76px] h-[12.4px] w-[13.65px]" />
    <img src="/icons/overview/gear-bookings.svg" alt="" className="absolute left-[6.1px] top-[0.76px] size-[9.14px]" />
  </span>
);

const viewAll = <span className="text-[12px] font-medium leading-[1.4] text-[#711E00] underline">View All</span>;

export function ServiceBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Service Bookings</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStatCard title="Total Bookings" icon={bookingsIcon} value={100} change="30.2%" trend="up" unit="Bookings" />
        <OverviewStatCard title="Completed Bookings" icon={bookingsIcon} value={250} change="30.2%" trend="up" unit="Bookings" />
        <OverviewStatCard title="Cancelled Bookings" icon={bookingsIcon} value={15} change="12.8%" trend="down" unit="Bookings" />
        <OverviewStatCard
          title="Total Available Services"
          icon={bookingsIcon}
          value={350}
          change="12.8%"
          trend="down"
          unit="Services"
          action={viewAll}
        />
      </div>

      <RevenueCard />

      <ServiceBookingsTable />
    </div>
  );
}
