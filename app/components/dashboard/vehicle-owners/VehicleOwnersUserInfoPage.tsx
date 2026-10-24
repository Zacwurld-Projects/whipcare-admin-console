"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fetchUsers } from "@/app/lib/api";
import { SearchIcon } from "../icons";
import { ExportMenu } from "../ExportMenu";
import { TableFooter } from "../TableFooter";
import type { ExportTable } from "@/app/lib/exportTable";
import { DateRangePicker, type DateRange } from "../DateRangePicker";
import {
  OwnerTabs,
  OwnersGrid,
  SectionDivider,
  VEHICLE_OWNER_TYPE,
  mapUserToRow,
  type OwnerRow,
  type OwnerTab,
} from "./VehicleOwnersGrid";

const PAGE_SIZE = 13;

export function VehicleOwnersUserInfoPage() {
  const [activeTab, setActiveTab] = useState<OwnerTab>("Active Users");
  const [rows, setRows] = useState<OwnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchUsers({ page, limit: PAGE_SIZE, type: VEHICLE_OWNER_TYPE });
        if (cancelled) return;
        const offset = (res.meta.page - 1) * res.meta.limit;
        setRows(res.data.map((u, i) => mapUserToRow(u, i, offset)));
        setTotal(res.meta.total);
        setTotalPages(Math.max(res.meta.totalPages, 1));
      } catch (err) {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Failed to load vehicle owners");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(term)));
  }, [rows, query]);

  function getExportTable(): ExportTable {
    return {
      title: "Vehicle Owners — User Info",
      fileName: "vehicle-owners",
      headers: ["No", "User Name", "Email address", "Phone", "Sign Up Date", "Last Login Date", "Subscription"],
      rows: visibleRows.map((r) => [
        String(r.no),
        r.name,
        r.email,
        r.phone,
        r.signUp,
        r.lastLogin,
        r.subscribed ? "Active" : "Inactive",
      ]),
    };
  }

  const first = rows.length ? rows[0].no : 0;
  const last = rows.length ? rows[rows.length - 1].no : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/vehicle-owners"
            aria-label="Back to Vehicle Owners"
            className="flex size-6 items-center justify-center text-[#711E00]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 12H4m0 0 6-6m-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">User Info</h1>
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

      <section className="rounded-2xl bg-white">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">User Info</h3>
            <OwnerTabs active={activeTab} onChange={setActiveTab} />

            <div className="ml-auto">
              <ExportMenu getTable={getExportTable} />
            </div>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <OwnersGrid rows={visibleRows} loading={loading} />
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
    </div>
  );
}
