"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "./icons";

export type DateRange = {
  from: string;
  to: string;
};

function ordinal(day: number) {
  const rem100 = day % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export function formatDateLabel(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const day = ordinal(date.getDate());
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
};

export function DateRangePicker({
  value,
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(value?.from ?? "2026-01-01");
  const [to, setTo] = useState(value?.to ?? "2026-05-31");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setFrom(value.from);
      setTo(value.to);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function apply() {
    const next = { from, to };
    onChange?.(next);
    setOpen(false);
  }

  const label = `${formatDateLabel(from)} - ${formatDateLabel(to)}`;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <CalendarIcon className="text-slate-400" />
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[280px] rounded-xl border border-slate-100 bg-white p-4 shadow-lg">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="date-from" className="text-xs font-medium text-slate-500">
                From
              </label>
              <input
                id="date-from"
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-[#FE915D]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="date-to" className="text-xs font-medium text-slate-500">
                To
              </label>
              <input
                id="date-to"
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-[#FE915D]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 flex-1 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                className="flex h-9 flex-1 items-center justify-center rounded-lg bg-[#711E00] text-sm font-medium text-white hover:bg-[#5A1800]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
