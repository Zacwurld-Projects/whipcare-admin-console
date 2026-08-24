"use client";

import { useState } from "react";
import { WhipcareLogo } from "@/app/components/auth/WhipcareLogo";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";

const SIDEBAR_EXPANDED = 248;
const SIDEBAR_COLLAPSED = 72;
const HEADER_HEIGHT = 72;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <header
        className="fixed inset-x-0 top-0 z-40 flex bg-white"
        style={{ height: HEADER_HEIGHT }}
      >
        <div
          className="relative flex shrink-0 flex-col justify-center overflow-hidden border-r border-[#F3F4F6] px-3 transition-[width] duration-200 sm:px-5"
          style={{ width: sidebarWidth, height: HEADER_HEIGHT }}
        >
          <div
            className={`origin-left transition-transform duration-200 ${
              collapsed ? "scale-[0.7]" : "scale-[0.85]"
            }`}
          >
            <WhipcareLogo />
          </div>
          {!collapsed && (
            <div className="absolute inset-x-5 bottom-0 flex items-center">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <div className="mx-2.5 h-1.5 w-1.5 rounded-full bg-[#711E00]" />
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 border-b border-[#F3F4F6]">
          <DashboardHeader />
        </div>
      </header>

      <Sidebar
        headerHeight={HEADER_HEIGHT}
        sidebarWidth={sidebarWidth}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      <div
        className="transition-[padding-left] duration-200"
        style={{ paddingLeft: sidebarWidth, paddingTop: HEADER_HEIGHT }}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
