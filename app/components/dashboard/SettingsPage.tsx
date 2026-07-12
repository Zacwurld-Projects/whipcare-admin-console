"use client";

import { useEffect, useRef, useState, FormEvent, InputHTMLAttributes } from "react";
import toast from "react-hot-toast";
import { getAdmin, getAdminInitials, isSuperAdmin } from "@/app/lib/auth";
import { ChevronDownIcon } from "./icons";
import { fetchAdmins, inviteAdmin, type Admin } from "@/app/lib/api";

const allTabs = ["Profile", "Accessibility", "Notification"] as const;
type SettingsTab = (typeof allTabs)[number];

const ADMIN_ROLES = [
  { id: "6a53feb3888b310ad0a26ccd", name: "Super Admin" },
] as const;

const PERMISSIONS = [
  "Vehicle Owners",
  "Service Providers",
  "Fleets Managers",
  "Service Bookings",
  "Vehicle Management",
  "Activities",
  "Feedbacks and Dispute",
  "Marketings and Points",
  "Financials",
  "Blog",
] as const;

type Member = {
  id: string;
  name: string;
  email: string;
  initials: string;
  addedAt: string;
  role: string;
  permissions: string[];
};

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.333 2.00004Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.41-3.41M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 10 7a10.8 10.8 0 01-4.12 5.12M6.1 6.1A10.8 10.8 0 002 12c.73 3.89 5 7 10 7 1.01 0 1.98-.15 2.88-.42"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function FloatingInput({ label, id, className = "", ...props }: FloatingInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-[#6B7280]"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`h-14 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939] outline-none transition-colors focus:border-[#711E00] ${className}`}
        {...props}
      />
    </div>
  );
}

function FloatingPasswordInput({ label, id, ...props }: FloatingInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-[#6B7280]"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={visible ? "text" : "password"}
        className="h-14 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 pr-12 text-sm text-[#1E2939] outline-none transition-colors focus:border-[#711E00]"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeSlashIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function ProfileTab() {
  const admin = getAdmin();
  const [fullName, setFullName] = useState(admin?.fullname ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [role, setRole] = useState(admin?.role?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const initials = getAdminInitials(admin);

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
  }

  function handleUpdatePassword(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="space-y-10 px-6 py-8 sm:px-8 lg:px-10">
      <form onSubmit={handleSaveProfile}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="shrink-0 lg:max-w-[240px]">
            <h2 className="text-base font-semibold text-[#1E2939]">Account profile</h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">You can edit the information on your profile</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex shrink-0 flex-col items-start gap-4">
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#FDE8D8] text-[32px] font-semibold text-[#C2410C]">
                {initials}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F9FAFB]"
              >
                <PencilIcon className="text-[#6B7280]" />
                Edit Photo
              </button>
            </div>

            <div className="w-full space-y-4 sm:w-[420px]">
              <FloatingInput
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <FloatingInput
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FloatingInput
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="border-t border-[#F3F4F6]" />

      <form onSubmit={handleUpdatePassword}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="shrink-0 lg:max-w-[240px]">
            <h2 className="text-base font-semibold text-[#1E2939]">Change password</h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Set up a new password. Login with this new password
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="hidden w-[120px] shrink-0 sm:block" aria-hidden="true" />

            <div className="w-full space-y-4 sm:w-[420px]">
              <FloatingPasswordInput
                label="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FloatingPasswordInput
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <FloatingPasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function NoMemberIllustration() {
  return (
    <svg width="87" height="93" viewBox="0 0 87 93" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="42.4202" cy="52.1751" r="40.4134" fill="#FDF2F2" />
      <circle cx="10.0721" cy="18.4393" r="2.53303" fill="#FDF2F2" />
      <circle cx="21.0166" cy="7.29487" r="4.72065" fill="#FDF2F2" />
      <circle cx="5.34585" cy="78.1974" r="4.49038" fill="#FDF2F2" />
      <circle cx="83.6459" cy="64.1732" r="1.26696" fill="#FDF2F2" />
      <path d="M22.1645 18.1068C22.031 18.0784 22.031 17.8879 22.1645 17.8595L24.183 17.4303C24.2317 17.4199 24.2698 17.382 24.2803 17.3334L24.7149 15.3291C24.7437 15.1963 24.9332 15.1963 24.962 15.3291L25.3966 17.3334C25.4072 17.382 25.4453 17.4199 25.4939 17.4303L27.5124 17.8595C27.6459 17.8879 27.6459 18.0784 27.5124 18.1068L25.4939 18.5361C25.4453 18.5464 25.4072 18.5843 25.3966 18.6329L24.962 20.6372C24.9332 20.7701 24.7437 20.7701 24.7149 20.6372L24.2803 18.6329C24.2698 18.5843 24.2317 18.5464 24.183 18.5361L22.1645 18.1068Z" fill="#F77A4A" />
      <path d="M79.3373 76.0669C79.3837 75.8478 79.6963 75.8478 79.7427 76.0669L80.4352 79.3384C80.4521 79.4182 80.5141 79.4806 80.5938 79.498L83.8316 80.2033C84.049 80.2507 84.049 80.5608 83.8316 80.6081L80.5938 81.3135C80.5141 81.3308 80.4521 81.3933 80.4352 81.473L79.7427 84.7446C79.6963 84.9636 79.3837 84.9636 79.3373 84.7446L78.6449 81.473C78.628 81.3933 78.5659 81.3308 78.4863 81.3135L75.2485 80.6081C75.0311 80.5608 75.0311 80.2507 75.2485 80.2033L78.4863 79.498C78.5659 79.4806 78.628 79.4182 78.6449 79.3384L79.3373 76.0669Z" fill="#F77A4A" />
      <path d="M31.8651 32.667C31.9008 32.4983 32.1415 32.4983 32.1772 32.667L32.4883 34.1366C32.5013 34.198 32.549 34.2461 32.6104 34.2594L34.069 34.5772C34.2364 34.6137 34.2364 34.8524 34.069 34.8889L32.6104 35.2067C32.549 35.22 32.5013 35.2681 32.4883 35.3295L32.1772 36.7991C32.1415 36.9678 31.9008 36.9678 31.8651 36.7991L31.554 35.3295C31.541 35.2681 31.4932 35.22 31.4319 35.2067L29.9733 34.8889C29.8058 34.8524 29.8058 34.6137 29.9733 34.5772L31.4319 34.2594C31.4932 34.2461 31.541 34.198 31.554 34.1366L31.8651 32.667Z" fill="#F77A4A" />
      <path d="M29.4273 68.6526C34.612 67.1669 31.6249 68.2251 34.6429 67.089C36.9219 65.7485 39.2746 64.5143 42.0559 63.8879C44.4187 63.3558 44.361 63.4228 46.9483 63.55C48.1838 63.9303 49.2062 64.7596 49.3976 65.733C49.5558 66.5373 47.9353 67.727 46.9483 68.1656C43.2591 69.8049 45.0577 68.9438 42.3615 69.6934C37.3542 71.0856 31.9654 73.4666 29.8618 77.1702C28.7201 79.1802 28.4434 81.5163 29.4419 83.3651C30.8399 85.9539 35.128 88.106 39.3865 87.7347C41.0937 87.5858 43.0826 87.2615 44.7212 86.7542C46.4536 86.2179 47.5883 85.8033 49.0837 84.9712C52.5526 83.0409 56.6869 80.5329 60.0672 78.5236" stroke="#F77A4A" stroke-width="1.00431" stroke-linecap="round" stroke-dasharray="2.01 2.01" />
      <path d="M42.5712 30.8879C42.292 30.8594 41.957 30.8594 41.6499 30.8879C35.0057 30.6605 29.7295 25.1196 29.7295 18.2999C29.7295 11.3382 35.257 5.68359 42.1245 5.68359C48.9641 5.68359 54.5195 11.3382 54.5195 18.2999C54.4916 25.1196 49.2153 30.6605 42.5712 30.8879Z" fill="#F77A4A" />
      <path d="M56.8287 11.3672C62.2446 11.3672 66.5996 15.8284 66.5996 21.3125C66.5996 26.683 62.4121 31.0589 57.1917 31.2578C56.9683 31.2294 56.7171 31.2294 56.4658 31.2578" stroke="#F77A4A" stroke-width="1.79464" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M28.6137 41.3726C21.8579 45.9759 21.8579 53.4775 28.6137 58.0523C36.2908 63.2807 48.8813 63.2807 56.5583 58.0523C63.3142 53.4491 63.3142 45.9475 56.5583 41.3726C48.9092 36.1727 36.3187 36.1727 28.6137 41.3726Z" fill="#F77A4A" />
      <path d="M62.2168 56.8304C64.2268 56.4041 66.1251 55.5801 67.6885 54.3582C72.0435 51.0337 72.0435 45.5495 67.6885 42.225C66.153 41.0315 64.2826 40.2359 62.3005 39.7812" stroke="#F77A4A" stroke-width="1.79464" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
}

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 12L6 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckedCheckboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.03747 1.16797C9.49794 1.16796 10.6451 1.16795 11.5407 1.28836C12.0953 1.36293 12.5806 1.48666 13.0042 1.69915C13.2381 1.81653 13.3551 1.87522 13.3596 1.99328C13.3642 2.11134 13.2354 2.18893 12.9778 2.3441C12.3787 2.70504 11.8054 3.17321 11.2741 3.68095C10.4587 4.46007 9.70374 5.36982 9.06321 6.22761C8.42138 7.08715 7.88609 7.90586 7.51144 8.50915C7.49556 8.53476 7.4587 8.53596 7.44094 8.51162C6.98795 7.8909 6.57187 7.49681 6.21499 7.247C5.95463 7.06474 5.72763 6.96069 5.54523 6.90266C5.43 6.86084 5.24441 6.84001 5.16602 6.83482C4.79783 6.83482 4.49935 7.13329 4.49935 7.50148C4.49935 7.84452 4.75843 8.12704 5.09159 8.16404C5.1031 8.16532 5.10885 8.16596 5.11424 8.16686C5.11899 8.16765 5.12681 8.16931 5.13148 8.17052C5.13677 8.17189 5.13817 8.17234 5.14096 8.17323C5.18773 8.18811 5.29407 8.22989 5.45037 8.3393C5.76492 8.55949 6.2877 9.05814 6.92052 10.1656C7.0401 10.3748 7.2633 10.5033 7.5043 10.5015C7.74526 10.4997 7.96676 10.3675 8.08323 10.1566L8.08465 10.154L8.0911 10.1424L8.11819 10.0943C8.14245 10.0514 8.17896 9.98752 8.22687 9.90521C8.32271 9.74055 8.46404 9.50255 8.64413 9.21257C9.00477 8.63183 9.5185 7.84637 10.1316 7.02536C10.7459 6.2026 11.4517 5.3554 12.1952 4.64493C12.8127 4.05492 13.4307 3.58392 14.0209 3.29064C14.1764 3.21337 14.2541 3.17473 14.3386 3.21028C14.4231 3.24583 14.4497 3.32802 14.5029 3.49241C14.5988 3.78869 14.6653 4.1106 14.7123 4.45998C14.8327 5.35559 14.8327 6.50273 14.8327 7.96319V8.03944C14.8327 9.4999 14.8327 10.647 14.7123 11.5426C14.5889 12.4604 14.3309 13.1886 13.7587 13.7607C13.1866 14.3328 12.4584 14.5908 11.5407 14.7142C10.6451 14.8347 9.49792 14.8346 8.03746 14.8346H7.96122C6.50075 14.8346 5.35364 14.8347 4.45803 14.7142C3.54026 14.5908 2.81209 14.3328 2.23996 13.7607C1.66783 13.1886 1.4098 12.4604 1.28641 11.5426C1.166 10.647 1.16601 9.49989 1.16602 8.03943V7.96319C1.16601 6.50272 1.166 5.35559 1.28641 4.45998C1.4098 3.54221 1.66783 2.81404 2.23996 2.24191C2.81209 1.66978 3.54026 1.41176 4.45803 1.28836C5.35364 1.16795 6.50076 1.16796 7.96123 1.16797H8.03747Z"
        fill="#711E00"
      />
    </svg>
  );
}

function UncheckedCheckboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.1318 4.3C13.1667 5.00009 13.1667 5.83291 13.1667 6.83333C13.1667 9.8189 13.1667 11.3117 12.2392 12.2392C11.3117 13.1667 9.8189 13.1667 6.83333 13.1667C3.84777 13.1667 2.35499 13.1667 1.4275 12.2392C0.5 11.3117 0.5 9.8189 0.5 6.83333C0.5 3.84777 0.5 2.35499 1.4275 1.4275C2.35499 0.5 3.84777 0.5 6.83333 0.5C7.54795 0.5 8.17705 0.5 8.73333 0.512719"
        stroke="#141B34"
        strokeLinecap="round"
      />
      <path
        d="M4.16602 6.5C4.16602 6.5 5.16602 6.5 6.49935 8.83333C6.49935 8.83333 9.8719 2.72222 13.166 1.5"
        stroke="#141B34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2.25 4.5h13.5M6.75 4.5V3a1.5 1.5 0 011.5-1.5h1.5A1.5 1.5 0 0111.25 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5V4.5h9zM7.5 8.25v4.5M10.5 8.25v4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PermissionCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-2.5 text-left">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {checked ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
      </span>
      <span className="text-sm text-[#4B5563]">{label}</span>
    </button>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (roleId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = ADMIN_ROLES.find((role) => role.id === value);

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
        className="flex h-12 w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 text-left text-sm transition-colors hover:border-[#D1D5DB]"
      >
        <span className={selected ? "text-[#1E2939]" : "text-[#9CA3AF]"}>
          {selected?.name || "Enter role"}
        </span>
        <ChevronDownIcon
          className={`text-[#9CA3AF] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg">
          {ADMIN_ROLES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#FFF1E8] ${
                value === option.id ? "font-medium text-[#711E00]" : "text-[#4B5563]"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type InvitePayload = {
  email: string;
  fullname: string;
  roleId: string;
};

function AddMemberForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (member: InvitePayload) => Promise<void>;
  submitting?: boolean;
}) {
  const [roleId, setRoleId] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<Set<string>>(() => new Set());

  function togglePermission(label: string) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !fullname.trim() || !roleId || submitting) return;
    try {
      await onSubmit({
        email: email.trim(),
        fullname: fullname.trim(),
        roleId,
      });
      setEmail("");
      setFullname("");
      setRoleId("");
      setPermissions(new Set());
    } catch {
      // Toast handled by parent
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#1E2939]">Add new member</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          You can add new member by sending invite to their email.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#6B7280]">Role</label>
        <RoleSelect value={roleId} onChange={setRoleId} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="add-member-fullname" className="text-sm font-medium text-[#6B7280]">
          Full name
        </label>
        <input
          id="add-member-fullname"
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Enter full name"
          className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#711E00]"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="add-member-email" className="text-sm font-medium text-[#6B7280]">
          Email address
        </label>
        <input
          id="add-member-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#711E00]"
        />
      </div>

      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {PERMISSIONS.map((label) => (
          <PermissionCheckbox
            key={label}
            label={label}
            checked={permissions.has(label)}
            onToggle={() => togglePermission(label)}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Invite Links"}
      </button>
    </form>
  );
}

const TABLE_ROLE_LABELS = ["Vehicle Owners", "Service Providers", "Fleets Managers"] as const;

function MembersTable({
  members,
  onDelete,
}: {
  members: Member[];
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#1E2939]">Members</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          Here is the list of members that have access to the admin.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-medium text-[#6B7280]">
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Date &amp; time added</th>
              <th className="px-5 py-3.5 font-medium">Roles</th>
              <th className="px-5 py-3.5 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const extraChecked = PERMISSIONS.some(
                (perm) =>
                  !(TABLE_ROLE_LABELS as readonly string[]).includes(perm) &&
                  member.permissions.includes(perm),
              );

              return (
                <tr key={member.id} className="border-b border-[#F3F4F6] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8D8] text-xs font-semibold text-[#C2410C]">
                        {member.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1E2939]">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-[#9CA3AF]">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[#6B7280]">
                    {member.addedAt}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      {TABLE_ROLE_LABELS.map((perm) => {
                        const checked = member.permissions.includes(perm);
                        return (
                          <div key={perm} className="flex items-center gap-2">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              {checked ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
                            </span>
                            <span className="whitespace-nowrap text-sm text-[#4B5563]">
                              {perm}
                            </span>
                          </div>
                        );
                      })}

                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center"
                        title="Other permissions"
                      >
                        {extraChecked ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#FFF1E8] px-2.5 py-1 text-xs font-medium text-[#9A3412]">
                        {member.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDelete(member.id)}
                        aria-label={`Remove ${member.name}`}
                        className="inline-flex shrink-0 text-[#EF4444] transition-colors hover:text-[#DC2626]"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InviteMemberModal({
  open,
  onClose,
  onInvite,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (data: InvitePayload) => Promise<void>;
  submitting?: boolean;
}) {
  const [roleId, setRoleId] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function togglePermission(label: string) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !fullname.trim() || !roleId || submitting) return;
    try {
      await onInvite({
        email: email.trim(),
        fullname: fullname.trim(),
        roleId,
      });
      setEmail("");
      setFullname("");
      setRoleId("");
      setPermissions(new Set());
      onClose();
    } catch {
      // Toast handled by parent
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
      >
        <div className="relative flex shrink-0 items-center justify-center px-5 pb-2 pt-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Go back"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#4B5563] transition-colors hover:bg-[#E5E7EB]"
          >
            <BackArrowIcon />
          </button>
          <h2 id="invite-member-title" className="text-lg font-semibold text-[#1E2939]">
            Invite Member
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#6B7280]">Role</label>
              <RoleSelect value={roleId} onChange={setRoleId} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-fullname" className="text-sm font-medium text-[#6B7280]">
                Full name
              </label>
              <input
                id="invite-fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter full name"
                className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#711E00]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite-email" className="text-sm font-medium text-[#6B7280]">
                Email address
              </label>
              <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#711E00]"
              />
            </div>

            <div className="space-y-1 pt-1">
              {PERMISSIONS.map((label) => (
                <PermissionCheckbox
                  key={label}
                  label={label}
                  checked={permissions.has(label)}
                  onToggle={() => togglePermission(label)}
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 px-5 pb-5 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Invite Links"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function initialsFromName(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  const local = email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "NA";
}

function mapAdminToMember(admin: Admin): Member {
  const isSuperAdmin = admin.role.permissions.some(
    (p) => p.slug === "super_admin" || p.name.toLowerCase() === "super admin",
  );

  return {
    id: admin.id,
    name: admin.fullname || admin.email,
    email: admin.email,
    initials: initialsFromName(admin.fullname || "", admin.email),
    addedAt: "—",
    role: admin.role.name,
    permissions: isSuperAdmin ? [...PERMISSIONS] : admin.role.permissions.map((p) => p.name),
  };
}

function AccessibilityTab() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAdmins() {
      setLoading(true);
      try {
        const res = await fetchAdmins();
        if (cancelled) return;
        setMembers(res.data.map(mapAdminToMember));
      } catch (err) {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Failed to load members");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAdmins();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function addMember(data: InvitePayload) {
    setInviting(true);
    try {
      const res = await inviteAdmin(data);
      toast.success(res.message || "Member invited successfully");
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to invite member");
      throw err;
    } finally {
      setInviting(false);
    }
  }

  function deleteMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  if (loading) {
    return (
      <div className="flex min-h-[480px] items-center justify-center px-6 py-16">
        <p className="text-sm text-[#9CA3AF]">Loading members…</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <>
        <div className="flex min-h-[480px] flex-col items-center justify-center px-6 py-16 sm:px-8">
          <NoMemberIllustration />
          <h2 className="mt-6 text-lg font-semibold text-[#1E2939]">No member</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">All admin members would be shown here</p>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="mt-6 flex h-11 items-center justify-center rounded-xl bg-[#711E00] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5A1800]"
          >
            Add Member
          </button>
        </div>

        <InviteMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          onInvite={addMember}
          submitting={inviting}
        />
      </>
    );
  }

  return (
    <div className="space-y-10 px-6 py-8 sm:px-8 lg:px-10">
      <AddMemberForm onSubmit={addMember} submitting={inviting} />
      <div className="border-t border-[#F3F4F6]" />
      <MembersTable members={members} onDelete={deleteMember} />
    </div>
  );
}

function NotificationTab() {
  const notificationOptions = [
    {
      id: "booking",
      title: "Booking Notifications",
      description:
        "By selecting this, you will be notified about new, ongoing, or completed bookings.",
    },
    {
      id: "provider-performance",
      title: "Service Provider Performance Alerts",
      description:
        "Alert the admin when a service provider's rating falls below a threshold of 3.5 or when there's a surge in complaints.",
    },
    {
      id: "payment",
      title: "Payment Issues",
      description:
        "Notify the admin about failed payments, refund requests, or payout delays for service providers.",
    },
    {
      id: "revenue",
      title: "Revenue and Performance Milestones",
      description:
        "Alert the admin when key financial or operational metrics hit a milestone.",
    },
    {
      id: "api",
      title: "API/Backend Failures",
      description:
        "Notify the admin of technical issues, such as failed API integrations or server downtime.",
    },
    {
      id: "fraud",
      title: "Fraud or Security Alerts",
      description:
        "Detect and notify about suspicious activities like multiple failed login attempts or unusual booking patterns.",
    },
    {
      id: "marketing",
      title: "Marketing and Campaign Updates",
      description:
        "Alert the admin about referral milestones, ad performance, or new user acquisition spikes.",
    },
    {
      id: "feedback",
      title: "User Feedback and Complaints",
      description:
        "Notify the admin of new complaints, suggestions, or reviews submitted by users.",
    },
  ] as const;

  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(notificationOptions.map((o) => o.id)),
  );

  function toggle(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="shrink-0 lg:max-w-[240px]">
          <h2 className="text-base font-semibold text-[#1E2939]">Notification</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">You can set your notification here</p>
        </div>

        <div className="w-full max-w-[640px] space-y-6">
          {notificationOptions.map((option) => {
            const checked = enabled.has(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  {checked ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E2939]">{option.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#9CA3AF]">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [canAccessAccessibility, setCanAccessAccessibility] = useState(false);

  useEffect(() => {
    const superAdmin = isSuperAdmin();
    setCanAccessAccessibility(superAdmin);
    if (!superAdmin) {
      setActiveTab((tab) => (tab === "Accessibility" ? "Profile" : tab));
    }
  }, []);

  const visibleTabs = canAccessAccessibility
    ? allTabs
    : allTabs.filter((tab) => tab !== "Accessibility");

  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-normal text-[#1D2739]">Settings</h1>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 pt-4 sm:px-8 lg:px-10">
          <div className="flex gap-8">
            {visibleTabs.map((tab) => (
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
        </div>

        {activeTab === "Profile" && <ProfileTab />}

        {canAccessAccessibility && activeTab === "Accessibility" && <AccessibilityTab />}

        {activeTab === "Notification" && <NotificationTab />}
      </div>
    </div>
  );
}
