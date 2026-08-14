"use client";

import { useEffect, useRef, useState } from "react";
import { BlogContentEditor } from "./BlogContentEditor";
import { SearchIcon } from "./icons";

export type BlogFormValues = {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  pageTitle: string;
  pageDescription: string;
  categories: string[];
  authorName: string;
  authorLink: string;
  coverImageName?: string;
  coverImageSize?: string;
  coverImageDate?: string;
  coverImageUrl?: string;
  coverFile?: File | null;
};

type BlogFormDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: BlogFormValues | null;
  onClose: () => void;
  onSubmit?: (
    values: BlogFormValues,
    action: "draft" | "publish",
  ) => Promise<void> | void;
  submitting?: boolean;
};

const CATEGORY_OPTIONS = [
  "Car Tips",
  "General Vehicle Maintenance",
  "Motorcycle Tips",
] as const;

const emptyValues: BlogFormValues = {
  title: "",
  content: "",
  excerpt: "",
  slug: "",
  pageTitle: "",
  pageDescription: "",
  categories: [],
  authorName: "",
  authorLink: "",
};

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

function CloudUploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M27.5 27.5c3.314 0 6-2.462 6-5.5s-2.686-5.5-6-5.5c-.28 0-.556.02-.826.057C25.9 13.12 22.75 10.5 19 10.5c-4.418 0-8 3.358-8 7.5 0 .172.006.342.017.51C8.32 18.78 6.5 20.87 6.5 23.5c0 2.761 2.239 5 5 5H27.5Z"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 24.5v-8m0 0l-3 3m3-3l3 3"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#12B76A" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 5h11M7 5V3.5h4V5M6.5 5v9.5h5V5"
        stroke="#F04438"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 7.5v5M10 7.5v5" stroke="#F04438" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatFileDate(date = new Date()) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function BlogFormDrawer({
  open,
  mode,
  initialValues = null,
  onClose,
  onSubmit,
  submitting = false,
}: BlogFormDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toolbarSlotEl, setToolbarSlotEl] = useState<HTMLDivElement | null>(null);
  const [values, setValues] = useState<BlogFormValues>(emptyValues);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<"draft" | "publish" | null>(null);

  useEffect(() => {
    if (!open) return;

    const merged = initialValues
      ? { ...emptyValues, ...initialValues }
      : {
          ...emptyValues,
          ...(mode === "create"
            ? {}
            : {
                title: "Boring Newsletter",
                categories: ["Car Tips"],
                coverImageName: "Image",
                coverImageDate: "11 Sep, 2023 · 12:24pm",
                coverImageSize: "1.3MB",
              }),
        };

    const next: BlogFormValues = {
      ...merged,
      title: merged.title ?? "",
      content: merged.content ?? "",
      excerpt: merged.excerpt ?? "",
      slug: merged.slug ?? "",
      pageTitle: merged.pageTitle ?? "",
      pageDescription: merged.pageDescription ?? "",
      categories: merged.categories ?? [],
      authorName: merged.authorName ?? "",
      authorLink: merged.authorLink ?? "",
    };

    setValues(next);
    setCategoryQuery("");
    setCoverPreview(next.coverImageUrl ?? null);
    setEditorKey((k) => k + 1);
  }, [open, initialValues, mode]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const query = categoryQuery.trim();
  const filteredCategories = CATEGORY_OPTIONS.filter(
    (category) =>
      category.toLowerCase().includes(query.toLowerCase()) &&
      !values.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
  );
  const canAddCustom =
    query.length > 0 &&
    !values.categories.some((c) => c.toLowerCase() === query.toLowerCase()) &&
    !CATEGORY_OPTIONS.some((c) => c.toLowerCase() === query.toLowerCase());
  const showSuggestions = query.length > 0 && (filteredCategories.length > 0 || canAddCustom);

  function updateField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setValues((prev) => ({
      ...prev,
      coverImageName: file.name,
      coverImageSize: formatFileSize(file.size),
      coverImageDate: formatFileDate(),
      coverImageUrl: url,
      coverFile: file,
    }));
  }

  function clearCover() {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setValues((prev) => ({
      ...prev,
      coverImageName: undefined,
      coverImageSize: undefined,
      coverImageDate: undefined,
      coverImageUrl: undefined,
      coverFile: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addCategory(category: string) {
    const next = category.trim();
    if (!next) return;
    setValues((prev) => {
      if (prev.categories.some((c) => c.toLowerCase() === next.toLowerCase())) {
        return prev;
      }
      return { ...prev, categories: [...prev.categories, next] };
    });
    setCategoryQuery("");
  }

  function removeCategory(category: string) {
    setValues((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  }

  async function handleSubmit(action: "draft" | "publish") {
    if (submitting) return;
    if (!values.title.trim()) return;
    if (!values.content.trim()) return;
    if (values.categories.length === 0) return;
    setPendingAction(action);
    try {
      await onSubmit?.(values, action);
    } finally {
      setPendingAction(null);
    }
  }

  const title = mode === "edit" ? "Edit Blog" : "Create Blog";
  const hasCover = Boolean(values.coverImageName);
  const canSubmit =
    !submitting &&
    Boolean(values.title.trim()) &&
    Boolean(values.content.trim()) &&
    values.categories.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-form-title"
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
          <h2 id="blog-form-title" className="text-base font-semibold text-[#1E2939]">
            {title}
          </h2>
        </div>

        <div className="mb-4 flex items-center px-5">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <div className="mx-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#711E00]" />
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
          <section className="space-y-4 rounded-xl border border-[#E5E7EB] p-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#1E2939]">Upload Cover Image</p>
              <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-6 text-center">
                <div className="mx-auto mb-3 flex justify-center">
                  <CloudUploadIcon />
                </div>
                <p className="text-sm text-[#344054]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-semibold text-primary hover:underline"
                  >
                    Click to upload
                  </button>{" "}
                  <span className="text-[#667085]">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                </p>
                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <span className="text-xs font-medium text-[#98A2B3]">OR</span>
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-[#711E00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5A1800]"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.gif,image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {hasCover && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5">
                  <CheckCircleIcon />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#1E2939]">
                      {values.coverImageName}
                    </p>
                    <p className="text-xs text-[#667085]">
                      {values.coverImageDate}
                      {values.coverImageSize ? ` · ${values.coverImageSize}` : ""}
                    </p>
                  </div>
                  {coverPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverPreview}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={clearCover}
                    aria-label="Remove cover image"
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-50"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="blog-title" className="mb-2 block text-sm font-semibold text-[#1E2939]">
                Blog Title
              </label>
              <input
                id="blog-title"
                value={values.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter blog title"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
            </div>

            <div>
              <label
                htmlFor="blog-author-name"
                className="mb-2 block text-sm font-semibold text-[#1E2939]"
              >
                Author Name
              </label>
              <input
                id="blog-author-name"
                value={values.authorName ?? ""}
                onChange={(e) => updateField("authorName", e.target.value)}
                placeholder="e.g. Ezele Emmanuel"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                Name shown on the blog post
              </p>
            </div>

            <div>
              <label
                htmlFor="blog-author-link"
                className="mb-2 block text-sm font-semibold text-[#1E2939]"
              >
                Author Intro Link
              </label>
              <input
                id="blog-author-link"
                type="url"
                value={values.authorLink ?? ""}
                onChange={(e) => updateField("authorLink", e.target.value)}
                placeholder="https://example.com/authors/ezele"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                Link to a brief intro about the author
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1E2939]">Blog Content</label>
              <BlogContentEditor
                key={editorKey}
                value={values.content}
                onChange={(html) => updateField("content", html)}
                toolbarContainer={toolbarSlotEl}
              />
            </div>

            <div>
              <label htmlFor="blog-excerpt" className="mb-2 block text-sm font-semibold text-[#1E2939]">
                Excerpt
              </label>
              <input
                id="blog-excerpt"
                value={values.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Enter Excerpt here"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                A summary of your content that can be used in your Theme
              </p>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-[#E5E7EB] p-4">
            <div>
              <label htmlFor="blog-slug" className="mb-2 block text-sm font-semibold text-[#1E2939]">
                URI Slug
              </label>
              <input
                id="blog-slug"
                value={values.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="/url slug"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                The last part of your URL. If left blank, the title of your blog will be used
              </p>
            </div>

            <div>
              <label
                htmlFor="blog-page-title"
                className="mb-2 block text-sm font-semibold text-[#1E2939]"
              >
                Page Title
              </label>
              <input
                id="blog-page-title"
                value={values.pageTitle}
                onChange={(e) => updateField("pageTitle", e.target.value)}
                placeholder="Enter page title here"
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                The last part of your URL. If left blank, the title of your blog will be used
              </p>
            </div>

            <div>
              <label
                htmlFor="blog-page-description"
                className="mb-2 block text-sm font-semibold text-[#1E2939]"
              >
                Page description
              </label>
              <textarea
                id="blog-page-description"
                value={values.pageDescription}
                onChange={(e) => updateField("pageDescription", e.target.value)}
                placeholder="Enter your page description"
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-[#E5E7EB] p-4">
            <p className="text-sm font-semibold text-[#1E2939]">Categories</p>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2.5 text-[#98A2B3]">
                <SearchIcon />
                <span className="h-5 w-px bg-[#E5E7EB]" />
              </div>
              <input
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (filteredCategories[0]) {
                    addCategory(filteredCategories[0]);
                    return;
                  }
                  if (canAddCustom) addCategory(query);
                }}
                placeholder="Search..."
                className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-[52px] pr-3 text-sm text-[#1E2939] outline-none placeholder:text-[#9CA3AF] focus:border-[#711E00]"
              />

              {showSuggestions && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => addCategory(category)}
                      className="block w-full px-3 py-2.5 text-left text-sm text-[#1E2939] hover:bg-[#FDF3F0] hover:text-[#711E00]"
                    >
                      {category}
                    </button>
                  ))}
                  {canAddCustom && (
                    <button
                      type="button"
                      onClick={() => addCategory(query)}
                      className="block w-full px-3 py-2.5 text-left text-sm text-[#1E2939] hover:bg-[#FDF3F0] hover:text-[#711E00]"
                    >
                      Add “{query}”
                    </button>
                  )}
                </div>
              )}
            </div>

            {values.categories.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {values.categories.map((category) => (
                  <span
                    key={category}
                    className="relative inline-flex items-center rounded-md border border-[#711E00] bg-white px-3 py-1.5 pr-4 text-sm font-medium text-[#711E00]"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      aria-label={`Remove ${category}`}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-white hover:bg-black"
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path
                          d="M2 2l4 4M6 2L2 6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E5E7EB]">
          <div ref={setToolbarSlotEl} />
          <div className="space-y-3 px-5 py-4">
            <button
              type="button"
              onClick={() => void handleSubmit("publish")}
              disabled={!canSubmit}
              className="h-12 w-full rounded-xl bg-[#711E00] text-sm font-semibold text-white transition-colors hover:bg-[#5A1800] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && pendingAction === "publish" ? "Publishing…" : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit("draft")}
              disabled={!canSubmit}
              className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#344054] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && pendingAction === "draft" ? "Saving…" : "Save as Draft"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
