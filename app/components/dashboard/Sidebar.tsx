"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OverviewIcon,
  CarFrontIcon,
  ServiceProviderIcon,
  FleetIcon,
  BookingIcon,
  VehicleManagementIcon,
  ActivityIcon,
  FeedbackIcon,
  MarketingIcon,
  FinancialIcon,
  AdsIcon,
  WebsiteIcon,
} from "./icons";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; active?: boolean }>;
  available?: boolean;
};

type NavGroup = NavItem[] | "divider";

const navGroups: NavGroup[] = [
  [{ label: "Overview", href: "/dashboard", icon: OverviewIcon }],
  "divider",
  [
    { label: "Vehicle Owners", href: "/dashboard/vehicle-owners", icon: CarFrontIcon },
    {
      label: "Service Providers",
      href: "/dashboard/service-providers",
      icon: ServiceProviderIcon,
      available: true,
    },
    { label: "Fleets Managers", href: "/dashboard/fleet-managers", icon: FleetIcon },
    { label: "Service Bookings", href: "/dashboard/service-bookings", icon: BookingIcon },
    {
      label: "Vehicle Management",
      href: "/dashboard/vehicle-management",
      icon: VehicleManagementIcon,
    },
  ],
  "divider",
  [
    { label: "Activities", href: "/dashboard/activities", icon: ActivityIcon },
    { label: "Feedbacks and Dispute", href: "/dashboard/feedbacks", icon: FeedbackIcon },
    { label: "Marketings and Points", href: "/dashboard/marketing", icon: MarketingIcon },
  ],
  "divider",
  [
    { label: "Financials", href: "/dashboard/financials", icon: FinancialIcon },
    { label: "Ads and Blog", href: "/dashboard/ads", icon: AdsIcon, available: true },
    { label: "Website", href: "/dashboard/website", icon: WebsiteIcon, available: true },
  ],
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

type SidebarProps = {
  headerHeight?: number;
  sidebarWidth?: number;
  collapsed?: boolean;
  onToggle?: () => void;
};

export function Sidebar({
  headerHeight = 72,
  sidebarWidth = 248,
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 z-30 flex flex-col border-r border-slate-100 bg-white transition-[width] duration-200"
      style={{
        top: headerHeight,
        width: sidebarWidth,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-8 pt-2">
        {navGroups.map((group, gi) => {
          if (group === "divider") {
            return (
              <div
                key={`divider-${gi}`}
                className={`my-4 h-px bg-[#E5E7EB] ${collapsed ? "mx-3" : "mx-5"}`}
              />
            );
          }

          return (
            <ul key={gi} className="flex flex-col">
              {group.map((item) => {
                const active = item.available ? isActive(pathname, item.href) : false;
                const Icon = item.icon;
                const className = `relative flex items-center gap-3 py-3 text-[14px] transition-colors ${
                  collapsed ? "justify-center px-2" : "px-5"
                } ${
                  active
                    ? "bg-[#FDF3F0] font-medium text-[#711E00]"
                    : item.available
                      ? "font-normal text-[#4B5563] hover:bg-slate-50"
                      : "cursor-not-allowed font-normal text-[#9CA3AF]"
                }`;

                return (
                  <li key={item.href}>
                    {item.available ? (
                      <Link href={item.href} className={className} title={item.label}>
                        {active && (
                          <span className="absolute left-0 top-0 h-full w-[3px] bg-[#711E00]" />
                        )}
                        <Icon className="shrink-0" active={active} />
                        {!collapsed && item.label}
                      </Link>
                    ) : (
                      <div className={className} aria-disabled="true" title={`${item.label} — Soon`}>
                        <Icon className="shrink-0" active={false} />
                        {!collapsed && (
                          <>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-[#D1D5DB]">
                              Soon
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        })}
      </nav>

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-6 -right-3 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#4B5563] shadow-sm transition-colors hover:bg-slate-50 hover:text-[#711E00]"
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            fill="none"
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            <path
              d="M10 3.5 5.5 8 10 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </aside>
  );
}
