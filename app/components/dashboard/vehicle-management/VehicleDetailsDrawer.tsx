"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, type ReactNode } from "react";

// Placeholder content from the design; no vehicle-details endpoint is wired up yet.
const vehicle = {
  name: "BMW M6 Coupe LCI 2014",
  addedAt: "17-Apr-2026 . 12:43 PM",
  healthScore: 90,
  mileage: "7,7005",
  serviceDue: "03/04/2026",
  accidents: "2 Found",
};

const sections: { title: string; rows: [string, string][] }[] = [
  {
    title: "Vehicle Identity",
    rows: [
      ["Brand:", "BMW M6 Coupe LCI 2014 (Red)"],
      ["Body style:", "2-door Coupe . 4 Seats"],
      ["Drive type:", "Rear-wheel drive (RWD)"],
      ["Trim:", "Base / Competition Package"],
    ],
  },
  {
    title: "Engine & Performance",
    rows: [
      ["Engine:", "4.4L twin-turbo V8, DOHC, 90° configuration, 32 valves"],
      ["Power:", "552 bhp (560 PS / 412 kW) at 6,000–7,000 rpm"],
      ["Torque:", "680 Nm (502 lb·ft) at 1,500–5,750 rpm"],
      ["Transmission:", "7-speed dual-clutch (M-DCT) with paddle shifters"],
    ],
  },
  {
    title: "Performance figures",
    rows: [["0–100 km/h:", "4.2 seconds · Top speed: 250 km/h (155 mph)"]],
  },
  {
    title: "Dimensions & weight",
    rows: [["Kerb weight:", "1,925 kg (4,244 lbs)"]],
  },
  {
    title: "Fuel consumption",
    rows: [
      ["Urban:", "13.9 l/100km"],
      ["Extra-urban:", "7.6 l/100km"],
      ["Combined:", "9.9 l/100km"],
      ["CO₂ emissions:", "231 g/km"],
    ],
  },
];

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md bg-white p-[19px]">
      <h3 className="text-[19px] font-semibold leading-[1.4] text-[#101828]">{title}</h3>
      <hr className="-mx-[19px] mt-[14px] border-[#D1D5DC]" />
      <div className="mt-[12px]">{children}</div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center text-[19px] leading-[1.4]">
      {icon}
      <div className="flex flex-col items-center gap-[3px]">
        <span className="text-[#4A5565]">{label}</span>
        <span className="font-semibold text-[#364153]">{value}</span>
      </div>
    </div>
  );
}

const StatDivider = () => <span className="h-[94px] w-px bg-[#D1D5DC]" aria-hidden="true" />;

export function VehicleDetailsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-black/[0.16]" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Vehicle details"
        className="relative z-10 h-full w-full max-w-[600px] overflow-y-auto bg-white px-6 pb-8 pt-8 shadow-[-8px_0_40px_rgba(0,0,0,0.12)] sm:px-6"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-6 items-center justify-center text-[#711E00]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-[18px] font-medium text-[#4A5565]">{vehicle.addedAt}</p>
        </div>

        <div className="mx-auto mt-6 flex flex-col gap-[50px]">
          <div className="flex h-[75px] items-end justify-center rounded-xl bg-[#F9FAFB] px-3 py-[22px]">
            <p className="text-[24px] font-semibold leading-[1.4] text-[#170600]">{vehicle.name}</p>
          </div>

          <div className="relative mx-auto h-[252px] w-full max-w-[552px]">
            <img src="/icons/profile/car-shadow.svg" alt="" className="absolute bottom-0 left-0 h-[133px] w-full" />
            <img
              src="/images/profile/car.png"
              alt={vehicle.name}
              className="absolute left-[8%] top-0 h-[189px] w-[85%] object-cover"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-[22px] rounded-xl bg-[#F3F4F6] p-[19px]">
          <div className="flex items-center justify-between rounded-md bg-white p-3">
            <p className="text-[22px] font-medium text-black">Vehicle Health Score</p>
            <span className="flex size-[50px] items-center justify-center rounded-md bg-[#711E00] text-[22px] font-medium text-white">
              {vehicle.healthScore}
            </span>
          </div>

          <Panel title="Vital Infomation">
            <div className="flex items-center justify-between px-3">
              <Stat
                icon={<img src="/icons/vehicle/speedometer.svg" alt="" className="size-[37.5px]" />}
                label="Mileage"
                value={vehicle.mileage}
              />
              <StatDivider />
              <Stat
                icon={<img src="/icons/vehicle/info-diamond.svg" alt="" className="m-[2px] size-[33.6px]" />}
                label="Service due"
                value={vehicle.serviceDue}
              />
              <StatDivider />
              <Stat
                icon={
                  <span className="relative block size-[37.5px]">
                    <img
                      src="/icons/vehicle/car.svg"
                      alt=""
                      className="absolute left-[2px] top-[3.5px] w-[33.6px] -scale-y-100"
                    />
                    <span className="absolute right-0 top-0 flex size-[22.5px] items-center justify-center rounded-full border border-[#101828] bg-white">
                      <img src="/icons/vehicle/info-diamond-dark.svg" alt="" className="size-[14px]" />
                    </span>
                  </span>
                }
                label="Accidents"
                value={vehicle.accidents}
              />
            </div>
          </Panel>

          {sections.map(({ title, rows }) => (
            <Panel key={title} title={title}>
              <dl className="flex flex-col gap-[25px]">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex flex-wrap gap-x-1.5 text-[19px] leading-[1.4]">
                    <dt className="text-[#4A5565]">{label}</dt>
                    <dd className="font-semibold text-[#364153]">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ))}
        </div>
      </aside>
    </div>
  );
}
