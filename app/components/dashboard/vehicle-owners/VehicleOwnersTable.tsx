"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { fetchUsers } from "@/app/lib/api";
import { SearchIcon } from "../icons";
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

export function VehicleOwnersTable() {
  const [activeTab, setActiveTab] = useState<OwnerTab>("Active Users");
  const [rows, setRows] = useState<OwnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "2026-01-01", to: "2026-05-31" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchUsers({ page: 1, limit: 10, type: VEHICLE_OWNER_TYPE });
        if (!cancelled) setRows(res.data.map((u, i) => mapUserToRow(u, i)));
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
  }, []);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => [r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(term)));
  }, [rows, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-4">
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

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h3 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">User Info</h3>
            <OwnerTabs active={activeTab} onChange={setActiveTab} />
            <Link
              href="/dashboard/vehicle-owners/user-info"
              className="ml-auto text-[12px] font-medium text-[#711E00] underline"
            >
              View All
            </Link>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <OwnersGrid rows={visibleRows} loading={loading} />
        </div>
      </section>
    </div>
  );
}
