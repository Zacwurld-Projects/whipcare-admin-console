"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, BellIcon, SettingsIcon, ChevronDownIcon, LogOutIcon } from "./icons";
import { clearSession } from "@/app/lib/auth";

function NigeriaFlagIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <rect width="6.67" height="14" fill="#008751" />
      <rect x="6.67" width="6.66" height="14" fill="white" />
      <rect x="13.33" width="6.67" height="14" fill="#008751" />
    </svg>
  );
}

function UserAvatarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.8063 14.8372C17.9226 14.9064 18.0663 14.9875 18.229 15.0793C18.9418 15.4814 20.0193 16.0893 20.7575 16.8118C21.2191 17.2637 21.6578 17.8592 21.7375 18.5888C21.8223 19.3646 21.4839 20.0927 20.8048 20.7396C19.6334 21.8556 18.2276 22.75 16.4093 22.75H7.59104C5.77274 22.75 4.36695 21.8556 3.1955 20.7396C2.51649 20.0927 2.17802 19.3646 2.26283 18.5888C2.34257 17.8592 2.78123 17.2637 3.2429 16.8118C3.98106 16.0893 5.05857 15.4814 5.77139 15.0793C5.93404 14.9875 6.07773 14.9064 6.19404 14.8372C9.74809 12.7209 14.2523 12.7209 17.8063 14.8372Z" fill="#711E00" />
      <path d="M6.75018 6.5C6.75018 3.6005 9.10068 1.25 12.0002 1.25C14.8997 1.25 17.2502 3.6005 17.2502 6.5C17.2502 9.39949 14.8997 11.75 12.0002 11.75C9.10068 11.75 6.75018 9.39949 6.75018 6.5Z" fill="#711E00" />
    </svg>
  );
}

const iconButtonClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#4B5563] transition-colors hover:bg-[#ECEEF2]";

const selectorButtonClass =
  "flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#F3F4F6] px-3 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#ECEEF2]";

const USER = {
  name: "ZacWurld",
  role: "Admin Manager",
  email: "admin@whipcare.com",
  initials: "ZI",
};

function ProfileDropdown() {
  const router = useRouter();
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

  function handleLogout() {
    setOpen(false);
    clearSession();
    router.push("/login");
  }

  return (
    <div className="relative ml-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-[#F9FAFB]"
      >
        <div className={`${iconButtonClass} hover:bg-[#F3F4F6]`}>
          <UserAvatarIcon />
        </div>
        <div className="hidden text-left sm:block">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold leading-tight text-[#1E2939]">{USER.name}</p>
            <ChevronDownIcon
              className={`text-[#9CA3AF] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
          <p className="text-xs leading-tight text-[#6A7282]">{USER.role}</p>
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8D8] text-sm font-semibold text-[#C2410C]">
              {USER.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1E2939]">{USER.name}</p>
              <p className="truncate text-xs text-[#9CA3AF]">{USER.email}</p>
            </div>
          </div>

          <div className="mt-1 space-y-0.5 px-2 pb-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/settings");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#16A34A] transition-colors hover:bg-[#ECFDF3]"
            >
              <SettingsIcon className="text-[#16A34A]" />
              Settings
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
            >
              <LogOutIcon className="text-[#B91C1C]" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardHeader() {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-6 px-6">
      <div className="relative w-full max-w-[420px]">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="search"
          placeholder="Search"
          className="h-11 w-full rounded-xl bg-[#F3F4F6] pl-11 pr-4 text-sm text-[#4B5563] placeholder:text-[#9CA3AF] outline-none focus:bg-[#ECEEF2]"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <button type="button" className={selectorButtonClass}>
          <span className="text-base leading-none">₦</span>
          <ChevronDownIcon className="text-[#9CA3AF]" />
        </button>

        <button type="button" className={selectorButtonClass}>
          <NigeriaFlagIcon />
          <ChevronDownIcon className="text-[#9CA3AF]" />
        </button>

        <button type="button" className={`${iconButtonClass} relative`} aria-label="Notifications">
          <BellIcon />
          <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-[#FE915D]">
            <span className="h-1 w-1 rounded-full bg-white" />
          </span>
        </button>

        <ProfileDropdown />
      </div>
    </div>
  );
}
