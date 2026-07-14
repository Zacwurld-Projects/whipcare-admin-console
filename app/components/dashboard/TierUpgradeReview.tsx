"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  asTierLevel,
  fetchTierUpgrades,
  getTierUpgradeDisplayName,
  type TierUpgradeApplication,
} from "@/app/lib/api";
import { TierShield } from "./icons";
import { TierUpgradeDetailsDrawer } from "./TierUpgradeDetailsDrawer";

function TierBadge({ tier }: { tier: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-[18px] bg-[#F3F4F6] pr-2">
      <TierShield tier={tier} />
      <span className="text-xs font-medium text-primary">Tier {tier}</span>
    </span>
  );
}

export function TierUpgradeReview() {
  const [selected, setSelected] = useState<TierUpgradeApplication | null>(null);
  const [preview, setPreview] = useState<TierUpgradeApplication | null>(null);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchTierUpgrades({ status: "pending", page: 1, limit: 1 });
        if (cancelled) return;
        setPreview(res.data[0] ?? null);
        setPendingTotal(res.meta.total);
      } catch {
        if (cancelled) return;
        setPreview(null);
        setPendingTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const fromTier = preview ? asTierLevel(preview.fromTier) : null;
  const toTier = preview ? asTierLevel(preview.toTier) : null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#364153]">Tier upgrade review</h3>
        <Link
          href="/dashboard/service-providers/tier-upgrade"
          className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[12px] text-white">
            {pendingTotal}
          </span>
          <span className="text-[12px] font-semibold text-primary underline">View All Pending Request</span>
        </Link>
      </div>

      <div className="-mx-5 mb-4 flex items-center px-5">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <div className="mx-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#711E00]" />
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-slate-400">Loading…</p>
      ) : !preview ? (
        <p className="py-4 text-center text-sm text-slate-400">No pending requests</p>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
          <span className="shrink-0 text-sm font-medium text-[#4A5565]">
            {getTierUpgradeDisplayName(preview)}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <span className="font-medium text-[#101828]">Requested to upgrade from</span>
            {fromTier ? <TierBadge tier={fromTier} /> : <span className="text-slate-400">—</span>}
            <span className="text-slate-500">to</span>
            {toTier ? <TierBadge tier={toTier} /> : <span className="text-slate-400">—</span>}
          </div>
          <button
            type="button"
            onClick={() => setSelected(preview)}
            className="shrink-0 text-sm font-medium text-primary underline hover:text-[#711E00]"
          >
            View details
          </button>
        </div>
      )}

      <TierUpgradeDetailsDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        application={selected}
        onReviewed={() => {
          setSelected(null);
          setReloadToken((token) => token + 1);
        }}
      />
    </div>
  );
}
