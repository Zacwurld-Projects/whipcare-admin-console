"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "../icons";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import { TableFooter } from "../TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";
import { ActivitiesTable, makeActivityRows } from "./ActivitiesTable";

const PAGE_SIZE = 13;
const TOTAL_ENTRIES = 800;

export function ActivitiesListPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ENTRIES);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const rows = makeActivityRows(first, last);
    if (!term) return rows;
    return rows.filter((r) => [r.user, r.type, r.description, r.date].some((v) => v.toLowerCase().includes(term)));
  }, [query, first, last]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/activities"
            aria-label="Back to Activities"
            className="flex size-6 items-center justify-center text-[#711E00]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Activities</h1>
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
          <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Activities</h3>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <ActivitiesTable rows={visibleRows} />
        </div>

        <TableFooter
          page={page}
          totalPages={Math.ceil(TOTAL_ENTRIES / PAGE_SIZE)}
          first={first}
          last={last}
          total={TOTAL_ENTRIES}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
