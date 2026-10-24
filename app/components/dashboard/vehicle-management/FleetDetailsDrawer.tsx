"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type ReactNode } from "react";

const vehicleTypes = [
  { name: "SUV", src: "/icons/fleet/suv.svg", width: 97.5 },
  { name: "Sedan", src: "/icons/fleet/sedan.svg", width: 120 },
  { name: "Chopper", src: "/icons/fleet/chopper.svg", width: 96.5 },
] as const;

const vehicleCounts = [1, 2, 3, 4, 5, 6, 7, 9, 10];
const models = ["M6 Coupe LCI", "M4 Competition", "X5 M"];
const years = ["2014", "2015", "2016", "2017"];

const fieldClass =
  "flex h-14 w-full items-center rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-4 text-[16px] font-medium text-[#101828] outline-none focus:border-[#711E00]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[16px] font-medium leading-[1.4] text-[#101828]">{label}</span>
      {children}
    </label>
  );
}

const ValidBadge = () => <img src="/icons/fleet/badge-error.svg" alt="" className="size-[22px] shrink-0" />;

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <span className="relative block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} appearance-none pr-12`}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <img
          src="/icons/fleet/arrow-down.svg"
          alt=""
          className="pointer-events-none absolute right-[21px] top-1/2 h-[7.5px] w-[13.5px] -translate-y-1/2"
        />
      </span>
    </Field>
  );
}

// Placeholder values from the design; no fleet endpoint is wired up yet.
export function FleetDetailsDrawer({
  open,
  onClose,
  onViewVehicleInfo,
}: {
  open: boolean;
  onClose: () => void;
  onViewVehicleInfo: () => void;
}) {
  const [type, setType] = useState<string>("Sedan");
  const [count, setCount] = useState(1);
  const [fleetSize, setFleetSize] = useState("25");
  const [fleetName, setFleetName] = useState("Whipcare Transport Vehicle");
  const [plate, setPlate] = useState("BEN 123 AA");
  const [vin, setVin] = useState("1HGBH41JXMN109186");
  const [model, setModel] = useState(models[0]);
  const [year, setYear] = useState(years[0]);

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
        aria-label="Add your vehicle fleet"
        className="relative z-10 h-full w-full max-w-[600px] overflow-y-auto bg-white pb-8 shadow-[-8px_0_40px_rgba(0,0,0,0.12)]"
      >
        <div className="relative h-[117px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute left-8 top-8 flex size-6 items-center justify-center"
          >
            <img src="/icons/fleet/cancel.svg" alt="" className="size-[15.5px]" />
          </button>
          <p className="absolute inset-x-0 top-8 text-center text-[18px] font-semibold leading-[1.4] text-[#101828]">
            Add Your Vehicle Fleet
          </p>
          <img src="/icons/fleet/steps.svg" alt="" className="absolute left-1/2 top-[73px] h-3 w-[552px] max-w-[calc(100%-48px)] -translate-x-1/2" />
        </div>

        <div className="mx-auto mt-2 flex w-full max-w-[536px] flex-col gap-8 px-4">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-[18px] rounded-2xl border border-[#D1D5DC] bg-[#F9FAFB] p-6">
              <div className="flex flex-col gap-2">
                <p className="text-[16px] font-medium leading-[1.4] text-[#101828]">Select Vehicle Type</p>
                <div className="flex gap-4 sm:gap-8">
                  {vehicleTypes.map(({ name, src, width }) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={name}
                      aria-pressed={type === name}
                      onClick={() => setType(name)}
                      className={`flex h-20 min-w-0 flex-1 items-center justify-center rounded-lg bg-[#F3F4F6] ${
                        type === name ? "border-[1.667px] border-[#711E00]" : "border-[1.667px] border-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="h-10 max-w-full" style={{ width }} />
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Number of Vehicle in fleet">
                <input value={fleetSize} onChange={(e) => setFleetSize(e.target.value)} inputMode="numeric" className={fieldClass} />
              </Field>
              <Field label="Fleet Name">
                <input value={fleetName} onChange={(e) => setFleetName(e.target.value)} className={fieldClass} />
              </Field>
            </section>

            <section className="flex flex-col gap-[18px] rounded-2xl border border-[#D1D5DC] bg-[#F9FAFB] p-6">
              <div className="flex gap-2 sm:gap-4">
                {vehicleCounts.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={count === n}
                    onClick={() => setCount(n)}
                    className={`flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg bg-[#F3F4F6] text-[16px] font-medium ${
                      count === n ? "border-2 border-[#711E00] text-[#711E00]" : "border-2 border-transparent text-[#737373]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <Field label="Plate Number">
                <span className="relative block">
                  <input value={plate} onChange={(e) => setPlate(e.target.value)} className={`${fieldClass} pr-12`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ValidBadge />
                  </span>
                </span>
              </Field>

              <div className="flex flex-col gap-2">
                <Field label="VIN Number">
                  <span className="relative block">
                    <input value={vin} onChange={(e) => setVin(e.target.value)} className={`${fieldClass} pr-12`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ValidBadge />
                    </span>
                  </span>
                </Field>
                <p className="flex items-center justify-center gap-1 text-[14px] leading-[1.4] text-[#364153]">
                  <img src="/icons/fleet/alert.svg" alt="" className="size-5 object-contain p-[1.5px]" />
                  17-character VIN is on the vehicle dashboard or door frame.
                </p>
              </div>

              <Field label="Brand">
                <div className={`${fieldClass} gap-2`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#4A5565]">
                    <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m20.5 20.5-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <img src="/icons/fleet/divider.svg" alt="" className="h-5 w-px" />
                  <img src="/icons/fleet/bmw.svg" alt="" className="size-6" />
                  <span className="text-[#4A5565]">BMW</span>
                </div>
              </Field>

              <SelectField label="Model" value={model} options={models} onChange={setModel} />
              <SelectField label="Year" value={year} options={years} onChange={setYear} />

              <Field label="Colour">
                <div className={`${fieldClass} justify-between`}>
                  <span>Red</span>
                  <span className="size-6 rounded-[5px] bg-[#FB2C36]" />
                </div>
              </Field>
            </section>
          </div>

          <button
            type="button"
            onClick={onViewVehicleInfo}
            className="flex h-16 w-full items-center justify-center rounded-lg bg-[#711E00] text-[16px] font-medium text-white hover:bg-[#5A1800]"
          >
            View Vehicle Info
          </button>
        </div>
      </aside>
    </div>
  );
}
