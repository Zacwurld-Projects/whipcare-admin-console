"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, type ReactNode } from "react";

// Placeholder content from the design; no booking-details endpoint is wired up yet.
const vehicles = [
  { label: "1st Vehicle", plate: "BEN 123 AA", services: [true, true, false] },
  { label: "2nd Vehicle", plate: "BEN 456 BB", services: [true, false, true] },
  { label: "3rd Vehicle", plate: "BEN 789 CC", services: [true, false, false] },
  { label: "4th Vehicle", plate: "BEN 456 CC", services: [false, true, true] },
  { label: "4th Vehicle", plate: "BEN 456 CC", services: [false, true, true] },
];
const serviceNames = ["Inspection", "General Service", "AC Repair"];

function Row({ label, value, tone = "muted" }: { label: ReactNode; value: ReactNode; tone?: "muted" | "dark" }) {
  return (
    <div className="flex items-center justify-between text-[18px] font-medium leading-[1.4]">
      <span className={tone === "dark" ? "text-[#4A5565]" : "text-[#6A7282]"}>{label}</span>
      <span className={tone === "dark" ? "text-[#4A5565]" : "text-[#6A7282]"}>{value}</span>
    </div>
  );
}

const Rule = () => <hr className="border-[#D1D5DC]" />;

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className="text-center text-[21px] font-semibold leading-[1.4] text-[#101828]">{children}</h3>
      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        <span className="h-px flex-1 bg-[#D1D5DC]" />
        <span className="size-3 rounded-full bg-[#711E00]" />
        <span className="h-px flex-1 bg-[#D1D5DC]" />
      </div>
    </>
  );
}

function Attachments() {
  return (
    <div className="flex items-center gap-3">
      <img src="/images/bookings/attach-1.png" alt="" className="h-9 w-12 rounded-md object-cover" />
      <img src="/images/bookings/attach-2.png" alt="" className="h-9 w-12 rounded-md object-cover" />
    </div>
  );
}

function VehicleServices({ label, plate, services, bare }: (typeof vehicles)[number] & { bare?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[9px] ${bare ? "bg-[#F9FAFB]" : "bg-[#F9FAFB]"}`}>
      <div className="flex items-center justify-between rounded-[9px] bg-[#F3F4F6] px-6 py-3 text-[18px] font-medium text-[#364153]">
        <span>{label}</span>
        <span>{plate}</span>
      </div>
      <div className="flex flex-wrap gap-x-12 gap-y-3 px-6 pb-6 pt-5">
        {serviceNames.map((name, i) => (
          <span
            key={name}
            className={`rounded-md border px-2 py-1.5 text-[18px] font-medium ${
              services[i] ? "border-[#711E00] text-[#711E00]" : "border-[#6A7282] text-[#6A7282]"
            }`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BookingDetailsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        className="relative z-10 h-full w-full max-w-[600px] overflow-y-auto bg-white p-8 shadow-[-8px_0_40px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-6 items-center justify-center text-[#4A5565]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-[18px] font-medium text-[#4A5565]">17-Apr-2026 . 12:43 PM</p>
        </div>

        <div className="relative mx-auto mt-6 h-[184px] w-full">
          <div className="absolute bottom-0 left-0 h-[129px] w-full">
            <img src="/icons/profile/car-shadow.svg" alt="" className="size-full" />
          </div>
          <img
            src="/images/profile/car.png"
            alt="BMW M6 Coupe LCI 2014"
            className="absolute left-[41px] top-0 h-[150px] w-[455px] object-cover"
          />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {/* Summary */}
          <section className="rounded-3xl bg-[#F3F4F6] p-6">
            <h2 className="text-center text-[18px] font-bold text-[#1E2939]">BMW M6 Coupe LCI 2014</h2>
            <div className="mt-6 flex flex-col gap-3">
              <Row tone="dark" label="Labour charge" value="₦100,000" />
              <Rule />
              <Row label="Service Status" value="Completed" />
              <Rule />
              <Row label="Service Type" value="Home Service" />
              <Rule />
              <Row label="Service(s) ⌃" value="Completed" />
              <div className="flex gap-9 text-[15px] font-medium text-[#711E00] underline">
                {serviceNames.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Provider */}
          <section className="rounded-3xl bg-[#F3F4F6] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src="/images/bookings/provider.png" alt="" className="size-[97px] rounded-xl object-cover" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-[24px] font-semibold text-[#101828]">Mechanic</p>
                    <button type="button" className="text-[18px] font-medium text-[#711E00] underline">
                      View Profile
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[18px]">
                    <span className="flex items-center gap-1 font-semibold text-[#101828]">
                      <img src="/icons/profile/star-yellow.svg" alt="" className="size-6" />
                      4.5
                    </span>
                    <span className="font-medium text-[#6A7282]">(10 Services Offered)</span>
                  </div>
                  <div className="flex items-center gap-5 text-[18px] font-medium text-[#6A7282]">
                    <span className="flex items-center gap-1">
                      <img src="/icons/profile/location.svg" alt="" className="size-5 invert-[.45]" />
                      10 Km
                    </span>
                    <span>30 Mins</span>
                    <span>16 Hrs</span>
                  </div>
                </div>
              </div>
              <img src="/icons/profile/star-yellow.svg" alt="Favourite" className="size-6" />
            </div>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Row label="2.5kg AC gas" value="₦15,000" />
                <Rule />
                <Row label="10w30 Engine oil" value="₦20,000" />
                <Rule />
                <Row tone="dark" label="Estimated repair parts cost" value="₦35,000" />
                <Rule />
              </div>

              <div className="relative rounded-xl bg-[#F9FAFB] p-[18px] pb-16 text-[18px] text-[#6A7282]">
                I want to to a general service on my car and a car wash immediately after service.
                <div className="absolute bottom-[18px] right-[18px]">
                  <Attachments />
                </div>
              </div>

              <div className="relative rounded-xl bg-[#711E00] p-[18px] pb-16 text-[18px] text-white">
                <p>Noted. We&apos;ll wash the car immediately after the general service is complete.</p>
                <p>Ensure you get the original AC gas and Engine oil</p>
                <div className="absolute bottom-[18px] right-[18px]">
                  <Attachments />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Row label="Vehicle" value="Car" tone="dark" />
                <Rule />
                <Row label="Location" value="Ajah, Lagos Island" tone="dark" />
                <Rule />
                <div className="flex items-start justify-between text-[18px] font-medium leading-[1.4]">
                  <span className="text-[#6A7282]">Services (3)</span>
                  <span className="flex flex-col gap-[3px] text-[#4A5565]">
                    <span>Inspection (6)</span>
                    <span>General service(8)</span>
                    <span>Ac Repair(6)</span>
                  </span>
                </div>
                <Rule />
              </div>
            </div>
          </section>

          {/* Vehicles */}
          <div className="flex flex-col gap-3">
            {vehicles.map((v, i) => (
              <VehicleServices key={i} {...v} />
            ))}
          </div>

          {/* Additional discovery */}
          <section className="rounded-3xl bg-[#F3F4F6] p-6">
            <SectionTitle>Additional Discovery</SectionTitle>
            <div className="mt-6 flex flex-col gap-3">
              <Row label="Brake Pad" value="₦5,000" />
              <Rule />
              <div className="flex items-center justify-between text-[18px] font-medium leading-[1.4] text-[#711E00]">
                <span>
                  Labour charge <span className="font-normal text-[#6A7282]">(Additional Cost)</span>
                </span>
                <span>₦30,000</span>
              </div>
              <Rule />
              <Row tone="dark" label="Estimated repair parts cost" value="₦35,000" />
              <Rule />
            </div>

            <div className="notification-scroll mt-6 flex gap-3 overflow-x-auto pb-1">
              {vehicles.slice(0, 4).map((v) => (
                <div key={v.label + v.plate} className="w-[456px] shrink-0 overflow-hidden rounded-[9px] bg-[#F9FAFB]">
                  <div className="flex items-center justify-between rounded-[9px] bg-white px-6 py-3 text-[18px] font-medium text-[#364153]">
                    <span>{v.label}</span>
                    <span>{v.plate}</span>
                  </div>
                  <div className="flex justify-center px-6 pb-6 pt-5">
                    <span className="rounded-md border border-[#711E00] px-2 py-1.5 text-[18px] font-medium text-[#711E00]">
                      Brake Pad
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-6 rounded-xl bg-white p-[18px] pb-16 text-[18px] text-[#6A7282]">
              While doing the general service, i found a worn out brake pad that needs to be changed immediately
              <div className="absolute bottom-6 right-[18px]">
                <Attachments />
              </div>
            </div>
          </section>

          {/* Feedback */}
          <section className="rounded-3xl bg-[#F3F4F6] p-6">
            <SectionTitle>Feedback</SectionTitle>
            <article className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-[1.2px]" role="img" aria-label="4 out of 5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <img key={i} src={`/icons/profile/${i < 4 ? "star-yellow" : "star-grey"}.svg`} alt="" className="size-4" />
                  ))}
                </span>
                <span className="text-[14px] text-[#667185]">2 days ago</span>
              </div>
              <p className="mt-2.5 text-[14px] leading-[1.4] text-[#4A5565]">
                John was fantastic! He arrived on time, explained everything clearly, and did a great job changing my oil.
                I will definitely be using him again.
              </p>
            </article>
          </section>

          {/* Totals */}
          <div className="flex flex-col gap-4 font-bold">
            <div className="flex h-20 items-center justify-between rounded-xl bg-[#711E00] px-6">
              <span className="text-[21px] text-[#E5E7EB]">Service fee</span>
              <span className="text-[22px] text-white">₦10,500</span>
            </div>
            <div className="flex h-20 items-center justify-between rounded-xl bg-[#F3F4F6] px-6">
              <span className="text-[21px] text-[#4A5565]">Total</span>
              <span className="text-[22px] text-[#1E2939]">₦105,000</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
