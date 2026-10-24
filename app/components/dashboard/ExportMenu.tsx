"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { exportTable, type ExportFormat, type ExportTable } from "@/app/lib/exportTable";

const options: { format: ExportFormat; label: string; icon: string }[] = [
  { format: "png", label: "As PNG", icon: "/icons/export/png.svg" },
  { format: "pdf", label: "As PDF", icon: "/icons/export/pdf.svg" },
  { format: "xls", label: "As XLS", icon: "/icons/export/xls.svg" },
];

export function ExportMenu({ getTable, label = "Export table" }: { getTable: () => ExportTable; label?: string }) {
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

  function handleExport(format: ExportFormat) {
    setOpen(false);
    try {
      exportTable(format, getTable());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center justify-center gap-2.5 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)] hover:bg-[#F9FAFB]"
      >
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/export/button-icon.svg" alt="" className="size-5" />
          <span className="text-[14px] font-semibold leading-[1.45] text-[#344054]">{label}</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/export/chevron-down.svg" alt="" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 flex w-[176px] flex-col overflow-hidden rounded-md bg-white py-2.5 shadow-[0px_2px_20px_0px_rgba(0,0,0,0.13)]"
        >
          {options.map(({ format, label, icon }) => (
            <button
              key={format}
              type="button"
              role="menuitem"
              onClick={() => handleExport(format)}
              className="flex h-8 items-center gap-3 px-4 text-[14px] leading-[1.45] text-[#667185] hover:bg-[#FFECE5] hover:text-[#983504]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="" className="size-[14px]" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
