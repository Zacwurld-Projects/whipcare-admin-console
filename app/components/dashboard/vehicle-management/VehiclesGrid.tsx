"use client";

import { useState } from "react";
import { FleetDetailsDrawer } from "./FleetDetailsDrawer";
import { VehicleDetailsDrawer } from "./VehicleDetailsDrawer";

export type VehicleRow = {
  owner: string;
  name: string;
  plate: string;
  type: string;
  colour: string;
  colourHex: string;
  dateAdded: string;
};

export const sampleRow: VehicleRow = {
  owner: "Isaac Zacwurld",
  name: "BMW M6 Coupe LCI 2014",
  plate: "BEN 123 AA",
  type: "Car",
  colour: "Red",
  colourHex: "#FB2C36",
  dateAdded: "17-Apr-2026",
};

export const fleetSampleRow: VehicleRow = {
  ...sampleRow,
  owner: "Whipcare Transport",
  name: "Whipcare Transport Vehicle +25",
};

export type VehicleTab = "Single Vehicle" | "Fleets";

export const filterVehicles = (rows: VehicleRow[], query: string) => {
  const term = query.trim().toLowerCase();
  if (!term) return rows;
  return rows.filter((r) =>
    [r.owner, r.name, r.plate].some((v) => v.toLowerCase().includes(term)),
  );
};

const headClass =
  "px-3 py-1.5 text-left text-[14px] font-semibold text-[#364153] first:pl-6 last:pr-6";
const cellClass =
  "px-3 py-1.5 text-[14px] font-medium leading-[1.4] first:pl-6 last:pr-6";

export function VehiclesGrid({
  rows,
  firstNo,
  tab = "Single Vehicle",
}: {
  rows: VehicleRow[];
  firstNo: number;
  tab?: VehicleTab;
}) {
  const isFleet = tab === "Fleets";
  const [selected, setSelected] = useState<number | null>(null);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const close = () => {
    setSelected(null);
    setShowVehicleInfo(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse">
        <thead>
          <tr className="bg-[#F3F4F6]">
            <th className={headClass}>No</th>
            <th className={headClass}>{isFleet ? "Fleets Owner" : "Vehicle Owner"}</th>
            <th className={headClass}>{isFleet ? "Fleet Name" : "Vehicle Name"}</th>
            <th className={headClass}>Plate Number</th>
            <th className={headClass}>Vehicle Type</th>
            <th className={headClass}>Colour</th>
            <th className={headClass}>Date added</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-[#99A1AF]"
              >
                No vehicles found
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                onClick={() => setSelected(firstNo + i)}
                className={`h-[52px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer`}
              >
                <td className={`${cellClass} text-[#4A5565]`}>{firstNo + i}</td>
                <td className={`${cellClass} text-[#4A5565]`}>{row.owner}</td>
                <td className={`${cellClass} text-[#101828]`}>{row.name}</td>
                <td className={`${cellClass} text-[#4A5565]`}>{row.plate}</td>
                <td className={`${cellClass} text-[#101828]`}>{row.type}</td>
                <td className={`${cellClass} text-[#101828]`}>
                  <span className="flex items-center gap-1">
                    <span
                      className="size-4 rounded"
                      style={{ backgroundColor: row.colourHex }}
                    />
                    {row.colour}
                  </span>
                </td>
                <td className={`${cellClass} text-[#101828]`}>
                  {row.dateAdded}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <FleetDetailsDrawer
        open={isFleet && selected !== null && !showVehicleInfo}
        onClose={close}
        onViewVehicleInfo={() => setShowVehicleInfo(true)}
      />
      <VehicleDetailsDrawer
        open={selected !== null && (!isFleet || showVehicleInfo)}
        onClose={close}
      />
    </div>
  );
}
