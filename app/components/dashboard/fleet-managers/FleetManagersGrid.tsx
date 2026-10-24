"use client";

import { useRouter } from "next/navigation";
import { MoreVerticalIcon } from "../icons";

export type BusinessRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  signUp: string;
  lastLogin: string;
  active: boolean;
};

// Placeholder data until a fleet-manager endpoint is available.
export const businessRows: BusinessRow[] = Array.from({ length: 13 }, (_, i) => {
  const company = i < 2;
  return {
    id: String(i + 1),
    name: company ? "Whipcare Transcorp" : "Isaac Zacwurld",
    email: company ? "Whipcare@gmail.com" : "Isaaczac@gmail.com",
    phone: "+2348181219349",
    signUp: "17-Apr-2026",
    lastLogin: "17-Apr-2026",
    active: i % 2 === 0,
  };
});

const headClass = "px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function BusinessGrid({ rows }: { rows: BusinessRow[] }) {
  const router = useRouter();

  return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="bg-[#F3F4F6]">
                <th className={headClass}>No</th>
                <th className={headClass}>Business Name</th>
                <th className={headClass}>Email address</th>
                <th className={headClass}>Phone</th>
                <th className={headClass}>Sign Up Date</th>
                <th className={headClass}>Last Login Date</th>
                <th className={headClass}>Subscription</th>
                <th className={headClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                    No businesses found
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/dashboard/fleet-managers/${row.id}`)}
                    className="h-[52px] cursor-pointer border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >
                    <td className={`${cellClass} text-[#4A5565]`}>{i + 1}</td>
                    <td className={`${cellClass} text-[#4A5565]`}>{row.name}</td>
                    <td className={`${cellClass} text-[#101828]`}>{row.email}</td>
                    <td className={`${cellClass} text-[#4A5565]`}>{row.phone}</td>
                    <td className={`${cellClass} text-[#101828]`}>{row.signUp}</td>
                    <td className={`${cellClass} text-[#101828]`}>{row.lastLogin}</td>
                    <td className={`${cellClass} text-[#101828]`}>
                      <span className="flex items-center gap-1">
                        <span className={`size-3 rounded-full ${row.active ? "bg-[#711E00]" : "bg-[#D1D5DC]"}`} />
                        {row.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className={cellClass} onClick={(e) => e.stopPropagation()}>
                      <button type="button" aria-label="Actions" className="rounded p-1 text-[#711E00] hover:bg-[#F3F4F6]">
                        <MoreVerticalIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
  );
}
