"use client";

import { useMemo, useState } from "react";
import { TableFooter } from "../TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";

type Category = "Completed" | "Ongoing" | "Cancelled";
const subTabs = ["Single Vehicle", "Fleets"] as const;
type SubTab = (typeof subTabs)[number];

const categoryClass: Record<Category, string> = {
  Completed: "text-[#00A63E]",
  Ongoing: "text-[#D08700]",
  Cancelled: "text-[#E7000B]",
};

// Placeholder rows from the design; no fleet-manager bookings endpoint exists yet.
const categories: Category[] = ["Completed", "Ongoing", "Cancelled", "Completed", "Ongoing", "Cancelled"];
const rows = categories.map((category, i) => ({
  id: "123467WXYZ",
  key: i,
  name: "Whipcare Transport",
  services: "Inspection +2",
  provider: "Mechanic",
  category,
  location: "No, 16 Royal villa..",
  amount: "₦300,000",
  fee: "₦30,000",
  date: "17-Apr-2026",
}));

const headClass = "whitespace-nowrap px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "whitespace-nowrap px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function FleetBookingsTab({ query }: { query: string }) {
  const [subTab, setSubTab] = useState<SubTab>("Fleets");
  const [page, setPage] = useState(1);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.id, r.name, r.services, r.provider, r.location].some((v) => v.toLowerCase().includes(term)));
  }, [query]);

  return (
    <section className="overflow-hidden rounded-2xl bg-white">
      <div className="p-6 pb-0">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Bookings</h3>
          <div className="flex items-center gap-4 text-[12px] font-medium text-[#101828]">
            {subTabs.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSubTab(name)}
                className={subTab === name ? "underline underline-offset-2" : "hover:underline"}
              >
                {name}
              </button>
            ))}
          </div>
          <button type="button" className="ml-auto text-[12px] font-medium text-[#711E00] underline">
            View All
          </button>
        </div>
        <div className="mt-3">
          <SectionDivider />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-[#F3F4F6]">
              <th className={headClass}>Booking ID</th>
              <th className={headClass}>{subTab === "Fleets" ? "Fleet Name" : "Vehicle Name"}</th>
              <th className={headClass}>Service(s)</th>
              <th className={headClass}>Provider</th>
              <th className={headClass}>Category</th>
              <th className={headClass}>location</th>
              <th className={headClass}>Amount</th>
              <th className={headClass}>Service Fee</th>
              <th className={headClass}>Date</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  No bookings found
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.key} className="h-[52px] border-b border-[#E5E7EB]">
                  <td className={`${cellClass} text-[#4A5565]`}>{row.id}</td>
                  <td className={`${cellClass} text-[#4A5565]`}>{row.name}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.services}</td>
                  <td className={`${cellClass} text-[#4A5565]`}>{row.provider}</td>
                  <td className={`${cellClass} ${categoryClass[row.category]}`}>{row.category}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.location}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.amount}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.fee}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TableFooter page={page} totalPages={10} first={1} last={6} total={500} onPageChange={setPage} />
    </section>
  );
}
