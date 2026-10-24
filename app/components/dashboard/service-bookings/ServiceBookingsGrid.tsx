"use client";

import { useState } from "react";
import { BookingDetailsDrawer } from "./BookingDetailsDrawer";

export type Category = "Completed" | "Ongoing" | "Cancelled";

const categoryClass: Record<Category, string> = {
  Completed: "text-[#00A63E]",
  Ongoing: "text-[#D08700]",
  Cancelled: "text-[#E7000B]",
};

// Placeholder rows from the design; no bookings-list endpoint is wired up yet.
const categories: Category[] = Array.from({ length: 12 }, (_, i) => (["Completed", "Ongoing", "Cancelled"] as const)[i % 3]);
export const bookingRows = categories.map((category, key) => ({
  key,
  id: "123467WXYZ",
  owner: "Isaac Zacwurld",
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

export function BookingsGrid({ rows }: { rows: typeof bookingRows }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-[#F3F4F6]">
                <th className={headClass}>Booking ID</th>
                <th className={headClass}>Vehicle Owner</th>
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
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.key}
                    onClick={() => setSelected(String(row.key))}
                    className="h-[52px] cursor-pointer border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >
                    <td className={`${cellClass} text-[#4A5565]`}>{row.id}</td>
                    <td className={`${cellClass} text-[#4A5565]`}>{row.owner}</td>
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

      <BookingDetailsDrawer open={selected !== null} onClose={() => setSelected(null)} />
    </>
  );
}
