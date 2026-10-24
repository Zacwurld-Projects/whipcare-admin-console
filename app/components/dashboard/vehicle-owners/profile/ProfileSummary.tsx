/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { UserProfileData } from "@/app/lib/api";
import { TrendBadge } from "../../overview/OverviewStatCard";

const icon = (name: string) => `/icons/profile/${name}.svg`;

export function ProfileCard({ profile, loading }: { profile?: UserProfileData; loading: boolean }) {
  const user = profile?.user;
  const name = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || (loading ? "Loading…" : "N/A");
  const subscribed = user?.tier !== null && user?.tier !== undefined;

  return (
    <section className="relative flex flex-col items-center gap-4 rounded-2xl bg-white px-6 pb-6 pt-6">
      <button type="button" aria-label="Flag user" className="absolute left-3 top-3 size-6">
        <img src={icon("flag")} alt="" className="m-auto h-[18px] w-4" />
      </button>
      <button type="button" aria-label="More actions" className="absolute right-3 top-3 size-6">
        <img src={icon("kebab")} alt="" className="m-auto h-[18px] w-1" />
      </button>

      <div className="flex flex-col items-center gap-3">
        <div className="flex size-[120px] items-center justify-center overflow-hidden rounded-full bg-[#F3F4F6]">
          {user?.image ? (
            <img src={user.image} alt="" className="size-full object-cover" />
          ) : (
            <img src={icon("avatar-user")} alt="" className="h-[75px] w-[65px]" />
          )}
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-[#F3F4F6] pl-2">
          <span className="text-[10px] font-medium leading-[1.4] text-[#711E00]">
            {subscribed ? "Active sub" : "No sub"}
          </span>
          <span className="flex rounded-2xl bg-[#E5E7EB] p-1.5">
            <img src={icon(subscribed ? "star-yellow" : "star-grey")} alt="" className="size-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[18px] font-semibold leading-[1.4] text-[#1D2739]">{name}</p>
        <div className="flex flex-col gap-1 text-[14px] font-medium leading-[1.4] text-[#6A7282]">
          <p className="break-all">{user?.email || "N/A"}</p>
          <p>{user?.phone || "N/A"}</p>
        </div>
      </div>
    </section>
  );
}

type StatProps = {
  title: string;
  icon: ReactNode;
  value: string | number;
  unit: string;
  change: string;
  trend: "up" | "down";
  note?: string;
};

export function ProfileStat({ title, icon: statIcon, value, unit, change, trend, note }: StatProps) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center gap-1">
        <span className="flex size-6 items-center justify-center rounded bg-[#F3F4F6]">{statIcon}</span>
        <p className="text-[14px] font-semibold text-[#364153]">{title}</p>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-mb-1 flex items-center gap-2">
          <span className="text-[32px] font-medium leading-[1.4] text-[#1E2939]">{value}</span>
          {note && <span className="text-[12px] font-medium text-[#6A7282]">{note}</span>}
          <TrendBadge change={change} isUp={trend === "up"} />
        </div>
        <p className="text-[12px] font-medium leading-[1.4] text-[#6A7282]">{unit}</p>
      </div>
    </div>
  );
}

const bookingsIcon = (
  <span className="relative block size-4">
    <img src="/icons/overview/car-bookings.svg" alt="" className="absolute left-0 top-[0.76px] h-[12.4px] w-[13.65px]" />
    <img src="/icons/overview/gear-bookings.svg" alt="" className="absolute left-[6.1px] top-[0.76px] size-[9.14px]" />
  </span>
);
const cashIcon = <img src={icon("cash")} alt="" className="size-[13.3px]" />;
const vehiclesIcon = <img src="/icons/overview/car-vehicles.svg" alt="" className="size-4" />;
const giftIcon = <img src={icon("gift")} alt="" className="size-4" />;

const na = "N/A";
const show = (value: number | null | undefined) => (value === null || value === undefined ? na : value);

// Trend percentages are placeholders from the design; the profile API does not return them.
export function ProfileStats({ profile }: { profile?: UserProfileData }) {
  const m = profile?.metrics;
  const points = m?.whipPoints ?? profile?.user?.whipPoints;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <ProfileStat title="Total Bookings" icon={bookingsIcon} value={show(m?.totalBookings)} unit="Bookings" change="30.2%" trend="up" />
      <ProfileStat title="Ongoing Bookings" icon={bookingsIcon} value={show(m?.ongoingBookings)} unit="Bookings" change="12.8%" trend="down" />
      <ProfileStat title="Completed Bookings" icon={bookingsIcon} value={show(m?.completedBookings)} unit="Bookings" change="30.2%" trend="up" />
      <ProfileStat title="Cancelled Bookings" icon={bookingsIcon} value={na} unit="Bookings" change="12.8%" trend="down" />
      <ProfileStat title="Total Cost" icon={cashIcon} value={na} unit="Naira" change="24.8%" trend="up" />
      <ProfileStat title="Avg Cost per Vehicle" icon={cashIcon} value={na} unit="Naira" change="12.8%" trend="down" />
      <ProfileStat title="Total Vehicles" icon={vehiclesIcon} value={show(m?.totalVehicles)} unit="Vehicles" change="12.8%" trend="down" />
      <ProfileStat
        title="Whip Point"
        icon={giftIcon}
        value={show(points)}
        note={typeof points === "number" ? `= ₦${(points * 1000).toLocaleString("en-NG")}` : undefined}
        unit="Point"
        change="12.8%"
        trend="down"
      />
    </div>
  );
}
