"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchUserBookings, type UserBooking } from "@/app/lib/api";
import { TableFooter } from "../../TableFooter";
import { SectionDivider } from "../VehicleOwnersGrid";

const PAGE_SIZE = 6;
const na = "N/A";

type Category = "Completed" | "Ongoing" | "Cancelled";

const categoryClass: Record<Category, string> = {
  Completed: "text-[#00A63E]",
  Ongoing: "text-[#D08700]",
  Cancelled: "text-[#E7000B]",
};

function getCategory(status?: string | null, paidOut?: boolean | null): Category | null {
  const value = status?.trim().toLowerCase() ?? "";
  if (!value) return null;
  if (/cancel/.test(value)) return "Cancelled";
  if (paidOut || /complete|finished|delivered|closed|paid/.test(value)) return "Completed";
  return "Ongoing";
}

function formatNaira(value?: number | null) {
  if (value === null || value === undefined) return na;
  return `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value)}`;
}

function formatDate(value?: string | null) {
  if (!value) return na;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return na;
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "-");
}

type Row = {
  id: string;
  vehicle: string;
  services: string;
  provider: string;
  category: Category | null;
  location: string;
  amount: string;
  fee: string;
  date: string;
};

function mapBooking(booking: UserBooking): Row {
  const car = booking.cars?.[0];
  const services = booking.preferredServices ?? [];
  const [firstService, ...otherServices] = services;
  const extra = otherServices.length + (booking.materials?.length ?? 0);

  return {
    id: booking.id,
    vehicle: [car?.brand, car?.carModel].filter(Boolean).join(" ") || na,
    services: firstService ? `${firstService}${extra ? ` +${extra}` : ""}` : na,
    provider: booking.serviceType?.trim() || na,
    category: getCategory(booking.status, booking.paidOut),
    location: booking.tripLocations?.[0]?.pickupLocation?.address || na,
    amount: formatNaira(booking.agreedAmount),
    fee: formatNaira(booking.serviceProviderCut),
    date: formatDate(booking.createdAt),
  };
}

const headClass = "whitespace-nowrap px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "whitespace-nowrap px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function BookingsTab({ userId, query }: { userId: string; query: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);

    fetchUserBookings(userId, { page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data.map(mapBooking));
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
    return rows.filter((r) =>
      [r.id, r.vehicle, r.services, r.provider, r.location].some((v) => v.toLowerCase().includes(term)),
    );
  }, [rows, query]);

  const first = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const last = (page - 1) * PAGE_SIZE + rows.length;

  return (
    <section className="overflow-hidden rounded-2xl bg-white">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Bookings</h3>
          <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
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
              <th className={headClass}>Vehicle Name</th>
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
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  Loading bookings…
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                  No bookings found
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.id} className="h-[52px] border-b border-[#E5E7EB]">
                  <td className={`${cellClass} max-w-[160px] truncate text-[#4A5565]`}>{row.id}</td>
                  <td className={`${cellClass} text-[#4A5565]`}>{row.vehicle}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.services}</td>
                  <td className={`${cellClass} text-[#4A5565]`}>{row.provider}</td>
                  <td className={`${cellClass} ${row.category ? categoryClass[row.category] : "text-[#4A5565]"}`}>
                    {row.category ?? na}
                  </td>
                  <td className={`${cellClass} max-w-[200px] truncate text-[#101828]`}>{row.location}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.amount}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.fee}</td>
                  <td className={`${cellClass} text-[#101828]`}>{row.date}</td>
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
