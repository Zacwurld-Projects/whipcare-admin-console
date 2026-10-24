"use client";

import { useEffect, useRef, useState } from "react";

const USER_TYPES = ["Vehicle Owners", "Fleets Owners", "Service Providers"] as const;

export type EmailUserType = (typeof USER_TYPES)[number];

export type NewEmail = {
  title: string;
  body: string;
  userType: EmailUserType;
  image?: File;
  scheduledAt?: { month: string; date: string; time: string };
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DATES = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const TIMES = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  return `${h}:00 ${i < 12 ? "AM" : "PM"}`;
});

type CreateEmailDrawerProps = {
  /** "Alert" adds the image upload section. */
  kind?: "Email" | "Alert";
  open: boolean;
  onClose: () => void;
  onSend?: (email: NewEmail) => void;
  onSchedule?: (email: NewEmail) => void;
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 space-y-2">
      <span className="text-[16px] font-medium leading-[1.4] text-[#101828]">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[54px] w-full appearance-none rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-4 text-center text-[14px] font-medium text-[#6A7282] outline-none focus:border-[#711E00]"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/marketing/unfold.svg"
          alt=""
          width={10.5}
          height={11.77}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        />
      </span>
    </label>
  );
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${Math.round(bytes / (1024 * 1024))}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`;

function formatStamp(d: Date) {
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase();
  return `${date} | ${time}`;
}

function ImageUpload({ file, onChange }: { file: File | null; onChange: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stamp] = useState(() => formatStamp(new Date()));

  return (
    <div className="space-y-4">
      <p className="text-[16px] font-medium leading-[1.4] text-[#101828]">Upload Image</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col items-center gap-4 rounded-2xl border-[1.5px] border-dashed border-[#FA9874] bg-[#FFFBFA] px-6 py-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/marketing/upload.svg" alt="" width={55.14} height={54.76} />
        <div className="space-y-0.5 text-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[13.69px] font-semibold leading-[1.45] text-[#711E00]"
          >
            Click to upload
          </button>
          <p className="text-[11.73px] leading-[1.45] text-[#98A2B3]">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        </div>
        <div className="flex w-full items-center gap-2" aria-hidden="true">
          <span className="h-px flex-1 bg-[#F0F2F5]" />
          <span className="text-[11.73px] font-semibold leading-[1.45] text-[#98A2B3]">OR</span>
          <span className="h-px flex-1 bg-[#F0F2F5]" />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-[#711E00] px-4 py-2 text-[13.69px] font-semibold text-white"
        >
          Browse Files
        </button>
      </div>

      {file && (
        <div className="flex items-center gap-4 border-b border-[#F0F2F5] pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/marketing/file-done.svg" alt="" width={47.4} height={46.94} />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-[13.39px] font-medium leading-[1.45] text-black">{file.name}</p>
            <p className="flex items-center gap-1.5 text-[11.47px] font-medium leading-[1.45] text-[#98A2B3]">
              <span>{stamp}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/marketing/dot.svg" alt="" width={3.9} height={3.9} />
              <span>{formatSize(file.size)}</span>
            </p>
          </div>
          <button type="button" aria-label="Remove image" onClick={() => onChange(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/marketing/bin.svg" alt="" width={27.38} height={27.38} />
          </button>
        </div>
      )}
    </div>
  );
}

const FIELD = "w-full rounded-lg border border-[#D1D5DC] bg-[#F9FAFB] px-4 text-[16px] font-medium text-[#101828] outline-none focus:border-[#711E00]";

export function CreateEmailDrawer({ kind = "Email", open, onClose, onSend, onSchedule }: CreateEmailDrawerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [userType, setUserType] = useState<EmailUserType>("Vehicle Owners");
  const [scheduling, setScheduling] = useState(false);
  const [month, setMonth] = useState("April");
  const [date, setDate] = useState("08");
  const [time, setTime] = useState("3:00 PM");

  useEffect(() => {
    if (!open) {
      // Always reopen on the compose step.
      setScheduling(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const email: NewEmail = { title: title.trim(), body: body.trim(), userType, ...(image && { image }) };
  const canSubmit = Boolean(email.title && email.body);

  const finish = (cb?: (email: NewEmail) => void) => {
    cb?.(email);
    setTitle("");
    setBody("");
    setImage(null);
    setUserType("Vehicle Owners");
    setScheduling(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-black/[0.16]" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-drawer-title"
        className="relative z-10 flex h-full w-full max-w-[600px] flex-col bg-white"
      >
        <div className="relative shrink-0 px-8 pb-6 pt-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute left-8 top-8 flex size-6 items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/marketing/close.svg" alt="" width={15.5} height={15.5} />
          </button>
          <h2 id="create-drawer-title" className="text-center text-[18px] font-semibold leading-[1.4] text-[#101828]">
            Create New {kind}
          </h2>
          <div className="mt-5 flex items-center gap-2" aria-hidden="true">
            <span className="h-px flex-1 bg-[#99A1AF]" />
            <span className="size-3 rounded-full bg-[#711E00]" />
            <span className="h-px flex-1 bg-[#99A1AF]" />
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 pb-8">
          <div className="space-y-[18px] rounded-2xl border border-[#D1D5DC] bg-[#F9FAFB] p-6">
            {kind === "Alert" && <ImageUpload file={image} onChange={setImage} />}

            <label className="block space-y-2">
              <span className="text-[16px] font-medium leading-[1.4] text-[#101828]">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Boring Newsletter"
                className={`${FIELD} h-14`}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[16px] font-medium leading-[1.4] text-[#101828]">Body</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="It has been a long time since..."
                className={`${FIELD} h-[150px] resize-none py-4`}
              />
            </label>

            <div className="space-y-2">
              <p className="text-[16px] font-medium leading-[1.4] text-[#101828]">Select User type</p>
              <div role="radiogroup" aria-label="User type" className="flex gap-4">
                {USER_TYPES.map((t) => {
                  const selected = userType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setUserType(t)}
                      className={`flex-1 rounded-lg bg-[#F9FAFB] px-4 py-[17px] text-[14px] font-medium leading-[1.4] ${
                        selected
                          ? "border-[1.5px] border-[#711E00] text-[#711E00]"
                          : "border border-[#D1D5DC] text-[#101828]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {scheduling ? (
            <>
              <div className="flex gap-4 rounded-2xl border border-[#D1D5DC] bg-[#F9FAFB] p-6">
                <SelectField label="Month" value={month} options={MONTHS} onChange={setMonth} />
                <SelectField label="Date" value={date} options={DATES} onChange={setDate} />
                <SelectField label="Time" value={time} options={TIMES} onChange={setTime} />
              </div>
              <button
                type="button"
                onClick={() => finish(onSchedule && ((e) => onSchedule({ ...e, scheduledAt: { month, date, time } })))}
                className="h-16 w-full rounded-lg bg-[#711E00] text-[16px] font-medium text-white"
              >
                Schedule
              </button>
            </>
          ) : (
            <div className="flex gap-8">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => setScheduling(true)}
                className="h-16 flex-1 rounded-lg bg-[#F3F4F6] text-[16px] font-medium text-[#737373] disabled:cursor-not-allowed"
              >
                Schedule
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => finish(onSend)}
                className="h-16 flex-1 rounded-lg bg-[#711E00] text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send Now
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
