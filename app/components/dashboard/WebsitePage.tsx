"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchContactUs,
  fetchEmailList,
  formatUserDate,
  type ContactUsEntry,
  type EmailListEntry,
} from "@/app/lib/api";

const tabs = [
  { id: "contact-us" as const, label: "Contact Us", href: "/dashboard/website/contact-us" },
  { id: "email-list" as const, label: "Email List", href: "/dashboard/website/email-list" },
];

const PAGE_LIMIT = 20;

type WebsitePageProps = {
  activeTab: "contact-us" | "email-list";
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

function cell(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const startEntry = total === 0 ? 0 : (currentPage - 1) * PAGE_LIMIT + 1;
  const endEntry = Math.min(currentPage * PAGE_LIMIT, total);
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
      <p className="text-sm text-slate-500">
        Showing data {startEntry} to {endEntry} of {total} entries
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
  );
}

function ContactUsTable({
  rows,
  loading,
  currentPage,
}: {
  rows: ContactUsEntry[];
  loading: boolean;
  currentPage: number;
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
          <th className="px-5 py-3">No</th>
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Email</th>
          <th className="px-5 py-3">Phone</th>
          <th className="px-5 py-3">Message</th>
          <th className="px-5 py-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
              Loading submissions…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
              No contact submissions found
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="px-5 py-4 text-slate-500">
                {(currentPage - 1) * PAGE_LIMIT + index + 1}
              </td>
              <td className="px-5 py-4 font-medium text-slate-900">{cell(row.name)}</td>
              <td className="px-5 py-4 text-slate-600">{cell(row.email)}</td>
              <td className="px-5 py-4 text-slate-600">{cell(row.phoneNumber)}</td>
              <td className="max-w-xs truncate px-5 py-4 text-slate-600">{cell(row.message)}</td>
              <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                {formatUserDate(row.createdAt)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function EmailListTable({
  rows,
  loading,
  currentPage,
}: {
  rows: EmailListEntry[];
  loading: boolean;
  currentPage: number;
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
          <th className="px-5 py-3">No</th>
          <th className="px-5 py-3">Email</th>
          <th className="px-5 py-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-400">
              Loading emails…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-400">
              No emails found
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="px-5 py-4 text-slate-500">
                {(currentPage - 1) * PAGE_LIMIT + index + 1}
              </td>
              <td className="px-5 py-4 font-medium text-slate-900">{cell(row.email)}</td>
              <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                {formatUserDate(row.createdAt)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function WebsitePage({ activeTab }: WebsitePageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [contactRows, setContactRows] = useState<ContactUsEntry[]>([]);
  const [emailRows, setEmailRows] = useState<EmailListEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (activeTab === "contact-us") {
          const res = await fetchContactUs({ page: currentPage, limit: PAGE_LIMIT });
          if (cancelled) return;
          setContactRows(res.data);
          setTotal(res.meta.total);
          setTotalPages(Math.max(1, res.meta.totalPages));
        } else {
          const res = await fetchEmailList({ page: currentPage, limit: PAGE_LIMIT });
          if (cancelled) return;
          setEmailRows(res.data);
          setTotal(res.meta.total);
          setTotalPages(Math.max(1, res.meta.totalPages));
        }
      } catch (err) {
        if (cancelled) return;
        if (activeTab === "contact-us") setContactRows([]);
        else setEmailRows([]);
        setTotal(0);
        setTotalPages(1);
        toast.error(err instanceof Error ? err.message : "Failed to load website data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [activeTab, currentPage]);

  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-normal text-[#1D2739]">Website</h1>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 pt-4">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#FE915D] text-[#711E00]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "contact-us" ? (
            <ContactUsTable rows={contactRows} loading={loading} currentPage={currentPage} />
          ) : (
            <EmailListTable rows={emailRows} loading={loading} currentPage={currentPage} />
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
