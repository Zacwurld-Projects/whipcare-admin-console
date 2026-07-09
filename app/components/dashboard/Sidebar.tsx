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
} from "./icons";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; active?: boolean }>;
};

type NavGroup = NavItem[] | "divider";

const navGroups: NavGroup[] = [
  [
    { label: "Overview", href: "/dashboard", icon: OverviewIcon },
    { label: "Vehicle Owners", href: "/dashboard/vehicle-owners", icon: CarFrontIcon },
  ],
  "divider",
  [
    { label: "Service Providers", href: "/dashboard/service-providers", icon: ServiceProviderIcon },
    { label: "Fleets Managers", href: "/dashboard/fleet-managers", icon: FleetIcon },
    { label: "Service Bookings", href: "/dashboard/service-bookings", icon: BookingIcon },
    { label: "Vehicle Management", href: "/dashboard/vehicle-management", icon: VehicleManagementIcon },
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
    { label: "Ads and Blog", href: "/dashboard/ads", icon: AdsIcon },
  ],
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

type SidebarProps = {
  headerHeight?: number;
  sidebarWidth?: number;
};

export function Sidebar({ headerHeight = 72, sidebarWidth = 248 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 z-30 flex flex-col border-r border-slate-100 bg-white"
      style={{
        top: headerHeight,
        width: sidebarWidth,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <nav className="flex-1 overflow-y-auto pb-8 pt-2">
        {navGroups.map((group, gi) => {
          if (group === "divider") {
            return <div key={`divider-${gi}`} className="mx-5 my-4 h-px bg-[#E5E7EB]" />;
          }

          return (
            <ul key={gi} className="flex flex-col">
              {group.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-3 px-5 py-3 text-[14px] transition-colors ${
                        active
                          ? "bg-[#FDF3F0] font-medium text-[#711E00]"
                          : "font-normal text-[#4B5563] hover:bg-slate-50"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-[#711E00]" />
                      )}
                      <Icon className="shrink-0" active={active} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </nav>
    </aside>
  );
}
