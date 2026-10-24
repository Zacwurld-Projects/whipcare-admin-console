"use client";

import { useState } from "react";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";

const TABS = ["Ratings and Reviews", "Dispute", "Suggestions"] as const;

type Tab = (typeof TABS)[number];

const reviewStats = [
  { title: "Avg Ratings", value: "4.2", unit: "Stars" },
  { title: "Total Ratings and Reviews", value: 500, unit: "Ratings and Reviews" },
  { title: "Vehicle Owner Reviews", value: 250, unit: "Ratings and Reviews" },
  { title: "Fleet Manager Reviews", value: 250, unit: "Ratings and Reviews" },
];

const disputeStats = [
  { title: "Avg Dispute Settlement rate", value: "95%", unit: "Percentage" },
  { title: "Total Disputes", value: 110, unit: "Disputes" },
  { title: "Pending Disputes", value: 10, unit: "Disputes" },
  { title: "Settled Disputes", value: 100, unit: "Disputes" },
];

const reviews = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  time: "2 days ago",
  text: "John was fantastic! He arrived on time, explained everything clearly, and did a great job changing my oil. I will definitely be using him again.",
}));

const TOTAL_PAGES = 10;

function pageItems(current: number): (number | "…")[] {
  if (current <= 3) return [1, 2, 3, 4, "…", TOTAL_PAGES];
  if (current >= TOTAL_PAGES - 2) return [1, "…", 7, 8, 9, TOTAL_PAGES];
  return [1, "…", current - 1, current, current + 1, "…", TOTAL_PAGES];
}

function ArrowRight() {
  return (
    <span className="relative size-4 shrink-0 overflow-clip">
      <span className="absolute inset-[29.17%_16.67%] flex items-center justify-center">
        <span className="relative h-[10.67px] w-[6.67px] shrink-0 -rotate-90 -scale-x-100">
          <span className="absolute inset-[-4.69%_-7.5%_-3.37%_-7.5%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/feedbacks/arrow-right.svg" alt="" className="block size-full max-w-none" />
          </span>
        </span>
      </span>
    </span>
  );
}

function SeeBookings() {
  return (
    <button type="button" className="flex items-center gap-2">
      <span className="text-[12px] leading-[1.4] text-[#711E00] underline">See Bookings</span>
      <ArrowRight />
    </button>
  );
}

function ReviewCard({ time, text }: { time: string; text: string }) {
  return (
    <article className="flex flex-col items-end gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-[14px]">
      <div className="flex w-full flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/feedbacks/rating-4.svg" alt="4 out of 5 stars" width={84.68} height={16} />
          <span className="text-[14px] leading-[1.4] text-[#667185]">{time}</span>
        </div>
        <p className="max-w-[433px] text-[14px] leading-[1.4] text-[#4A5565]">{text}</p>
      </div>
      <SeeBookings />
    </article>
  );
}

function DisputeCard({ time, text }: { time: string; text: string }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-[14px]">
      <div className="flex w-full flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] leading-[1.4]">
            <span className="font-semibold text-[#711E00] underline">Moses Amos</span>
            <span className="font-medium text-[#6A7282]">Mechanic</span>
          </div>
          <span className="text-[14px] leading-[1.4] text-[#667185]">{time}</span>
        </div>
        <p className="max-w-[433px] text-[14px] leading-[1.4] text-[#4A5565]">{text}</p>
      </div>
      <div className="flex items-center justify-between">
        <button type="button" className="flex items-center gap-2">
          <span className="size-[10px] rounded-full bg-[#00C950]" />
          <span className="text-[12px] leading-[1.4] text-[#364153]">Open chat</span>
        </button>
        <SeeBookings />
      </div>
    </article>
  );
}

function CommentIcon() {
  return (
    <span className="relative size-4 shrink-0 overflow-clip">
      <span className="absolute inset-[10.42%_8.33%]">
        <span className="absolute inset-[-3.95%_-3.75%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/feedbacks/comment.svg" alt="" className="block size-full max-w-none" />
        </span>
      </span>
    </span>
  );
}

export function FeedbacksPage() {
  const [tab, setTab] = useState<Tab>("Ratings and Reviews");
  const isDispute = tab === "Dispute";
  const stats = isDispute ? disputeStats : reviewStats;
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Feedbacks and Dispute</h1>

      <div role="tablist" className="flex items-center gap-6 rounded-xl bg-white px-6 py-[22px]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`text-[14px] font-medium leading-[1.4] ${
              tab === t ? "text-[#711E00] underline" : "text-[#4A5565]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, unit }) => (
          <OverviewStatCard
            key={title}
            title={title}
            // eslint-disable-next-line @next/next/no-img-element
            icon={isDispute ? <CommentIcon /> : <img src="/icons/feedbacks/star.svg" alt="" className="size-4" />}
            value={value}
            change="12.8%"
            trend="down"
            unit={unit}
          />
        ))}
      </div>

      <section className="rounded-2xl bg-white p-6">
        <div className="rounded-2xl bg-[#F9FAFB] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold leading-[1.4] text-[#364153]">
              {isDispute ? "Disputes" : "Feedback"}
            </h2>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="disabled:opacity-40"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m14 7-5 5 5 5" stroke="#1D2739" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {pageItems(page).map((item, i) =>
                item === "…" ? (
                  <span key={`gap-${i}`} className="p-2 text-[12px] font-medium text-[#1D2739]">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Page ${item}`}
                    aria-current={item === page ? "page" : undefined}
                    onClick={() => setPage(item)}
                    className={`rounded px-3 py-1.5 text-[12px] font-medium leading-[1.4] ${
                      item === page
                        ? "bg-[#FF915B] text-white"
                        : "border border-[#E4E7EC] text-[#1D2739]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="Next page"
                disabled={page >= TOTAL_PAGES}
                onClick={() => setPage(page + 1)}
                className="disabled:opacity-40"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m10 7 5 5-5 5" stroke="#1D2739" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {reviews.map((r) =>
              isDispute ? (
                <DisputeCard key={r.id} time={r.time} text={r.text} />
              ) : (
                <ReviewCard key={r.id} time={r.time} text={r.text} />
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
