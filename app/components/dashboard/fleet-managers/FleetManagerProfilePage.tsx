"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { SearchIcon } from "../icons";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import { FleetActivitiesTab } from "./FleetActivitiesTab";
import { FleetBookingsTab } from "./FleetBookingsTab";
import { ProfileStat } from "../vehicle-owners/profile/ProfileSummary";
import { InfoTile } from "../vehicle-owners/profile/PersonalInfoPanel";
import {
  DisputeCard,
  Pager,
  SectionShell,
  SeeBookings,
  Stars,
  cardClass,
  sampleDisputes,
} from "../vehicle-owners/profile/ReviewsDisputesPanel";

const tabs = ["User Information", "Bookings", "Activities"] as const;
type Tab = (typeof tabs)[number];

const icon = (name: string) => `/icons/profile/${name}.svg`;

const bookingsIcon = (
  <span className="relative block size-4">
    <img src="/icons/overview/car-bookings.svg" alt="" className="absolute left-0 top-[0.76px] h-[12.4px] w-[13.65px]" />
    <img src="/icons/overview/gear-bookings.svg" alt="" className="absolute left-[6.1px] top-[0.76px] size-[9.14px]" />
  </span>
);
const cashIcon = <img src={icon("cash")} alt="" className="size-[13.3px]" />;
const vehiclesIcon = <img src="/icons/overview/car-vehicles.svg" alt="" className="size-4" />;
const giftIcon = <img src={icon("gift")} alt="" className="size-4" />;

// Placeholder values from the design; no fleet-manager profile endpoint exists yet.
const business = {
  name: "Whipcare Transcorp",
  email: "WhipcareTranscrop@gmail.com",
  phone: "+1 453 6780 690",
  signUp: "01/08/2024",
  lastLogin: "01/08/2024",
  nationality: "Nigeria",
  language: "English",
  address: "290 m near Grand Play Lekki Lagos",
};

const fleet = [
  { id: "1", favourite: true },
  { id: "2", favourite: true },
  { id: "3", favourite: true },
  { id: "4", favourite: false },
  { id: "5", favourite: false },
];

const feedback = [0, 1].map((id) => ({
  id,
  rating: 4,
  time: "2 days ago",
  text: "John was fantastic! He arrived on time, explained everything clearly, and did a great job changing my oil. I will definitely be using him again.",
}));

function BusinessCard() {
  return (
    <section className="relative flex flex-col items-center gap-4 rounded-2xl bg-white px-6 pb-6 pt-6">
      <button type="button" aria-label="Flag business" className="absolute left-3 top-3 size-6">
        <img src={icon("flag")} alt="" className="m-auto h-[18px] w-4" />
      </button>
      <button type="button" aria-label="More actions" className="absolute right-3 top-3 size-6">
        <img src={icon("kebab")} alt="" className="m-auto h-[18px] w-1" />
      </button>

      <div className="flex flex-col items-center gap-3">
        <div className="flex size-[120px] items-center justify-center rounded-full bg-[#F3F4F6]">
          <img src={icon("avatar-user")} alt="" className="h-[75px] w-[65px]" />
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-[#F3F4F6] pl-2">
          <span className="text-[10px] font-medium leading-[1.4] text-[#711E00]">Active sub</span>
          <span className="flex rounded-2xl bg-[#E5E7EB] p-1.5">
            <img src={icon("star-yellow")} alt="" className="size-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[18px] font-semibold leading-[1.4] text-[#1D2739]">{business.name}</p>
        <div className="flex flex-col gap-1 text-[14px] font-medium leading-[1.4] text-[#6A7282]">
          <p className="break-all">{business.email}</p>
          <p>{business.phone}</p>
        </div>
      </div>
    </section>
  );
}

function BusinessStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <ProfileStat title="Total Bookings" icon={bookingsIcon} value={100} unit="Bookings" change="30.2%" trend="up" />
      <ProfileStat title="Ongoing Bookings" icon={bookingsIcon} value={4} unit="Bookings" change="12.8%" trend="down" />
      <ProfileStat title="Completed Bookings" icon={bookingsIcon} value={250} unit="Bookings" change="30.2%" trend="up" />
      <ProfileStat title="Total Fleets" icon={vehiclesIcon} value={25} unit="Vehicles" change="12.8%" trend="down" />
      <ProfileStat title="Total Cost" icon={cashIcon} value="₦1.3M" unit="Naira" change="24.8%" trend="up" />
      <ProfileStat title="Avg Cost per Vehicle" icon={cashIcon} value="₦100k" unit="Naira" change="12.8%" trend="down" />
      <ProfileStat title="Total Vehicles" icon={vehiclesIcon} value={300} unit="Vehicles" change="12.8%" trend="down" />
      <ProfileStat title="Whip Point" icon={giftIcon} value={50} note="= ₦50k" unit="Point" change="12.8%" trend="down" />
    </div>
  );
}

function PersonalInfo() {
  const [selected, setSelected] = useState(fleet[0].id);

  return (
    <section className="rounded-2xl bg-white p-4">
      <h3 className="text-[14px] font-semibold text-[#364153]">Personal Information</h3>

      <div className="mt-3 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoTile label="Sign up date" value={business.signUp} />
          <InfoTile label="Last login date" value={business.lastLogin} />
          <InfoTile label="Nationality" value={business.nationality} />
          <InfoTile label="Language" value={business.language} />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#F9FAFB] px-4 py-4">
          <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#711E00]">
            <img src={icon("location")} alt="" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium leading-[1.45] text-[#101928]">Address</p>
            <p className="truncate text-[15px] text-[#868782]">{business.address}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-[#F9FAFB] p-4 sm:flex-row">
          <div className="flex w-full flex-col items-center gap-4 sm:w-[250px] sm:shrink-0">
            <div className="relative h-[114px] w-[250px]">
              <span className="absolute left-0 top-0 z-10 rounded bg-[#711E00] px-1.5 py-0.5 text-[10px] font-medium text-white">
                25
              </span>
              <img src={icon("car-shadow")} alt="" className="absolute bottom-0 left-0 h-[60px] w-full" />
              <img src="/images/profile/car.png" alt="Selected vehicle" className="absolute left-[19px] top-0 h-[86px] w-[212px] object-cover" />
            </div>
            <div className="w-full rounded-md bg-[#F3F4F6] p-2">
              <div className="flex items-center justify-between rounded bg-white p-1.5">
                <span className="text-[10px] font-medium leading-[1.4] text-black">Vehicle Health Score</span>
                <span className="flex size-[22.7px] items-center justify-center rounded bg-[#711E00] text-[10px] font-medium text-white">
                  90
                </span>
              </div>
            </div>
            <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
              See Fleet Infomation
            </button>
          </div>

          <ul className="notification-scroll flex max-h-[220px] min-w-0 flex-1 flex-col gap-2 overflow-y-auto pr-3">
            {fleet.map(({ id, favourite }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`flex h-[38px] w-full items-center justify-between rounded-lg border bg-white px-[7px] ${
                    selected === id ? "border-[#711E00]" : "border-[#F3F4F6]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#F7F9FC]">
                      <img src={icon("car-fill")} alt="" className="size-[16.9px]" />
                    </span>
                    <span className="text-[12px] leading-[1.4] text-[#101928]">Whipcare Transport Vehicle</span>
                  </span>
                  <img src={icon(favourite ? "star-yellow" : "star-grey")} alt="" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeedbackDisputes() {
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [disputePage, setDisputePage] = useState(1);

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white p-4">
      <SectionShell
        title="Feedback(10)"
        tone="grey"
        pager={<Pager page={feedbackPage} totalPages={10} onChange={setFeedbackPage} />}
      >
        {feedback.map((item) => (
          <article key={item.id} className={cardClass}>
            <div className="flex w-full flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <Stars rating={item.rating} />
                <span className="text-[14px] text-[#667185]">{item.time}</span>
              </div>
              <p className="text-[14px] leading-[1.4] text-[#4A5565]">{item.text}</p>
            </div>
            <SeeBookings />
          </article>
        ))}
      </SectionShell>

      <SectionShell
        title="Disputes(10)"
        tone="grey"
        pager={<Pager page={disputePage} totalPages={10} onChange={setDisputePage} />}
      >
        {sampleDisputes.map((dispute) => (
          <DisputeCard key={dispute.id} dispute={dispute} />
        ))}
      </SectionShell>
    </section>
  );
}

export function FleetManagerProfilePage() {
  const [tab, setTab] = useState<Tab>("User Information");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/fleet-managers/business-info"
          aria-label="Back to Business Info"
          className="flex size-6 items-center justify-center text-[#711E00]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Business Profile</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[212px_minmax(0,1fr)]">
        <BusinessCard />
        <BusinessStats />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" className="flex flex-wrap items-center gap-3">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={`rounded-md px-3 py-1.5 text-[16px] font-medium leading-[1.4] ${
                tab === name
                  ? "border border-[#711E00] bg-[#F9FAFB] px-2 text-[#711E00]"
                  : "bg-white text-[#364153] hover:bg-[#F9FAFB]"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {tab !== "User Information" && (
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
            <div className="relative h-[34px] w-full max-w-[400px] flex-1 rounded-lg bg-white">
              <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#6A7282]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-full w-full rounded-lg bg-transparent pl-10 pr-4 text-[12px] font-medium text-[#364153] outline-none placeholder:text-[#6A7282]"
              />
            </div>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              buttonClassName="h-auto rounded-md border-0 bg-white px-3 py-1.5 text-[16px] font-medium text-[#364153]"
            />
          </div>
        )}
      </div>

      {tab === "User Information" ? (
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <PersonalInfo />
          <FeedbackDisputes />
        </div>
      ) : tab === "Bookings" ? (
        <FleetBookingsTab query={query} />
      ) : (
        <FleetActivitiesTab query={query} />
      )}
    </div>
  );
}
