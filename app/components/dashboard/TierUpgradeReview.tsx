import { TierShield } from "./icons";

export function TierUpgradeReview() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Tier upgrade review</h3>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-[#711E00] px-3 py-1 text-xs font-semibold text-white"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
            10
          </span>
          View All Pending Request
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Isaac Zacwurld</span>
          <span className="text-slate-500">Requested to upgrade from</span>
          <span className="inline-flex items-center gap-1">
            <TierShield tier={1} />
            <span className="font-medium">Tier 1</span>
          </span>
          <span className="text-slate-500">to</span>
          <span className="inline-flex items-center gap-1">
            <TierShield tier={2} />
            <span className="font-medium">Tier 2</span>
          </span>
        </div>
        <button type="button" className="text-sm font-semibold text-[#FE915D] hover:text-[#711E00]">
          View details
        </button>
      </div>
    </div>
  );
}
