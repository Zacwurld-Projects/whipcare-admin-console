"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "../icons";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import { BusinessGrid, businessRows } from "./FleetManagersGrid";
import { OwnerTabs, SectionDivider, type OwnerTab } from "../vehicle-owners/VehicleOwnersGrid";

export function FleetManagersTable() {
  const [activeTab, setActiveTab] = useState<OwnerTab>("Active Users");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return businessRows;
    return businessRows.filter((r) => [r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(term)));
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-4">
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

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Business Info</h3>
            <OwnerTabs active={activeTab} onChange={setActiveTab} />
            <Link
              href="/dashboard/fleet-managers/business-info"
              className="ml-auto text-[12px] font-medium text-[#711E00] underline"
            >
              View All
            </Link>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <BusinessGrid rows={visibleRows} />
        </div>
      </section>
    </div>
  );
}
