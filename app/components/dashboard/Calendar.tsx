"use client";

import { useMemo, useState } from "react";

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_PER_PAGE = 3;
const YEARS_PER_PAGE = 5;

export type CalendarRange = { start: Date | null; end: Date | null };

type CalendarProps = {
  value: CalendarRange;
  onChange: (range: CalendarRange) => void;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

// 6 rows x 7 columns, Monday first, padded with adjacent-month days.
function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}

/* eslint-disable @next/next/no-img-element */
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full truncate rounded-lg border px-1 py-1.5 text-center text-[14px] font-medium leading-[1.45] ${
        selected
          ? "border-[#D35D24] bg-[#FBF1F1] text-[#475367]"
          : "border-[#D0D5DD] bg-[#F3F5F8] text-[#667185] hover:border-[#D35D24]"
      }`}
    >
      {label}
    </button>
  );
}

function PickerSection({
  title,
  columns,
  onPrev,
  onNext,
  children,
}: {
  title: string;
  columns: string;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold leading-[1.3] text-[#666]">{title}</p>
        <div className="flex gap-1.5">
          <button type="button" aria-label={`Previous ${title.toLowerCase()}s`} onClick={onPrev}>
            <img src="/icons/calendar/chevron-left-sm.svg" alt="" className="size-4" />
          </button>
          <button type="button" aria-label={`Next ${title.toLowerCase()}s`} onClick={onNext}>
            <img src="/icons/calendar/chevron-right-sm.svg" alt="" className="size-4" />
          </button>
        </div>
      </div>
      <div className={`grid gap-2 ${columns}`}>{children}</div>
    </div>
  );
}

export function Calendar({ value, onChange }: CalendarProps) {
  const [view, setView] = useState(() => {
    const base = value.start ?? new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const [picking, setPicking] = useState(false);
  const [draft, setDraft] = useState(view);
  const [monthPage, setMonthPage] = useState(0);
  const [yearStart, setYearStart] = useState(view.year - 3);

  const days = useMemo(() => buildMonthGrid(view.year, view.month), [view]);
  const title = new Date(view.year, view.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const draftTitle = `${months[draft.month]} ${draft.year}`;

  function shiftMonth(delta: number) {
    const next = new Date(view.year, view.month + delta, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  }

  function openPicker() {
    setDraft(view);
    setMonthPage(Math.floor(view.month / MONTHS_PER_PAGE));
    setYearStart(view.year - 3);
    setPicking(true);
  }

  function confirmPicker() {
    setView(draft);
    setPicking(false);
  }

  function pick(day: Date) {
    const { start, end } = value;
    if (!start || end) {
      onChange({ start: day, end: null });
    } else if (day < start) {
      onChange({ start: day, end: start });
    } else {
      onChange({ start, end: day });
    }
  }

  const visibleMonths = months
    .map((name, index) => ({ name, index }))
    .slice(monthPage * MONTHS_PER_PAGE, (monthPage + 1) * MONTHS_PER_PAGE);
  const visibleYears = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearStart + i);
  const lastMonthPage = Math.ceil(months.length / MONTHS_PER_PAGE) - 1;

  return (
    <div className="w-[335px] rounded-2xl bg-white px-4 py-6 drop-shadow-[0px_0px_4px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (picking ? setPicking(false) : openPicker())}
          className="flex items-center gap-2"
        >
          <span className="text-[16px] font-semibold leading-[1.45] text-black">
            {picking ? draftTitle : title}
          </span>
          <img
            src={picking ? "/icons/calendar/chevron-up.svg" : "/icons/calendar/chevron-down.svg"}
            alt=""
            className="size-4"
          />
        </button>
        {!picking && (
          <div className="flex gap-1.5">
            <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)}>
              <img src="/icons/calendar/chevron-left.svg" alt="" className="size-5" />
            </button>
            <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)}>
              <img src="/icons/calendar/chevron-right.svg" alt="" className="size-5" />
            </button>
          </div>
        )}
      </div>

      {picking ? (
        <>
          <div className="mt-4 flex flex-col gap-8">
            <PickerSection
              title="Month"
              columns="grid-cols-3"
              onPrev={() => setMonthPage((p) => Math.max(p - 1, 0))}
              onNext={() => setMonthPage((p) => Math.min(p + 1, lastMonthPage))}
            >
              {visibleMonths.map(({ name, index }) => (
                <Chip
                  key={name}
                  label={name}
                  selected={draft.month === index}
                  onClick={() => setDraft((d) => ({ ...d, month: index }))}
                />
              ))}
            </PickerSection>
            <PickerSection
              title="Year"
              columns="grid-cols-5"
              onPrev={() => setYearStart((y) => y - YEARS_PER_PAGE)}
              onNext={() => setYearStart((y) => y + YEARS_PER_PAGE)}
            >
              {visibleYears.map((year) => (
                <Chip
                  key={year}
                  label={String(year)}
                  selected={draft.year === year}
                  onClick={() => setDraft((d) => ({ ...d, year }))}
                />
              ))}
            </PickerSection>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPicking(false)}
              className="h-14 flex-1 rounded-lg text-[16px] font-semibold text-[#98A2B3] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPicker}
              className="flex-1 rounded-lg bg-[#FF915B] px-6 py-4 text-[16px] font-semibold text-white hover:bg-[#F5844A]"
            >
              Done
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-7 justify-items-center">
            {weekdays.map((d) => (
              <div key={d} className="flex h-10 w-[38px] items-center justify-center text-[12px] font-semibold text-black">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-7 justify-items-center gap-y-2">
            {days.map((day) => {
              const outside = day.getMonth() !== view.month;
              const day0 = startOfDay(day);
              const isStart = value.start ? isSameDay(day0, value.start) : false;
              const isEnd = value.end ? isSameDay(day0, value.end) : false;
              const inRange = value.start && value.end ? day0 > value.start && day0 < value.end : false;

              let style = "border border-[#F0F2F5] text-black hover:border-[#711E00]";
              if (outside) style = "bg-[#F7F9FC] text-[#D0D5DD]";
              if (inRange && !outside) style = "border border-[#F1A68B] bg-[#F1A68B]/25 text-black";
              if ((isStart || isEnd) && !outside) style = "border border-[#711E00] bg-[#711E00] text-white";

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={outside}
                  onClick={() => pick(day0)}
                  className={`flex size-[38px] items-center justify-center rounded-[10px] text-[12px] ${style}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
