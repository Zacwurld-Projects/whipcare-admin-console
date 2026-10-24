"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserProfile, type UserProfileData } from "@/app/lib/api";
import { SearchIcon } from "../../icons";
import { DateRangePicker, type DateRange } from "../../DateRangePicker";
import { ActivitiesTab } from "./ActivitiesTab";
import { BookingsTab } from "./BookingsTab";
import { PersonalInfoPanel } from "./PersonalInfoPanel";
import { ProfileCard, ProfileStats } from "./ProfileSummary";
import { ReviewsDisputesPanel } from "./ReviewsDisputesPanel";

const tabs = ["User Information", "Bookings", "Activities"] as const;
type Tab = (typeof tabs)[number];

export function VehicleOwnerProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id ?? "";
  const [profile, setProfile] = useState<UserProfileData>();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("User Information");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    fetchUserProfile(userId)
      .then((res) => {
        if (!cancelled) setProfile(res.data);
      })
      .catch(() => {
        // Keep the layout stable and show N/A values when the profile can't be loaded.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/vehicle-owners/user-info"
          aria-label="Back to User Info"
          className="flex size-6 items-center justify-center text-[#711E00]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">User Profile</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[212px_minmax(0,1fr)]">
        <ProfileCard profile={profile} loading={loading} />
        <ProfileStats profile={profile} />
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
          <PersonalInfoPanel profile={profile} />
          <ReviewsDisputesPanel userId={userId} />
        </div>
      ) : tab === "Bookings" ? (
        <BookingsTab userId={userId} query={query} />
      ) : (
        <ActivitiesTab userId={userId} query={query} />
      )}
    </div>
  );
}
