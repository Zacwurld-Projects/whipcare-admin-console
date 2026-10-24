"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { UserProfileData } from "@/app/lib/api";

const na = "N/A";

function formatDate(value?: string | null) {
  if (!value) return na;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return na;
  return new Intl.DateTimeFormat("en-GB").format(date);
}

// The profile API does not return the owner's vehicles yet, so these are the design's sample entries.
const sampleVehicles = [
  { id: "bmw", name: "BMW M6 Coupe LCI 2014", favourite: true },
  { id: "audi-1", name: "Audi Convertible 2009", favourite: true },
  { id: "lexus-1", name: "Lexus Rx 350 2023", favourite: true },
  { id: "audi-2", name: "Audi Convertible 2009", favourite: false },
  { id: "lexus-2", name: "Lexus Rx 350 2023", favourite: false },
];

export function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 rounded-lg bg-[#F9FAFB] px-4 py-2">
      <p className="text-[12px] font-medium leading-[1.45] tracking-[-0.06px] text-[#1E2939] opacity-50">{label}</p>
      <p className="truncate text-[14px] leading-[1.45] text-[#344054]">{value}</p>
    </div>
  );
}

export function PersonalInfoPanel({ profile }: { profile?: UserProfileData }) {
  const [selected, setSelected] = useState(sampleVehicles[0].id);
  const user = profile?.user;
  const address = profile?.addresses?.find((a) => a.address)?.address;

  return (
    <section className="rounded-2xl bg-white p-4">
      <h3 className="text-[14px] font-semibold text-[#364153]">Personal Information</h3>

      <div className="mt-3 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoTile label="Sign up date" value={formatDate(user?.createdAt)} />
          <InfoTile label="Date of Birth" value={na} />
          <InfoTile label="Nationality" value={user?.nationality || na} />
          <InfoTile label="Language" value={user?.language || na} />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#F9FAFB] px-4 py-4">
          <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#711E00]">
            <img src="/icons/profile/location.svg" alt="" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium leading-[1.45] text-[#101928]">Address</p>
            <p className="truncate text-[15px] text-[#868782]">{address || na}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-[#F9FAFB] p-4 sm:flex-row">
          <div className="flex w-full flex-col items-center gap-4 sm:w-[250px] sm:shrink-0">
            <div className="relative h-[114px] w-[250px]">
              <img src="/icons/profile/car-shadow.svg" alt="" className="absolute bottom-0 left-0 h-[60px] w-full" />
              <img src="/images/profile/car.png" alt="Selected vehicle" className="absolute left-[19px] top-0 h-[86px] w-[212px] object-cover" />
            </div>
            <div className="w-full rounded-md bg-[#F3F4F6] p-2">
              <div className="flex items-center justify-between rounded bg-white p-1.5">
                <span className="text-[10px] font-medium leading-[1.4] text-black">Vehicle Health Score</span>
                <span className="flex size-[22.7px] items-center justify-center rounded bg-[#711E00] text-[10px] font-medium text-white">
                  90
                </span>
              </div>
            </div>
            <button type="button" className="text-[12px] font-medium text-[#711E00] underline">
              See Vehicle Infomation
            </button>
          </div>

          <ul className="notification-scroll flex max-h-[220px] min-w-0 flex-1 flex-col gap-2 overflow-y-auto pr-3">
            {sampleVehicles.map(({ id, name, favourite }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`flex h-[38px] w-full items-center justify-between rounded-lg border bg-white px-[7px] ${
                    selected === id ? "border-[#711E00]" : "border-[#F3F4F6]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#F7F9FC]">
                      <img src="/icons/profile/car-fill.svg" alt="" className="size-[16.9px]" />
                    </span>
                    <span className="text-[12px] leading-[1.4] text-[#101928]">{name}</span>
                  </span>
                  <img src={`/icons/profile/${favourite ? "star-yellow" : "star-grey"}.svg`} alt="" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
