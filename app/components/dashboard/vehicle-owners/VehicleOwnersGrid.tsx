"use client";

import { useRouter } from "next/navigation";
import { formatUserDate, getUserDisplayName, type User } from "@/app/lib/api";
import { MoreVerticalIcon } from "../icons";

export const VEHICLE_OWNER_TYPE = "Vehicle Owner";

export const ownerTabs = [
  { label: "Active Users", className: "text-black" },
  { label: "Suspended Users", className: "text-[#4A5565]" },
  { label: "Deleted Users", className: "text-[#C10007]" },
] as const;

export type OwnerTab = (typeof ownerTabs)[number]["label"];

export type OwnerRow = {
  id: string;
  no: number;
  name: string;
  email: string;
  phone: string;
  signUp: string;
  lastLogin: string;
  subscribed: boolean;
};

export function mapUserToRow(user: User, index: number, offset = 0): OwnerRow {
  return {
    id: user.id,
    no: offset + index + 1,
    name: getUserDisplayName(user),
    email: user.email,
    phone: user.phone,
    signUp: "—",
    lastLogin: formatUserDate(user.lastLogin),
    subscribed: user.tier !== null,
  };
}

export function OwnerTabs({
  active,
  onChange,
}: {
  active: OwnerTab;
  onChange: (tab: OwnerTab) => void;
}) {
  return (
    <div className="flex items-center gap-6 text-[12px] font-medium">
      {ownerTabs.map(({ label, className }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`${className} ${active === label ? "underline underline-offset-2" : "hover:underline"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span className="h-px flex-1 bg-[#D1D5DC]" />
      <span className="size-3 rounded-full bg-[#711E00]" />
      <span className="h-px flex-1 bg-[#D1D5DC]" />
    </div>
  );
}

const headClass = "px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass = "px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function OwnersGrid({ rows, loading }: { rows: OwnerRow[]; loading: boolean }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse">
        <thead>
          <tr className="bg-[#F3F4F6]">
            <th className={headClass}>No</th>
            <th className={headClass}>User Name</th>
            <th className={headClass}>Email address</th>
            <th className={headClass}>Phone</th>
            <th className={headClass}>Sign Up Date</th>
            <th className={headClass}>Last Login Date</th>
            <th className={headClass}>Subscription</th>
            <th className={headClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                Loading vehicle owners…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#99A1AF]">
                No vehicle owners found
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/dashboard/vehicle-owners/${row.id}`)}
                className="h-[52px] cursor-pointer border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
              >
                <td className={`${cellClass} text-[#4A5565]`}>{row.no}</td>
                <td className={`${cellClass} text-[#4A5565]`}>{row.name}</td>
                <td className={`${cellClass} text-[#101828]`}>{row.email}</td>
                <td className={`${cellClass} text-[#4A5565]`}>{row.phone}</td>
                <td className={`${cellClass} text-[#101828]`}>{row.signUp}</td>
                <td className={`${cellClass} text-[#101828]`}>{row.lastLogin}</td>
                <td className={`${cellClass} text-[#101828]`}>
                  <span className="flex items-center gap-1">
                    <span className={`size-3 rounded-full ${row.subscribed ? "bg-[#711E00]" : "bg-[#D1D5DC]"}`} />
                    {row.subscribed ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={cellClass} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    aria-label="Actions"
                    className="rounded p-1 text-[#711E00] hover:bg-[#F3F4F6]"
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
  );
}
