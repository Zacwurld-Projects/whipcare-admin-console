"use client";

import Link from "next/link";
import { useState } from "react";
import { DateFilterBar } from "@/app/components/dashboard/DateFilterBar";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import { TableFooter } from "@/app/components/dashboard/TableFooter";
import { SectionDivider } from "../vehicle-owners/VehicleOwnersGrid";
import { ActivitiesTable, makeActivityRows } from "./ActivitiesTable";

const PAGE_SIZE = 10;
const TOTAL_ENTRIES = 800;

const stats = [
  { title: "Total Activities", icon: "analytics" },
  { title: "Completed Activities", icon: "completed" },
  { title: "Pending Activities", icon: "pending" },
  { title: "Cancelled Activities", icon: "cancelled" },
];

export function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ENTRIES);
  const rows = makeActivityRows(first, last);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Activities</h1>
        <DateFilterBar />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, icon }) => (
          <OverviewStatCard
            key={title}
            title={title}
            icon={<img src={`/icons/activities/${icon}.svg`} alt="" className="size-4" />}
            value={554}
            change="12.8%"
            trend="down"
            unit="Activities"
          />
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">Activities</h2>
            <Link href="/dashboard/activities/list" className="text-[12px] font-medium text-primary underline">
              View All
            </Link>
          </div>
          <div className="mt-3">
            <SectionDivider />
          </div>
        </div>

        <div className="mt-4">
          <ActivitiesTable rows={rows} />
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
