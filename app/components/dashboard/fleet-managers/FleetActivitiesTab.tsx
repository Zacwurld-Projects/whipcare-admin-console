"use client";

import { useMemo, useState } from "react";
import { TableFooter } from "../TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";

// Placeholder rows from the design; no fleet-manager activities endpoint exists yet.
const rows = Array.from({ length: 6 }, (_, key) => ({
  key,
  type: "Booked a Service",
  description: "Booked a mechanic for car repair.",
  dateTime: "Nov 12, 2024 . 09:32AM",
}));

const headClass = "whitespace-nowrap px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function FleetActivitiesTab({ query }: { query: string }) {
  const [page, setPage] = useState(1);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.type, r.description].some((v) => v.toLowerCase().includes(term)));
  }, [query]);

  return (
    <section className="overflow-hidden rounded-2xl bg-white">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Activities</h3>
          <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
            View All
          </button>
        </div>
        <div className="mt-3">
          <SectionDivider />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <thead>
            <tr className="bg-[#F3F4F6]">
              <th className={`${headClass} w-[34%]`}>Activity Type</th>
              <th className={`${headClass} w-[40%]`}>Description</th>
              <th className={headClass}>Date &amp; time</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  No activities found
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.key} className="h-[52px] border-b border-[#E5E7EB]">
                  <td className={`${cellClass} truncate text-[#4A5565]`}>{row.type}</td>
                  <td className={`${cellClass} truncate text-[#101828]`}>{row.description}</td>
                  <td className={`${cellClass} whitespace-nowrap text-[#101828]`}>{row.dateTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TableFooter page={page} totalPages={10} first={1} last={13} total={800} onPageChange={setPage} />
    </section>
  );
}
