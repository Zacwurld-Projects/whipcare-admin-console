"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  asTierLevel,
  fetchTierUpgrades,
  getTierUpgradeDisplayName,
  type TierUpgradeApplication,
  type TierUpgradeStatus,
} from "@/app/lib/api";
import { SearchIcon, TierShield } from "./icons";
import { DateRangePicker, type DateRange } from "./DateRangePicker";
import { TierUpgradeDetailsDrawer } from "./TierUpgradeDetailsDrawer";

const tabs = ["Pending", "Approved", "Rejected"] as const;
const PAGE_LIMIT = 10;

const tabToStatus: Record<(typeof tabs)[number], TierUpgradeStatus> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected",
};

function buildPageNumbers(current: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(totalPages - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-[18px] bg-[#F3F4F6] pr-2">
      <TierShield tier={tier} />
      <span className="text-xs font-medium text-primary">Tier {tier}</span>
    </span>
  );
}

export function TierUpgradeReviewPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<TierUpgradeApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TierUpgradeApplication | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: "2026-01-01",
    to: "2026-05-31",
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchTierUpgrades({
          status: tabToStatus[activeTab],
          page: currentPage,
          limit: PAGE_LIMIT,
        });
        if (cancelled) return;
        setApplications(res.data);
        setTotal(res.meta.total);
        setTotalPages(Math.max(1, res.meta.totalPages));
      } catch (err) {
        if (cancelled) return;
        setApplications([]);
        setTotal(0);
        setTotalPages(1);
        toast.error(err instanceof Error ? err.message : "Failed to load tier upgrades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [activeTab, currentPage, reloadToken]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((app) =>
      getTierUpgradeDisplayName(app).toLowerCase().includes(q),
    );
  }, [applications, search]);

  const pages = buildPageNumbers(currentPage, totalPages);
  const startEntry = total === 0 ? 0 : (currentPage - 1) * PAGE_LIMIT + 1;
  const endEntry = Math.min(currentPage * PAGE_LIMIT, total);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/service-providers"
          className="flex items-center gap-1 text-[28px] font-normal text-[#1D2739] hover:text-[#711E00]"
        >
          <BackIcon className="text-[#1D2739]" />
          Tier upgrade review
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-44 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#FE915D]"
            />
          </div>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex gap-6 px-5 pt-4">
          <h2 className="text-[14px] font-semibold text-[#364153]">Tier upgrade review</h2>

          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#FE915D] text-[#711E00]"
                  : tab === "Rejected"
                    ? "text-[#E7000B] hover:text-[#C10007]"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5 pt-4">
          <div className="mb-4 flex items-center">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <div className="mx-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#711E00]" />
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="py-10 text-center text-sm text-slate-400">Loading requests…</p>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">No requests found</p>
            ) : (
              filtered.map((app) => {
                const fromTier = asTierLevel(app.fromTier);
                const toTier = asTierLevel(app.toTier);

                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="shrink-0 text-sm font-medium text-[#4A5565]">
                      {getTierUpgradeDisplayName(app)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-[#101828]">Requested to upgrade from</span>
                      {fromTier ? <TierBadge tier={fromTier} /> : <span className="text-slate-400">—</span>}
                      <span className="text-slate-500">to</span>
                      {toTier ? <TierBadge tier={toTier} /> : <span className="text-slate-400">—</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(app)}
                      className="shrink-0 text-sm font-medium text-primary underline hover:text-[#711E00]"
                    >
                      View details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-500">
            Showing data {startEntry} to {endEntry} of {total} entries
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <BackIcon />
            </button>

            {pages.map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                    currentPage === page
                      ? "bg-[#FE915D] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <TierUpgradeDetailsDrawer
        open={selectedRequest !== null}
        onClose={() => setSelectedRequest(null)}
        application={selectedRequest}
        onReviewed={() => setReloadToken((token) => token + 1)}
      />
    </div>
  );
}
