"use client";

import { useState } from "react";
import { OverviewStatCard } from "@/app/components/dashboard/overview/OverviewStatCard";
import { TableFooter } from "@/app/components/dashboard/TableFooter";
import { CreateEmailDrawer } from "./CreateEmailDrawer";

const TABS = ["Emails", "Alerts", "Whip Points", "Rewards"] as const;

type Tab = (typeof TABS)[number];

const emailStats = [
  { title: "Total Emails Sent", value: "1,054" },
  { title: "Emails Sent to Vehicles Owners", value: 354 },
  { title: "Emails Sent to Service Providers", value: 354 },
  { title: "Emails Sent to Fleets Owners", value: 354 },
];

const alertStats = [
  { title: "Total Alerts Sent", value: "1,054" },
  { title: "Alerts Sent to Vehicles Owners", value: 354 },
  { title: "Alerts Sent to Service Providers", value: 354 },
  { title: "Alerts Sent to Fleets Owners", value: 354 },
];

type MessageStatus = "Scheduled" | "Published";

const messages: { id: number; status: MessageStatus }[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  status: i === 0 ? "Scheduled" : "Published",
}));

const TAB_CONTENT = {
  Emails: { stats: emailStats, unit: "Emails", heading: "All Emails", create: "Create New Email" },
  Alerts: { stats: alertStats, unit: "Alerts", heading: "All Alerts", create: "Create New Alerts" },
} as const;

const COLUMNS = ["Title", "Body", "Date & time", "Delivery", "Open", "User Type", "Status"];
const GRID = "grid grid-cols-[1.2fr_1.6fr_1.6fr_0.7fr_0.7fr_1fr_0.8fr] items-center gap-4 px-6";

const PAGE_SIZE = 8;
const TOTAL_ENTRIES = 800;
const TOTAL_PAGES = 10;

function MailIcon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/marketing/mail.svg" alt="" width={14.33} height={12.33} />;
}

function BellIcon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/marketing/bell.svg" alt="" width={13.67} height={14.33} />;
}

function ComingSoon({ tab }: { tab: Tab }) {
  return (
    <section className="flex h-[240px] items-center justify-center rounded-2xl bg-white text-[14px] text-[#6A7282]">
      {tab} will be available soon.
    </section>
  );
}

export function MarketingPage() {
  const [tab, setTab] = useState<Tab>("Emails");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ENTRIES);
  const content = tab === "Emails" || tab === "Alerts" ? TAB_CONTENT[tab] : null;
  const Icon = tab === "Alerts" ? BellIcon : MailIcon;

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-normal leading-[1.4] text-[#1D2739]">Marketings and Points</h1>

      <div role="tablist" className="flex items-center gap-6 rounded-xl bg-white px-6 py-[22px]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`text-[14px] font-medium leading-[1.4] ${
              tab === t ? "text-[#711E00] underline" : "text-[#4A5565]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== "Emails" && tab !== "Alerts" ? (
        <ComingSoon tab={tab} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content?.stats.map(({ title, value }) => (
              <OverviewStatCard
                key={title}
                title={title}
                icon={<Icon />}
                value={value}
                change="12.8%"
                trend="down"
                unit={content!.unit}
              />
            ))}
          </div>

          <section className="overflow-hidden rounded-2xl bg-white">
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold leading-[1.4] text-[#101828]">{content?.heading}</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="text-[12px] font-medium text-[#711E00] underline"
                >
                  {content?.create}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-[#99A1AF]" />
                <span className="size-3 rounded-full bg-[#711E00]" />
                <span className="h-px flex-1 bg-[#99A1AF]" />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[900px]">
                <div className={`${GRID} bg-[#F3F4F6] py-1.5 text-[14px] font-semibold text-[#364153]`}>
                  {COLUMNS.map((c, i) => (
                    <span key={c} className={i >= 3 && i <= 5 ? "text-center" : undefined}>
                      {c}
                    </span>
                  ))}
                </div>
                {messages.map(({ id, status }) => (
                  <div
                    key={id}
                    className={`${GRID} border-b border-[#E5E7EB] py-[14px] text-[14px] font-medium text-[#101828]`}
                  >
                    <span className="text-[#4A5565]">Boring Newsletter</span>
                    <span className="truncate font-normal text-[#475367]">It has been a long time since...</span>
                    <span>Nov 12, 2024 . 09:32AM</span>
                    <span className="text-center">60.56%</span>
                    <span className="text-center">80.56%</span>
                    <span className="text-center">Vehicle Owners</span>
                    <span className={status === "Scheduled" ? "text-[#F0B100]" : "text-[#00A63E]"}>{status}</span>
                  </div>
                ))}
              </div>
            </div>

            <TableFooter
              page={page}
              totalPages={TOTAL_PAGES}
              first={first}
              last={last}
              total={TOTAL_ENTRIES}
              onPageChange={setPage}
            />
          </section>
        </>
      )}

      <CreateEmailDrawer kind={tab === "Alerts" ? "Alert" : "Email"} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
