// Page numbers with an ellipsis, e.g. 1 2 3 4 … 10.
function pageItems(current: number, total: number): (number | "…")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

function PageButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-[14px] font-medium transition-colors disabled:opacity-40 ${
        active ? "bg-[#FF915B] text-white" : "border border-[#E5E7EB] text-[#364153] hover:bg-[#F3F4F6]"
      }`}
    >
      {children}
    </button>
  );
}

type TableFooterProps = {
  page: number;
  totalPages: number;
  first: number;
  last: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TableFooter({ page, totalPages, first, last, total, onPageChange }: TableFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-3">
      <p className="text-[16px] text-[#99A1AF]">
        Showing data {first} to {last} of {total} entries
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PageButton>
        {pageItems(page, totalPages).map((item, i) =>
          item === "…" ? (
            <span key={`gap-${i}`} className="px-4 text-[14px] text-[#364153]">
              …
            </span>
          ) : (
            <PageButton key={item} label={`Page ${item}`} active={item === page} onClick={() => onPageChange(item)}>
              {item}
            </PageButton>
          ),
        )}
        <PageButton label="Next page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PageButton>
      </nav>
    </div>
  );
}
