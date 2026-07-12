"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchUsers,
  formatUserDate,
  getUserDisplayName,
  type User,
} from "@/app/lib/api";
import {
  SearchIcon,
  MoreVerticalIcon,
  TierShield,
  ChevronDownIcon,
} from "./icons";
import { DateRangePicker, type DateRange } from "./DateRangePicker";

const tabs = ["User Info", "Active Users", "Suspended Users", "Deleted Users"] as const;
const PAGE_LIMIT = 10;

type TableRow = {
  id: string;
  no: number;
  name: string;
  email: string;
  phone: string;
  signUp: string;
  lastLogin: string;
  tier: 1 | 2 | 3 | null;
};

function mapUserToRow(user: User, index: number, page: number): TableRow {
  const tier = user.tier === 1 || user.tier === 2 || user.tier === 3 ? user.tier : null;

  return {
    id: user.id,
    no: (page - 1) * PAGE_LIMIT + index + 1,
    name: getUserDisplayName(user),
    email: user.email,
    phone: user.phone,
    signUp: "—",
    lastLogin: formatUserDate(user.lastLogin),
    tier,
  };
}

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

function TierCell({ tier }: { tier: 1 | 2 | 3 | null }) {
  if (!tier) return <span className="text-slate-400">—</span>;

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-[18px] bg-[#F3F4F6] pr-2">
      <TierShield tier={tier} />
      <span className="text-xs font-medium text-primary">Tier {tier}</span>
    </span>
  );
}

const exportOptions = [
  { id: "png", label: "As PNG" },
  { id: "pdf", label: "As PDF" },
  { id: "xls", label: "As XLS" },
] as const;

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2v8m0 0L5.5 7.5M8 10l2.5-2.5M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileTypeIcon({ type, className }: { type: "png" | "pdf" | "xls"; className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 1.5h5.5L13 5v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <text
        x="8"
        y="12"
        textAnchor="middle"
        fill="currentColor"
        fontSize="4.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {type.toUpperCase()}
      </text>
    </svg>
  );
}

function ExportTableDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#1D2739] hover:bg-slate-50"
      >
        <DownloadIcon className="text-[#4B5563]" />
        Export table
        <ChevronDownIcon className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#FFF1E8] hover:text-[#9A3412]"
            >
              <FileTypeIcon type={option.id} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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

export function UserInfoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("User Info");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<TableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: "2026-01-01",
    to: "2026-05-31",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetchUsers({
          page: currentPage,
          limit: PAGE_LIMIT,
          type: "Service Provider",
        });
        if (cancelled) return;
        setUsers(res.data.map((user, index) => mapUserToRow(user, index, currentPage)));
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } catch (err) {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const startEntry = total === 0 ? 0 : (currentPage - 1) * PAGE_LIMIT + 1;
  const endEntry = Math.min(currentPage * PAGE_LIMIT, total);
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/service-providers"
          className="flex items-center gap-1 text-[28px] font-normal text-[#1D2739] hover:text-[#711E00]"
        >
          <BackIcon className="text-[#1D2739]" />
          User Info
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search"
              className="h-9 w-44 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#FE915D]"
            />
          </div>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 pt-4">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[#FE915D] text-[#711E00]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pb-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((tier) => (
                <span
                  key={tier}
                  className="flex items-center gap-1 rounded-[18px] bg-[#F3F4F6] pr-2"
                >
                  <TierShield tier={tier as 1 | 2 | 3} />
                  <span className="text-xs font-medium text-primary">50</span>
                </span>
              ))}
            </div>

            <ExportTableDropdown />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
                <th className="px-5 py-3">No</th>
                <th className="px-5 py-3">User Name</th>
                <th className="px-5 py-3">Email address</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Sign Up Date</th>
                <th className="px-5 py-3">Last Login Date</th>
                <th className="px-5 py-3">Tier Level</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/dashboard/service-providers/users/${user.id}`)}
                    className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-4 text-slate-500">{user.no}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                    <td className="px-5 py-4 text-slate-600">{user.signUp}</td>
                    <td className="px-5 py-4 text-slate-600">{user.lastLogin}</td>
                    <td className="px-5 py-4">
                      <TierCell tier={user.tier} />
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Actions"
                      >
                        <MoreVerticalIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
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
    </div>
  );
}
