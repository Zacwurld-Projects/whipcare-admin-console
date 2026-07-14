"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import {
  asTierLevel,
  getTierUpgradeDisplayName,
  normalizeMediaUrl,
  reviewTierUpgrade,
  type TierUpgradeApplication,
  type TierUpgradeGuarantor,
  type TierUpgradeWorker,
} from "@/app/lib/api";

type TierUpgradeDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  application?: TierUpgradeApplication | null;
  onReviewed?: (status: "approved" | "rejected") => void;
};

type PreviewKind =
  | "nationalId"
  | "selfie"
  | "cac"
  | "worker1NationalId"
  | "worker1Selfie"
  | "worker2NationalId"
  | "worker2Selfie";
type ReviewStatus = "pending" | "denying" | "approved" | "rejected";

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="white" fillOpacity="0.92" />
      <path d="M23 18.5v19l16-9.5-16-9.5Z" fill="#711E00" />
    </svg>
  );
}

function WorkshopVideoPlayer({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <div className="relative mb-4 min-h-[240px] w-full overflow-hidden rounded-xl bg-[#111827] aspect-video">
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-contain"
        playsInline
        preload="metadata"
        controls={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <track kind="captions" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
          aria-label={`Play verification video for ${label}`}
        >
          <PlayIcon />
        </button>
      )}
    </div>
  );
}

function NoVideoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="24" height="20" rx="3" stroke="#9CA3AF" strokeWidth="1.75" />
      <path
        d="M28 16.5l8-4.5v16l-8-4.5v-7Z"
        stroke="#9CA3AF"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 8l24 24" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function NigeriaFlagIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <rect width="6.67" height="14" fill="#008751" />
      <rect x="6.67" width="6.66" height="14" fill="white" />
      <rect x="13.33" width="6.67" height="14" fill="#008751" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#6B7280]">{label}</label>
      <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939]">
        {children}
      </div>
    </div>
  );
}

function ImagePreviewCard({
  title,
  imageUrl,
  onClose,
}: {
  title: string;
  imageUrl?: string | null;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [imageUrl]);

  return (
    <div className="w-[380px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-sm font-semibold text-[#1E2939]">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#4B5563] transition-colors hover:bg-[#F3F4F6]"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="p-4">
        {imageUrl && !failed ? (
          <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-[#F3F4F6]">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-[#9CA3AF]">
                Loading…
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className={`mx-auto max-h-[420px] w-full object-contain transition-opacity ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </div>
        ) : (
          <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#F3F4F6]">
            <span className="text-base font-medium text-[#9CA3AF]">
              {failed ? "Failed to load image" : "No image"}
            </span>
            {imageUrl && failed && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary underline"
              >
                Open link
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GuarantorCards({ guarantors }: { guarantors: TierUpgradeGuarantor[] }) {
  const slots = [0, 1].map((index) => guarantors[index] ?? null);
  const ordinals = ["1st", "2nd"] as const;

  return (
    <>
      {slots.map((guarantor, index) => (
        <div key={ordinals[index]} className="space-y-3 rounded-xl border border-[#E5E7EB] p-4">
          <Field label={`${ordinals[index]} Guarantors/Clients Name`}>
            {guarantor?.name || "—"}
          </Field>
          <Field label={`${ordinals[index]} Guarantors/Clients Phone Number`}>
            <span className="flex items-center gap-2">
              <NigeriaFlagIcon />
              <span>{guarantor?.phoneNumber || "—"}</span>
            </span>
          </Field>
        </div>
      ))}
    </>
  );
}

function VerificationLinkRow({
  label,
  actionLabel,
  onClick,
  disabled,
}: {
  label: string;
  actionLabel: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <span className="text-sm font-medium text-[#4B5563]">{label}</span>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="text-sm font-medium text-primary underline hover:text-[#711E00] disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function SkillTestRow({ score }: { score?: string | number | null }) {
  const label =
    score === null || score === undefined || score === ""
      ? "—"
      : typeof score === "number"
        ? `${score}%`
        : String(score);

  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <span className="text-sm font-medium text-[#4B5563]">Skill Test (70 % Pass Mark)</span>
      <span className="rounded bg-[#711E00] px-2 py-0.5 text-xs font-semibold text-white">
        {label}
      </span>
    </div>
  );
}

function WorkerInfoSection({
  title,
  worker,
  onViewNationalId,
  onViewSelfie,
}: {
  title: string;
  worker?: TierUpgradeWorker | null;
  onViewNationalId: () => void;
  onViewSelfie: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
      <div className="bg-[#711E00] px-4 py-3">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <div className="divide-y divide-[#E5E7EB] px-4">
        <VerificationLinkRow
          label="National ID"
          actionLabel="View Document"
          onClick={onViewNationalId}
          disabled={!normalizeMediaUrl(worker?.nationalId || worker?.document)}
        />
        <VerificationLinkRow
          label="Selfie"
          actionLabel="View Photo"
          onClick={onViewSelfie}
          disabled={!normalizeMediaUrl(worker?.selfie)}
        />
        <SkillTestRow score={worker?.skillTestScore} />
      </div>
    </div>
  );
}

function Tier1to2Details({
  guarantors,
  documentLabel,
  onViewNationalId,
  onViewSelfie,
  hasDocument,
  hasSelfie,
  testScore,
}: {
  guarantors: TierUpgradeGuarantor[];
  documentLabel: string;
  onViewNationalId: () => void;
  onViewSelfie: () => void;
  hasDocument: boolean;
  hasSelfie: boolean;
  testScore?: number | null;
}) {
  return (
    <div className="space-y-3">
      <GuarantorCards guarantors={guarantors} />
      <div className="divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB] px-4">
        <VerificationLinkRow
          label={documentLabel}
          actionLabel="View Document"
          onClick={onViewNationalId}
          disabled={!hasDocument}
        />
        <VerificationLinkRow
          label="Selfie"
          actionLabel="View Photo"
          onClick={onViewSelfie}
          disabled={!hasSelfie}
        />
        <SkillTestRow score={testScore} />
      </div>
    </div>
  );
}

function Tier2to3Details({
  guarantors,
  workers,
  workersCapacity,
  cacNumber,
  onViewCac,
  onViewWorkerNationalId,
  onViewWorkerSelfie,
}: {
  guarantors: TierUpgradeGuarantor[];
  workers: TierUpgradeWorker[];
  workersCapacity?: number | null;
  cacNumber?: string | null;
  onViewCac: () => void;
  onViewWorkerNationalId: (index: number) => void;
  onViewWorkerSelfie: (index: number) => void;
}) {
  const workerSlots = [0, 1].map((index) => workers[index] ?? null);

  return (
    <div className="space-y-3">
      <GuarantorCards guarantors={guarantors} />

      <div className="space-y-3 rounded-xl border border-[#E5E7EB] p-4">
        <Field label="Workers Capacity">{workersCapacity ?? "—"}</Field>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#6B7280]">CAC Number</label>
          <div className="flex h-12 items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#1E2939]">
            <span>{cacNumber || "—"}</span>
            <button
              type="button"
              onClick={onViewCac}
              className="shrink-0 text-sm font-medium text-primary underline hover:text-[#711E00]"
            >
              View Document
            </button>
          </div>
        </div>
      </div>

      {workerSlots.map((worker, index) => (
        <WorkerInfoSection
          key={`worker-${index + 1}`}
          title={`Worker ${index + 1} Informations and Test`}
          worker={worker}
          onViewNationalId={() => onViewWorkerNationalId(index)}
          onViewSelfie={() => onViewWorkerSelfie(index)}
        />
      ))}
    </div>
  );
}

function ResultBadge() {
  return (
    <svg width="120" height="123" viewBox="0 0 120 123" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M118.332 66.9332C119.46 68.6815 120 70.6394 120 72.5775C120 76.084 118.232 79.5206 115.005 81.4886C111.878 83.3966 110.02 86.7833 110.02 90.3798C110.02 90.8092 110.05 91.2389 110.1 91.6784C110.16 92.1179 110.18 92.5576 110.18 92.9871C110.18 98.2618 106.184 102.807 100.789 103.347C98.7512 103.547 96.8631 104.346 95.3246 105.575C93.7861 106.803 92.5974 108.462 91.9482 110.41C90.4796 114.776 86.4137 117.513 82.0678 117.513C80.8791 117.513 79.6704 117.313 78.4914 116.883C77.912 116.674 77.3225 116.514 76.7233 116.414C76.1239 116.304 75.5245 116.254 74.9251 116.254C72.1679 116.254 69.4606 117.353 67.4626 119.401C65.4247 121.499 62.7074 122.548 60 122.548C57.2929 122.548 54.5754 121.499 52.5375 119.401C50.5396 117.353 47.8321 116.254 45.0749 116.254C43.8761 116.254 42.6674 116.464 41.5084 116.883C40.3294 117.313 39.1207 117.513 37.932 117.513C33.5861 117.513 29.5202 114.775 28.0519 110.41C27.4025 108.462 26.2137 106.803 24.6752 105.575C23.1368 104.346 21.2487 103.547 19.2108 103.347C13.8161 102.807 9.8201 98.262 9.8201 92.9871C9.8201 92.5576 9.84008 92.1179 9.89997 91.6784C9.94996 91.2389 9.97998 90.8092 9.97998 90.3798C9.97998 86.7834 8.12175 83.3968 4.99511 81.4886C1.76832 79.5206 0 76.084 0 72.5775C0 70.6394 0.539663 68.6814 1.66833 66.9332C2.78726 65.205 3.33667 63.2469 3.33667 61.2689C3.33667 59.3109 2.78726 57.3328 1.66833 55.6147C0.539663 53.8663 0 51.9083 0 49.9704C0 46.4639 1.76832 43.0373 4.99511 41.0692C8.12191 39.161 9.97998 35.7644 9.97998 32.1681C9.97998 31.7386 9.95013 31.309 9.89997 30.8695C9.84008 30.4298 9.8201 29.9903 9.8201 29.5608C9.8201 24.2861 13.8161 19.7405 19.2108 19.201C21.2487 18.9912 23.1368 18.202 24.6752 16.9732C26.2137 15.7543 27.4025 14.0962 28.0519 12.1481C29.5202 7.78237 33.5962 5.0352 37.9419 5.0352C39.1308 5.0352 40.3294 5.235 41.5084 5.66446C42.6673 6.09391 43.8759 6.29387 45.0749 6.29387C47.8321 6.29387 50.5396 5.19491 52.5375 3.14694C54.5753 1.04898 57.2928 0 60 0C62.7074 0 65.4247 1.04898 67.4626 3.14694C70.3296 6.08401 74.6454 7.0731 78.4916 5.66446C79.6706 5.235 80.8692 5.0352 82.0581 5.0352C86.4038 5.0352 90.4798 7.78237 91.9483 12.1481C92.5977 14.0962 93.7863 15.7543 95.3248 16.9732C96.8632 18.2019 98.7515 18.9912 100.789 19.201C106.184 19.7405 110.18 24.2861 110.18 29.5608C110.18 29.9903 110.16 30.4298 110.1 30.8695C110.05 31.309 110.02 31.7386 110.02 32.1681C110.02 35.7646 111.878 39.161 115.005 41.0692C118.232 43.0372 120 46.4638 120 49.9704C120 51.9083 119.461 53.8665 118.332 55.6147C117.213 57.3328 116.663 59.311 116.663 61.2689C116.663 62.3578 116.833 63.4467 117.173 64.4957C117.443 65.3447 117.832 66.164 118.332 66.9332Z" fill="#8D3C1F" />
      <path d="M119.999 72.5785C119.999 76.0849 118.231 79.5216 115.004 81.4895C111.877 83.3976 110.019 86.7842 110.019 90.3808C110.019 90.8102 110.049 91.2398 110.099 91.6794C110.159 92.1189 110.179 92.5586 110.179 92.988C110.179 98.2628 106.183 102.808 100.788 103.348C98.7502 103.548 96.8621 104.347 95.3236 105.576C93.7851 106.804 92.5964 108.463 91.9471 110.411C90.4786 114.777 86.4127 117.514 82.0668 117.514C80.8781 117.514 79.6694 117.314 78.4904 116.884C77.911 116.675 77.3215 116.515 76.7223 116.415L27.6613 67.3638C25.1337 64.8263 25.1337 60.7104 27.6613 58.183C27.821 58.0231 27.981 57.8733 28.1508 57.7334C30.6984 55.6554 34.4645 55.7953 36.8522 58.183L49.2599 70.5906L81.6676 38.1829C81.8274 38.0331 81.9873 37.8833 82.1571 37.7434C84.7046 35.6553 88.4707 35.8053 90.8584 38.1829L117.172 64.4967C117.442 65.3458 117.832 66.165 118.331 66.9342C119.459 68.6823 119.999 70.6404 119.999 72.5785Z" fill="#711E00" />
      <path d="M90.8569 38.183C88.3209 35.6473 84.2097 35.6473 81.6737 38.183L49.2654 70.5916L36.8508 58.1773C34.3148 55.6419 30.2029 55.6419 27.6675 58.1773C25.1317 60.7133 25.1317 64.8245 27.6675 67.3605L44.6738 84.3664C45.9418 85.6341 47.6035 86.2683 49.2654 86.2683C50.9272 86.2683 52.589 85.6341 53.8569 84.3664L90.8569 47.3663C93.3927 44.8301 93.3927 40.7191 90.8569 38.183Z" fill="white" />
    </svg>
  );
}

function ResultModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close result modal"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-result-title"
        className="relative z-10 flex w-full max-w-[280px] flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <ResultBadge />
        <h3 id="upgrade-result-title" className="text-lg font-semibold text-[#1E2939]">
          {title}
        </h3>
      </div>
    </div>
  );
}

function DenialRequestModal({
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  submitting,
}: {
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close denial modal"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        disabled={submitting}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="denial-request-title"
        className="relative z-10 w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="relative mb-4 flex items-center justify-center">
          <h3 id="denial-request-title" className="text-base font-semibold text-[#1E2939]">
            Denial Request
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
            className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[#4B5563] transition-colors hover:bg-[#F3F4F6] disabled:opacity-50"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] p-4">
          <label htmlFor="denial-reason" className="mb-2 block text-sm font-semibold text-[#1E2939]">
            Denial Reason
          </label>
          <textarea
            id="denial-reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter the reason for Update denial"
            rows={5}
            disabled={submitting}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00] disabled:opacity-60"
          />
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!reason.trim() || submitting}
          className="mt-4 h-12 w-full rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Confirming…" : "Confirm Denial"}
        </button>
      </div>
    </div>
  );
}

export function TierUpgradeDetailsDrawer({
  open,
  onClose,
  application = null,
  onReviewed,
}: TierUpgradeDetailsDrawerProps) {
  const [previews, setPreviews] = useState<PreviewKind[]>([]);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("pending");
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [showDenialReasonModal, setShowDenialReasonModal] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPreviews([]);
      setReviewStatus("pending");
      setShowAcceptedModal(false);
      setShowDeniedModal(false);
      setShowDenialReasonModal(false);
      setDenialReason("");
      setSubmitting(false);
      return;
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (showAcceptedModal) {
        setShowAcceptedModal(false);
        return;
      }
      if (showDeniedModal) {
        setShowDeniedModal(false);
        return;
      }
      if (showDenialReasonModal) {
        setShowDenialReasonModal(false);
        if (reviewStatus === "denying") setReviewStatus("pending");
        return;
      }
      if (previews.length > 0) {
        setPreviews([]);
        return;
      }
      onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [
    open,
    onClose,
    previews.length,
    showAcceptedModal,
    showDeniedModal,
    showDenialReasonModal,
    reviewStatus,
  ]);

  if (!open || !application) return null;

  const applicantName = getTierUpgradeDisplayName(application);
  const fromTier = asTierLevel(application.fromTier) ?? 1;
  const toTier = asTierLevel(application.toTier) ?? 2;
  const videoUrl = normalizeMediaUrl(application.workShopVideo);
  const nationalIdUrl = normalizeMediaUrl(application.document);
  const selfieUrl = normalizeMediaUrl(application.providerSelfie);
  const cacUrl = normalizeMediaUrl(application.cacUrl);
  const hasVideo = Boolean(videoUrl);
  const isTier2to3 = fromTier === 2 && toTier === 3;
  const documentTitle =
    application.documentType === "passport"
      ? "Passport"
      : application.documentType === "national_id"
        ? "National ID"
        : "Document";

  const previewMedia: Record<PreviewKind, string | null> = {
    nationalId: nationalIdUrl,
    selfie: selfieUrl,
    cac: cacUrl,
    worker1NationalId: normalizeMediaUrl(
      application.workers[0]?.nationalId || application.workers[0]?.document,
    ),
    worker1Selfie: normalizeMediaUrl(application.workers[0]?.selfie),
    worker2NationalId: normalizeMediaUrl(
      application.workers[1]?.nationalId || application.workers[1]?.document,
    ),
    worker2Selfie: normalizeMediaUrl(application.workers[1]?.selfie),
  };

  const previewTitles: Record<PreviewKind, string> = {
    nationalId: documentTitle,
    selfie: "Selfie",
    cac: "CAC Number",
    worker1NationalId: "Worker 1 National ID",
    worker1Selfie: "Worker 1 Selfie",
    worker2NationalId: "Worker 2 National ID",
    worker2Selfie: "Worker 2 Selfie",
  };

  function openPreview(kind: PreviewKind) {
    setPreviews((prev) => (prev.includes(kind) ? prev : [...prev, kind]));
  }

  function closePreview(kind: PreviewKind) {
    setPreviews((prev) => prev.filter((p) => p !== kind));
  }

  function handleBackdropClose() {
    if (showAcceptedModal) {
      setShowAcceptedModal(false);
      return;
    }
    if (showDeniedModal) {
      setShowDeniedModal(false);
      return;
    }
    if (showDenialReasonModal) {
      setShowDenialReasonModal(false);
      if (reviewStatus === "denying") setReviewStatus("pending");
      return;
    }
    if (previews.length > 0) {
      setPreviews([]);
      return;
    }
    onClose();
  }

  async function handleAccept() {
    if (!application || submitting) return;
    setSubmitting(true);
    setPreviews([]);
    setShowDenialReasonModal(false);
    try {
      await reviewTierUpgrade(application.id, { status: "approved" });
      setReviewStatus("approved");
      setShowAcceptedModal(true);
      onReviewed?.("approved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve request");
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartDenial() {
    if (submitting) return;
    setPreviews([]);
    setReviewStatus("denying");
    setShowDenialReasonModal(true);
  }

  function handleCancelDenial() {
    if (submitting) return;
    setShowDenialReasonModal(false);
    setReviewStatus("pending");
  }

  async function handleConfirmDenial() {
    if (!application || submitting) return;
    setSubmitting(true);
    try {
      await reviewTierUpgrade(application.id, { status: "rejected" });
      setShowDenialReasonModal(false);
      setReviewStatus("rejected");
      setShowDeniedModal(true);
      onReviewed?.("rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject request");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDowngrade() {
    setReviewStatus("pending");
    setShowAcceptedModal(false);
  }

  function handleReview() {
    setReviewStatus("pending");
    setShowDeniedModal(false);
    setDenialReason("");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/40"
        onClick={handleBackdropClose}
      />

      {previews.length > 0 && (
        <div className="absolute right-[520px] top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4 max-[1100px]:left-4 max-[1100px]:right-auto max-[1100px]:top-4 max-[1100px]:translate-y-0">
          {previews.map((kind) => (
            <ImagePreviewCard
              key={kind}
              title={previewTitles[kind]}
              imageUrl={previewMedia[kind]}
              onClose={() => closePreview(kind)}
            />
          ))}
        </div>
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="tier-upgrade-details-title"
        className="relative z-10 flex h-full w-full max-w-[480px] flex-col bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.12)]"
      >
        <div className="relative flex shrink-0 items-center justify-center px-5 pb-3 pt-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#4B5563] transition-colors hover:bg-[#F3F4F6]"
          >
            <CloseIcon />
          </button>
          <h2
            id="tier-upgrade-details-title"
            className="text-base font-semibold text-[#1E2939]"
          >
            Tier upgrade review Information
          </h2>
        </div>

        <div className="mb-4 flex items-center px-5">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <div className="mx-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#711E00]" />
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4">
          {hasVideo && videoUrl ? (
            <WorkshopVideoPlayer src={videoUrl} label={applicantName} />
          ) : (
            <div
              className="mb-4 flex min-h-[240px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] aspect-video"
              role="img"
              aria-label="No video available"
            >
              <NoVideoIcon />
              <p className="text-sm font-medium text-[#6B7280]">No video</p>
              <p className="text-xs text-[#9CA3AF]">Verification video not submitted</p>
            </div>
          )}

          {isTier2to3 ? (
            <Tier2to3Details
              guarantors={application.guarantor}
              workers={application.workers}
              workersCapacity={application.workersCapacity}
              cacNumber={application.cacNumber || application.cac}
              onViewCac={() => openPreview("cac")}
              onViewWorkerNationalId={(index) =>
                openPreview(index === 0 ? "worker1NationalId" : "worker2NationalId")
              }
              onViewWorkerSelfie={(index) =>
                openPreview(index === 0 ? "worker1Selfie" : "worker2Selfie")
              }
            />
          ) : (
            <Tier1to2Details
              guarantors={application.guarantor}
              documentLabel={documentTitle}
              onViewNationalId={() => openPreview("nationalId")}
              onViewSelfie={() => openPreview("selfie")}
              hasDocument={Boolean(nationalIdUrl)}
              hasSelfie={Boolean(selfieUrl)}
              testScore={application.testScore}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-[#E5E7EB] px-5 py-4">
          {reviewStatus === "approved" ? (
            <button
              type="button"
              onClick={handleDowngrade}
              className="h-12 w-full rounded-xl bg-[#F3F4F6] text-sm font-semibold text-[#1E2939] transition-colors hover:bg-[#E5E7EB]"
            >
              Downgrade
            </button>
          ) : reviewStatus === "rejected" ? (
            <button
              type="button"
              onClick={handleReview}
              className="h-12 w-full rounded-xl bg-[#F3F4F6] text-sm font-semibold text-[#1E2939] transition-colors hover:bg-[#E5E7EB]"
            >
              Review
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleStartDenial}
                disabled={submitting}
                className="h-12 rounded-xl bg-[#F3F4F6] text-sm font-semibold text-[#1E2939] transition-colors hover:bg-[#E5E7EB] disabled:opacity-50"
              >
                Denial Request
              </button>
              <button
                type="button"
                onClick={() => void handleAccept()}
                disabled={submitting}
                className="h-12 rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800] disabled:opacity-50"
              >
                {submitting && reviewStatus === "pending" ? "Approving…" : "Accept Request"}
              </button>
            </div>
          )}
        </div>
      </aside>

      {showDenialReasonModal && (
        <DenialRequestModal
          reason={denialReason}
          onReasonChange={setDenialReason}
          onClose={handleCancelDenial}
          onConfirm={() => void handleConfirmDenial()}
          submitting={submitting}
        />
      )}
      {showAcceptedModal && (
        <ResultModal title="Upgrade Accepted" onClose={() => setShowAcceptedModal(false)} />
      )}
      {showDeniedModal && (
        <ResultModal title="Upgrade Denied" onClose={() => setShowDeniedModal(false)} />
      )}
    </div>
  );
}
