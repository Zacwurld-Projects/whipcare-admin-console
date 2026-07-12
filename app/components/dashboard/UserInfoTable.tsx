"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon, CalendarIcon, MoreVerticalIcon, TierShield } from "./icons";

const tabs = ["Active Users", "Suspended Users", "Deleted Users"] as const;

const users = [
  {
    no: 1,
    name: "Isaac Zacwurld",
    email: "isaaczac@gmail.com",
    phone: "+234 801 234 5678",
    signUp: "12 Jan 2026",
    lastLogin: "08 Jul 2026",
    tier: 1 as const,
  },
  {
    no: 2,
    name: "Isaac Zacwurld",
    email: "isaaczac@gmail.com",
    phone: "+234 801 234 5678",
    signUp: "12 Jan 2026",
    lastLogin: "08 Jul 2026",
    tier: 2 as const,
  },
];

export function UserInfoTable() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Active Users");

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

            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"
            >
              <CalendarIcon className="text-slate-400" />
              1th Jan 2026 - 31th May 2026
            </button>

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
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
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
            {users.map((user) => (
              <tr
                key={user.no}
                onClick={() => router.push(`/dashboard/service-providers/users/${user.no}`)}
                className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/50"
              >
                <td className="px-5 py-4 text-slate-500">{user.no}</td>
                <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                <td className="px-5 py-4 text-slate-600">{user.signUp}</td>
                <td className="px-5 py-4 text-slate-600">{user.lastLogin}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 rounded-[18px] bg-[#F3F4F6] pr-2">
                    <TierShield tier={user.tier} />
                    <span className="text-xs font-medium text-primary">Tier {user.tier}</span>
                  </span>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
