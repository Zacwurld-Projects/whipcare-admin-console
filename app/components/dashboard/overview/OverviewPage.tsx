import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { OverviewStatCard } from "./OverviewStatCard";
import { RevenueCard } from "./RevenueCard";
import { CappedBarChart } from "./charts";

const lastUpdated = "Last updated: June 10, 2025";

const serviceTypes = [
  { name: "Mechanic", value: 150 },
  { name: "Detailer", value: 250 },
  { name: "Technician", value: 100 },
  { name: "Wash", value: 50 },
  { name: "Hauler", value: 200 },
];

const efficiency = [
  { label: "Service completion rate", percent: 90 },
  { label: "Repeat service rate", percent: 80 },
  { label: "Service cancellation rate", percent: 50 },
  { label: "Customer satisfaction rate", percent: 60 },
];

const activities = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  title: "Brake Service Order Cancelled",
  description: "Some important information will appear here",
  time: "13 secs ago",
}));

const cardIconClass = "size-4";

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Overview</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <OverviewStatCard
          title="New User Sign Up"
          icon={<img src="/icons/overview/user.svg" alt="" className={cardIconClass} />}
          value={54}
          change="50.8%"
          trend="up"
          unit="Users"
        />
        <OverviewStatCard
          title="Ongoing Bookings"
          icon={
            <span className="relative block size-4">
              <img src="/icons/overview/car-bookings.svg" alt="" className="absolute left-0 top-[0.76px] h-[12.4px] w-[13.65px]" />
              <img src="/icons/overview/gear-bookings.svg" alt="" className="absolute left-[6.1px] top-[0.76px] size-[9.14px]" />
            </span>
          }
          value={100}
          change="12.8%"
          trend="down"
          unit="Bookings"
        />
        <OverviewStatCard
          title="New Added Vehicles"
          icon={<img src="/icons/overview/car-vehicles.svg" alt="" className={cardIconClass} />}
          value={30}
          change="45.2%"
          trend="up"
          unit="Vehicle(s)"
        />
      </div>

      <RevenueCard />

      <div className="grid gap-6 xl:grid-cols-[388px_1fr_372px]">
        <section className="rounded-2xl bg-white p-4 xl:row-span-2">
          <h3 className="text-[14px] font-semibold text-[#364153]">Service Type</h3>
          <div className="mt-6">
            <CappedBarChart data={serviceTypes} max={350} step={50} height={280} yLabel="Bookings" />
          </div>
        </section>

        <div className="flex flex-col gap-6 xl:row-span-2">
          <section className="rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#364153]">Payment Method</h3>
              <span className="text-[12px] text-[#475367]">{lastUpdated}</span>
            </div>
            <div className="mt-5 h-6 overflow-hidden rounded bg-[#E5E7EB]">
              <div className="h-full w-1/2 bg-[#711E00]" />
            </div>
            <div className="mt-[15px] flex items-center justify-between text-[12px] font-medium text-[#1E2939]">
              <span className="flex items-center gap-0.5">
                <span className="size-2 rounded-[2px] bg-[#711E00]" />
                Card
              </span>
              <span className="flex items-center gap-0.5">
                Transfer
                <span className="size-2 rounded-[2px] bg-[#E5E7EB]" />
              </span>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#364153]">Service Efficiency</h3>
              <span className="text-[12px] text-[#475367]">{lastUpdated}</span>
            </div>
            <ul className="mt-5 space-y-4">
              {efficiency.map(({ label, percent }) => (
                <li key={label} className="flex items-center justify-between text-[12px] font-medium">
                  <span className="text-[#1E2939]">{label}</span>
                  <span className="flex items-center gap-2.5">
                    <span className="h-3 w-[120px] overflow-hidden rounded-[2px] bg-[#E5E7EB]">
                      <span className="block h-full bg-[#711E00]" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="w-8 text-[#555]">{percent}%</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl bg-white p-4 xl:row-span-2">
          <h3 className="text-[14px] font-semibold text-[#364153]">Recent Activities</h3>
          <ul className="mt-3 space-y-4">
            {activities.map(({ id, title, description, time }) => (
              <li key={id} className="relative rounded-2xl bg-[#F9FAFB] p-4">
                <div className="flex gap-3">
                  <img src="/icons/overview/caution.svg" alt="" className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0 pr-16">
                    <p className="text-[14px] font-medium leading-[1.4] text-[#333]">{title}</p>
                    <p className="mt-1 text-[12px] font-medium leading-[1.4] text-[#6A7282]">{description}</p>
                  </div>
                </div>
                <span className="absolute right-4 top-4 text-[10px] leading-[1.5] text-[#A0A0A0]">{time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
