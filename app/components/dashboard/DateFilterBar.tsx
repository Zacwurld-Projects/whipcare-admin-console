"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "./icons";
import { Calendar, type CalendarRange } from "./Calendar";

const filters = ["Today", "1 week", "2 months"] as const;

const formatDay = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function DateFilterBar() {
  const [active, setActive] = useState<string>("Today");
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const dateLabel = range.start
    ? `${formatDay(range.start)}${range.end ? ` - ${formatDay(range.end)}` : ""}`
    : "Select dates";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => setActive(filter)}
          className={`rounded-lg border px-4 py-2 text-[14px] font-medium transition-colors ${
            active === filter
              ? "border-primary text-primary"
            : "border-[#D1D5DC] bg-white text-[#1D2739] hover:border-slate-300"
          }`}
        >
          {filter}
        </button>
      ))}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-[#D1D5DC] bg-white px-4 py-2 text-[14px] font-medium text-[#1D2739] hover:border-slate-300"
        >
          <CalendarIcon className="text-slate-400" />
          {dateLabel}
        </button>
        {open && (
          <div className="absolute right-0 top-full z-30 mt-2">
            <Calendar value={range} onChange={setRange} />
          </div>
        )}
      </div>
    </div>
  );
}
