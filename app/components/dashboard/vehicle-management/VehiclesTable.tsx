"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "../icons";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import { TableFooter } from "../TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";
import { VehiclesGrid, filterVehicles, fleetSampleRow, sampleRow, type VehicleRow } from "./VehiclesGrid";

const tabs = ["Single Vehicle", "Fleets"] as const;
type Tab = (typeof tabs)[number];

const TOTAL_ENTRIES = 500;
const PAGE_SIZE = 3;

const singleRows: VehicleRow[] = Array.from({ length: PAGE_SIZE }, () => sampleRow);
const fleetRows: VehicleRow[] = Array.from({ length: PAGE_SIZE }, () => fleetSampleRow);

export function VehiclesTable() {
  const [activeTab, setActiveTab] = useState<Tab>("Single Vehicle");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  const visibleRows = useMemo(
    () => filterVehicles(activeTab === "Fleets" ? fleetRows : singleRows, query),
    [activeTab, query],
  );

  const first = (page - 1) * PAGE_SIZE + 1;

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
          <div className="flex flex-wrap items-center gap-x-[30px] gap-y-2">
            <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Vehicles Info</h3>
            <div className="flex items-center gap-4 text-[12px] font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`${activeTab === tab ? "text-black underline underline-offset-2" : "text-[#4A5565] hover:underline"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Link href="/dashboard/vehicle-management/list" className="ml-auto text-[12px] font-medium text-[#711E00] underline">
              View All
            </Link>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <VehiclesGrid rows={visibleRows} firstNo={first} tab={activeTab} />
        </div>

        <TableFooter
          page={page}
          totalPages={Math.ceil(TOTAL_ENTRIES / PAGE_SIZE)}
          first={first}
          last={first + PAGE_SIZE - 1}
          total={TOTAL_ENTRIES}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
