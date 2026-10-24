"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "../icons";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import { TableFooter } from "../TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";
import { BookingsGrid, bookingRows } from "./ServiceBookingsGrid";

const subTabs = ["Single Vehicle", "Fleets"] as const;
type SubTab = (typeof subTabs)[number];

export function ServiceBookingsListPage() {
  const [subTab, setSubTab] = useState<SubTab>("Single Vehicle");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return bookingRows;
    return bookingRows.filter((r) =>
      [r.id, r.owner, r.services, r.provider, r.location].some((v) => v.toLowerCase().includes(term)),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/service-bookings"
            aria-label="Back to Service Bookings"
            className="flex size-6 items-center justify-center text-[#711E00]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Bookings</h1>
        </div>

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
      </div>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Bookings</h3>
            <div className="flex items-center gap-4 text-[12px] font-medium text-[#4A5565]">
              {subTabs.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSubTab(name)}
                  className={subTab === name ? "text-black underline underline-offset-2" : "hover:underline"}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <BookingsGrid rows={visibleRows} />
        </div>

        <TableFooter
          page={page}
          totalPages={10}
          first={visibleRows.length ? 1 : 0}
          last={visibleRows.length}
          total={500}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
