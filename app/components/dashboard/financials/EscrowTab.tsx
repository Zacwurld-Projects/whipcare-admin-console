"use client";

import { useMemo, useState } from "react";
import { DateRangePicker } from "@/app/components/dashboard/DateRangePicker";
import { TableFooter } from "@/app/components/dashboard/TableFooter";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import type { ExportTable } from "@/app/lib/exportTable";

const STATUS_TABS = ["Completed Bookings", "Ongoing Bookings"] as const;
const BOOKING_TABS = ["Single Vehicle", "Fleets"] as const;

const stats = [
  { title: "Total Money In Escrow", value: "₦1.7B" },
  { title: "Money Released Automatically", value: "₦500m" },
  { title: "Money Released Manually", value: "₦50M" },
  { title: "Money Available for Release", value: "₦600M" },
];

const COLUMNS = [
  "Booking ID",
  "Vehicle Name",
  "Service(s)",
  "Category",
  "Location",
  "Escrow",
  "Date",
];
const GRID =
  "grid grid-cols-[1.3fr_1.3fr_1.2fr_1.2fr_1.6fr_1.2fr_1fr] items-center gap-4 px-6";

type Row = string[];

const makeRows = (category: string): Row[] =>
  Array.from({ length: 7 }, () => [
    "123467WXYZ",
    "BMW M6 Coupe",
    "Inspection +2",
    category,
    "No, 16 Royal villa..",
    "₦270,000",
    "17-Apr-2026",
  ]);

const rowsByStatus = {
  "Completed Bookings": makeRows("Completed"),
  "Ongoing Bookings": makeRows("Ongoing"),
} as const;

const PAGE_SIZE = 7;
const TOTAL_ENTRIES = 500;
const TOTAL_PAGES = 10;

function CashIcon() {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img src="/icons/financials/cash.svg" alt="" width={14.33} height={14.33} />
  );
}

export const escrowTable: ExportTable = {
  title: "Escrow",
  fileName: "escrow",
  headers: COLUMNS,
  rows: rowsByStatus["Completed Bookings"],
};

export function EscrowTab() {
  const [status, setStatus] =
    useState<(typeof STATUS_TABS)[number]>("Completed Bookings");
  const [bookingTab, setBookingTab] =
    useState<(typeof BOOKING_TABS)[number]>("Single Vehicle");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visible = useMemo(() => {
    const rows = rowsByStatus[status];
    const q = query.trim().toLowerCase();
    return q
      ? rows.filter((r) => r.some((c) => c.toLowerCase().includes(q)))
      : rows;
  }, [query, status]);

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ENTRIES);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value }) => (
          <OverviewStatCard
            key={title}
            title={title}
            icon={<CashIcon />}
            value={value}
            change="24.8%"
            trend="up"
            unit="Naira"
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" className="flex items-center gap-3">
          {STATUS_TABS.map((t) => {
            const selected = status === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setStatus(t);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-[16px] font-medium leading-[1.4] ${
                  selected
                    ? "border border-[#711E00] bg-[#F9FAFB] px-2 text-[#711E00]"
                    : "bg-white text-[#364153]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex h-[34px] w-[400px] max-w-full items-center gap-2 rounded-lg bg-white px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/financials/search.svg"
              alt=""
              width={16}
              height={16}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              aria-label="Search bookings"
              className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#1E2939] outline-none placeholder:text-[#6A7282]"
            />
          </label>
          <DateRangePicker buttonClassName="!h-[34px] !rounded-md !border-0 !px-3 !text-[16px] !font-medium !text-[#364153]" />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-[30px]">
            <h2 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">
              {status}
            </h2>
            <div className="flex items-center gap-4">
              {BOOKING_TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={bookingTab === t}
                  onClick={() => setBookingTab(t)}
                  className={`text-[12px] font-medium leading-[1.4] ${
                    bookingTab === t ? "text-black underline" : "text-[#4A5565]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2" aria-hidden="true">
            <span className="h-px flex-1 bg-[#99A1AF]" />
            <span className="size-3 rounded-full bg-[#711E00]" />
            <span className="h-px flex-1 bg-[#99A1AF]" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className={`${GRID} bg-[#F3F4F6] py-1.5 text-[14px] font-semibold text-[#364153]`}
            >
              {COLUMNS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="px-6 py-10 text-center text-[14px] text-[#6A7282]">
                No bookings match your search.
              </p>
            ) : (
              visible.map((r, i) => (
                <div
                  key={i}
                  className={`${GRID} border-b border-[#E5E7EB] py-[14px] text-[14px] font-medium text-[#101828]`}
                >
                  <span className="text-[#4A5565]">{r[0]}</span>
                  <span className="text-[#4A5565]">{r[1]}</span>
                  <span>{r[2]}</span>
                  <span
                    className={
                      r[3] === "Ongoing" ? "text-[#D08700]" : "text-[#00A63E]"
                    }
                  >
                    {r[3]}
                  </span>
                  <span>{r[4]}</span>
                  <span>{r[5]}</span>
                  <span>{r[6]}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <TableFooter
          page={page}
          totalPages={TOTAL_PAGES}
          first={first}
          last={last}
          total={TOTAL_ENTRIES}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
