"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type ReactNode } from "react";
import { fetchUserReviews, type UserReview } from "@/app/lib/api";

const REVIEWS_PER_PAGE = 2;

function pageItems(current: number, total: number): (number | "…")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className="disabled:opacity-40">
        <img src="/icons/profile/chevron-left.svg" alt="" className="size-6" />
      </button>
      {pageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="p-2 text-[12px] font-medium text-[#1D2739]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={`rounded px-3 py-1.5 text-[12px] font-medium leading-[1.4] ${
              item === page ? "bg-[#FF915B] text-white" : "border border-[#E4E7EC] text-[#1D2739] hover:bg-[#F3F4F6]"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="disabled:opacity-40">
        <img src="/icons/profile/chevron-right.svg" alt="" className="size-6" />
      </button>
    </nav>
  );
}

export function SectionShell({
  title,
  tone,
  pager,
  children,
}: {
  title: string;
  tone: "white" | "grey";
  pager: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl p-4 ${tone === "grey" ? "bg-[#F9FAFB]" : "bg-[#F9FAFB]"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-[#364153]">{title}</p>
        {pager}
        <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
          View All
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">{children}</div>
    </div>
  );
}

export function SeeBookings() {
  return (
    <span className="flex items-center gap-2 text-[12px] text-[#711E00] underline">
      See Bookings
      <img src="/icons/profile/arrow-right.svg" alt="" className="size-4 no-underline" />
    </span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-[1.17px]" role="img" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <img key={i} src={`/icons/profile/${i < Math.round(rating) ? "star-yellow" : "star-grey"}.svg`} alt="" className="size-4" />
      ))}
    </span>
  );
}

function timeAgo(value?: string | null) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diff) || diff < 0) return "";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const cardClass = "flex w-[360px] shrink-0 flex-col items-end gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3.5";

function ReviewCard({ review }: { review: UserReview }) {
  const text = review.comment ?? review.review ?? review.message ?? review.text ?? "";

  return (
    <article className={cardClass}>
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Stars rating={review.rating ?? 0} />
          <span className="text-[14px] text-[#667185]">{timeAgo(review.createdAt)}</span>
        </div>
        <p className="text-[14px] leading-[1.4] text-[#4A5565]">{text || "No comment left."}</p>
      </div>
      <SeeBookings />
    </article>
  );
}

// Disputes are not exposed by the API yet; these are the design's sample entries.
export const sampleDisputes = [0, 1].map((id) => ({
  id,
  name: "Moses Amos",
  role: "Mechanic",
  time: "2 days ago",
  text: "John was fantastic! He arrived on time, explained everything clearly, and did a great job changing my oil. I will definitely be using him again.",
}));

export function DisputeCard({ dispute }: { dispute: (typeof sampleDisputes)[number] }) {
  return (
    <article className={cardClass}>
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <img src="/icons/profile/award-badge.svg" alt="" className="size-[25px]" />
            <span className="text-[12px] font-semibold text-[#711E00] underline">{dispute.name}</span>
            <span className="text-[12px] font-medium text-[#6A7282]">{dispute.role}</span>
          </span>
          <span className="text-[14px] text-[#667185]">{dispute.time}</span>
        </div>
        <p className="text-[14px] leading-[1.4] text-[#4A5565]">{dispute.text}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-2 text-[12px] text-[#364153]">
          <span className="size-2.5 rounded-full bg-[#00C950]" />
          Open chat
        </span>
        <SeeBookings />
      </div>
    </article>
  );
}

export function ReviewsDisputesPanel({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [disputePage, setDisputePage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetchUserReviews(userId, { page: reviewPage, limit: REVIEWS_PER_PAGE })
      .then((res) => {
        if (cancelled) return;
        setReviews(res.data.reviews ?? []);
        setTotal(res.meta?.total ?? res.data.summary?.totalReviews ?? 0);
        setTotalPages(Math.max(res.meta?.totalPages ?? 1, 1));
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reviewPage]);

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white p-4">
      <SectionShell
        title={`Reviews(${total})`}
        tone="grey"
        pager={<Pager page={reviewPage} totalPages={totalPages} onChange={setReviewPage} />}
      >
        {reviews.length === 0 ? (
          <p className="py-8 text-[14px] text-[#99A1AF]">No reviews yet</p>
        ) : (
          reviews.map((review, i) => <ReviewCard key={review.id ?? i} review={review} />)
        )}
      </SectionShell>

      <SectionShell
        title={`Disputes(${sampleDisputes.length})`}
        tone="grey"
        pager={<Pager page={disputePage} totalPages={1} onChange={setDisputePage} />}
      >
        {sampleDisputes.map((dispute) => (
          <DisputeCard key={dispute.id} dispute={dispute} />
        ))}
      </SectionShell>
    </section>
  );
}
