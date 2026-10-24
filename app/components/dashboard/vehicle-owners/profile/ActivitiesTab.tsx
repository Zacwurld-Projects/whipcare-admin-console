"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchUserActivities, type UserActivity } from "@/app/lib/api";
import { TableFooter } from "../../TableFooter";
import { SectionDivider } from "../VehicleOwnersGrid";

const PAGE_SIZE = 6;
const na = "N/A";

type Row = {
  id: string;
  type: string;
  description: string;
  dateTime: string;
};

// e.g. "Nov 12, 2024 . 09:32AM"
function formatDateTime(value?: string | null) {
  if (!value) return na;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return na;

  const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    .format(date)
    .replace(" ", "");
  return `${day} . ${time}`;
}

function mapActivity(activity: UserActivity, index: number): Row {
  return {
    id: activity.id ?? String(index),
    type: activity.activityType?.trim() || na,
    description: activity.description?.trim() || na,
    dateTime: formatDateTime(activity.createdAt),
  };
}

const headClass = "whitespace-nowrap px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function ActivitiesTab({ userId, query }: { userId: string; query: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);

    fetchUserActivities(userId, { page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data.map(mapActivity));
        setTotal(res.meta?.total ?? res.data.length);
        setTotalPages(Math.max(res.meta?.totalPages ?? 1, 1));
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, page]);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.type, r.description].some((v) => v.toLowerCase().includes(term)));
  }, [rows, query]);

  const first = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const last = (page - 1) * PAGE_SIZE + rows.length;

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
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  Loading activities…
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  No activities found
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.id} className="h-[52px] border-b border-[#E5E7EB]">
                  <td className={`${cellClass} truncate text-[#4A5565]`}>{row.type}</td>
                  <td className={`${cellClass} truncate text-[#101828]`}>{row.description}</td>
                  <td className={`${cellClass} whitespace-nowrap text-[#101828]`}>{row.dateTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TableFooter
        page={page}
        totalPages={totalPages}
        first={first}
        last={last}
        total={total}
        onPageChange={setPage}
      />
    </section>
  );
}
