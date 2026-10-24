"use client";

import { useState } from "react";
import { ExportMenu } from "@/app/components/dashboard/ExportMenu";
import { TableFooter } from "@/app/components/dashboard/TableFooter";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import type { ExportTable } from "@/app/lib/exportTable";
import { EscrowTab, escrowTable } from "./EscrowTab";

const TABS = ["General", "Escrow", "Subscription", "Tips"] as const;
const BOOKING_TABS = ["Single Vehicle", "Fleets"] as const;

type Tab = (typeof TABS)[number];

const stats: { title: string; value: string; change: string; trend: "up" | "down" }[] = [
  { title: "Total Payment Processed", value: "₦1.7B", change: "24.8%", trend: "up" },
  { title: "Total Revenue", value: "₦100.7M", change: "24.8%", trend: "up" },
  { title: "Revenue From Subscriptions", value: "₦500M", change: "12.8%", trend: "down" },
  { title: "Revenue From Bookings", value: "₦700M", change: "12.8%", trend: "down" },
  { title: "Avg Revenue Per Booking", value: "₦30k", change: "12.8%", trend: "down" },
  { title: "Avg Revenue From Subscriptions", value: "₦50k", change: "12.8%", trend: "down" },
  { title: "Total Providers Payout", value: "₦300M", change: "12.8%", trend: "down" },
  { title: "Total Tips", value: "₦50M", change: "12.8%", trend: "down" },
];

type Booking = {
  id: string;
  vehicle: string;
  service: string;
  category: string;
  location: string;
  amount: string;
  escrow: string;
  action: "Paid" | "Pending";
};

const bookings: Booking[] = (["Paid", "Pending", "Pending", "Pending", "Paid"] as const).map((action) => ({
  id: "123467WXYZ",
  vehicle: "BMW M6 Coupe",
  service: "Inspection +2",
  category: "Completed",
  location: "No, 16 Royal villa..",
  amount: "₦270,000",
  escrow: "17-Apr-2026",
  action,
}));

const COLUMNS = ["Booking ID", "Vehicle Name", "Service(s)", "Category", "Location", "Amount", "Escrow", "Action"];
const GRID = "grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1.4fr_1fr_1fr_0.7fr] items-center gap-4 px-6";

const PAGE_SIZE = 5;
const TOTAL_ENTRIES = 500;
const TOTAL_PAGES = 10;

function CashIcon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/financials/cash.svg" alt="" width={14.33} height={14.33} />;
}

export function FinancialsPage() {
  const [tab, setTab] = useState<Tab>("General");
  const [bookingTab, setBookingTab] = useState<(typeof BOOKING_TABS)[number]>("Single Vehicle");
  const [page, setPage] = useState(1);

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ENTRIES);

  const getTable = (): ExportTable =>
    tab === "Escrow"
      ? escrowTable
      : {
          title: "Financials",
          fileName: "financials",
          headers: COLUMNS,
          rows: bookings.map((b) => [b.id, b.vehicle, b.service, b.category, b.location, b.amount, b.escrow, b.action]),
        };

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Financials</h1>

      <div className="flex items-center justify-between gap-6 rounded-xl bg-white px-6 py-[10px]">
        <div role="tablist" className="flex items-center gap-6">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`py-3 text-[14px] font-medium leading-[1.4] ${
                tab === t ? "text-[#711E00] underline" : "text-[#4A5565]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <ExportMenu getTable={getTable} label="Export Financials" />
      </div>

      {tab === "Escrow" ? (
        <EscrowTab />
      ) : tab !== "General" ? (
        <section className="flex h-[240px] items-center justify-center rounded-2xl bg-white text-[14px] text-[#6A7282]">
          {tab} will be available soon.
        </section>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ title, value, change, trend }) => (
              <OverviewStatCard
                key={title}
                title={title}
                icon={<CashIcon />}
                value={value}
                change={change}
                trend={trend}
                unit="Naira"
              />
            ))}
          </div>

          <section className="overflow-hidden rounded-2xl bg-white">
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[30px]">
                  <h2 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Bookings</h2>
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
                <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
                  Edit Commission Rate
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-[#99A1AF]" />
                <span className="size-3 rounded-full bg-[#711E00]" />
                <span className="h-px flex-1 bg-[#99A1AF]" />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[1000px]">
                <div className={`${GRID} bg-[#F3F4F6] py-1.5 text-[14px] font-semibold text-[#364153]`}>
                  {COLUMNS.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                {bookings.map((b, i) => (
                  <div
                    key={i}
                    className={`${GRID} border-b border-[#E5E7EB] py-[14px] text-[14px] font-medium text-[#101828]`}
                  >
                    <span className="text-[#4A5565]">{b.id}</span>
                    <span className="text-[#4A5565]">{b.vehicle}</span>
                    <span>{b.service}</span>
                    <span className="text-[#00A63E]">{b.category}</span>
                    <span>{b.location}</span>
                    <span>{b.amount}</span>
                    <span>{b.escrow}</span>
                    <span className={b.action === "Paid" ? "text-[#00A63E]" : "text-[#D08700]"}>{b.action}</span>
                  </div>
                ))}
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
      )}
    </div>
  );
}
