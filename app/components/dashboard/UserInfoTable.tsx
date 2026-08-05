"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchUsers,
  formatUserDate,
  getUserDisplayName,
  type User,
} from "@/app/lib/api";
import { SearchIcon, MoreVerticalIcon, TierShield } from "./icons";
import { DateRangePicker, type DateRange } from "./DateRangePicker";

const tabs = ["Active Users", "Suspended Users", "Deleted Users"] as const;

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

function mapUserToRow(user: User, index: number): TableRow {
  const tier = user.tier === 1 || user.tier === 2 || user.tier === 3 ? user.tier : null;

  return {
    id: user.id,
    no: index + 1,
    name: getUserDisplayName(user),
    email: user.email,
    phone: user.phone,
    signUp: "—",
    lastLogin: formatUserDate(user.lastLogin),
    tier,
  };
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

export function UserInfoTable() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Active Users");
  const [users, setUsers] = useState<TableRow[]>([]);
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
        const res = await fetchUsers({ page: 1, limit: 5, type: "Service Provider" });
        if (cancelled) return;
        setUsers(res.data.map(mapUserToRow));
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
  }, []);

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">User Info</h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search"
                className="h-9 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-[#FE915D]"
              />
            </div>

            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <div className="flex items-center gap-2 text-xs text-slate-500">
              {[1, 2, 3].map((tier) => (
                <span key={tier} className="flex items-center gap-1 rounded-[18px] pr-2 bg-[#F3F4F6]">
                  <TierShield tier={tier as 1 | 2 | 3} />
                  <span className="text-xs font-medium text-primary">50</span>
                </span>
              ))}
              <Link
                href="/dashboard/service-providers/user-info"
                className="font-semibold text-xs text-primary hover:text-primary-dark underline"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab
                  ? "border-b-2 border-[#FE915D] text-[#711E00]"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
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
    </div>
  );
}
