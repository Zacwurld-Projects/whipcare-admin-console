"use client";

import { useState } from "react";
import { CalendarIcon } from "./icons";

const filters = ["Today", "1 week", "2 months"] as const;

export function DateFilterBar() {
  const [active, setActive] = useState<string>("Today");

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
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-[#D1D5DC] bg-white px-4 py-2 text-[14px] font-medium text-[#1D2739] hover:border-slate-300"
      >
        <CalendarIcon className="text-slate-400" />
        Select dates
      </button>
    </div>
  );
}
