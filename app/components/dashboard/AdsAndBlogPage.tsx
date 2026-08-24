"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createBlog,
  deleteBlog,
  fetchBlog,
  fetchBlogs,
  formatBlogCategoryLabel,
  publishBlog,
  unpublishBlog,
  updateBlog,
  type BlogListItem,
} from "@/app/lib/api";
import { BlogFormDrawer, type BlogFormValues } from "./BlogFormDrawer";
import { StatCard } from "./StatCard";

const mainTabs = ["Blogs", "Ads"] as const;

const PAGE_LIMIT = 3;
const CATEGORY_SCAN_LIMIT = 100;
const TOTAL_ADS = 18;
const FALLBACK_COVER = "/images/blog-empty.jpg";

type AdItem = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
};

const adItems: AdItem[] = Array.from({ length: TOTAL_ADS }, (_, i) => ({
  id: `ad-${i + 1}`,
  category: i % 2 === 0 ? "Promo" : "Banner",
  title: "Whipcare Service Promo",
  excerpt: "Promote seasonal offers and reach more vehicle owners across the platform...",
  image: "/images/blog-card-preview.jpg",
}));

function buildPageNumbers(current: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(totalPages - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 5L7.5 10L12.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="-mx-4 mb-3 flex items-center px-4 sm:-mx-5 sm:mb-5 sm:px-5">
      <div className="h-px flex-1 bg-[#E5E7EB]" />
      <div className="mx-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#711E00] sm:mx-2.5" />
      <div className="h-px flex-1 bg-[#E5E7EB]" />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  startEntry,
  endEntry,
  total,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
      <p className="text-xs text-slate-500 sm:text-sm">
        Showing data {startEntry} to {endEntry} of {total} entries
      </p>

      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          aria-label="Previous page"
        >
          <BackIcon />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400 sm:px-2 sm:text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg px-1.5 text-xs font-medium sm:h-8 sm:min-w-8 sm:px-2 sm:text-sm ${currentPage === page
                  ? "bg-[#FE915D] text-white"
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
          aria-label="Next page"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function AdsAndBlogPage() {
  const [mainTab, setMainTab] = useState<(typeof mainTabs)[number]>("Blogs");
  const [blogCategory, setBlogCategory] = useState<string>("All");
  const [blogPage, setBlogPage] = useState(1);
  const [adPage, setAdPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingBlog, setEditingBlog] = useState<BlogFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [blogTotal, setBlogTotal] = useState(0);
  const [blogTotalPages, setBlogTotalPages] = useState(1);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [categorySlugs, setCategorySlugs] = useState<string[]>([]);
  const [reloadToken, setReloadToken] = useState(0);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingBlogs(true);
      try {
        const res = await fetchBlogs({
          page: blogPage,
          limit: PAGE_LIMIT,
          sort: "newest",
          category: blogCategory === "All" ? undefined : blogCategory,
        });
        if (cancelled) return;
        setBlogs(res.data);
        setBlogTotal(res.meta.total);
        setBlogTotalPages(Math.max(1, res.meta.totalPages));
      } catch (err) {
        if (cancelled) return;
        setBlogs([]);
        setBlogTotal(0);
        setBlogTotalPages(1);
        toast.error(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        if (!cancelled) setLoadingBlogs(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [blogPage, blogCategory, reloadToken]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const res = await fetchBlogs({ limit: CATEGORY_SCAN_LIMIT, sort: "newest" });
        if (cancelled) return;
        const unique = Array.from(
          new Set(res.data.flatMap((blog) => blog.categories)),
        ).sort();
        setCategorySlugs(unique);
      } catch {
        if (!cancelled) setCategorySlugs([]);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reloadBlogs = useCallback(() => setReloadToken((token) => token + 1), []);

  function openCreateBlog() {
    setDrawerMode("create");
    setEditingBlog(null);
    setDrawerOpen(true);
  }

  async function openEditBlog(blog: BlogListItem) {
    setDrawerMode("edit");
    setLoadingEdit(true);
    setEditingBlog({
      id: blog.id,
      title: blog.title,
      content: "",
      excerpt: blog.excerpt,
      slug: blog.slug,
      pageTitle: blog.title,
      pageDescription: "",
      seoKeywords: "",
      categories: blog.categories.map(formatBlogCategoryLabel),
      authorName: blog.authorName ?? "",
      authorLink: blog.authorLink ?? "",
      coverImageUrl: blog.coverImage ?? undefined,
    });
    setDrawerOpen(true);

    try {
      const res = await fetchBlog(blog.id);
      setEditingBlog({
        id: res.data.id,
        title: res.data.title,
        content: res.data.content,
        excerpt: res.data.excerpt,
        slug: res.data.slug,
        pageTitle: res.data.pageTitle,
        pageDescription: res.data.pageDescription,
        seoKeywords: (res.data.seoKeywords ?? []).join(","),
        categories: res.data.categories.map(formatBlogCategoryLabel),
        authorName: res.data.authorName ?? "",
        authorLink: res.data.authorLink ?? "",
        coverImageUrl: res.data.coverImage ?? undefined,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load blog");
    } finally {
      setLoadingEdit(false);
    }
  }

  async function handleBlogSubmit(
    values: BlogFormValues,
    action: "draft" | "publish",
  ) {
    setSubmitting(true);
    try {
      const seoKeywords = values.seoKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      const payload = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        pageTitle: values.pageTitle || values.title,
        pageDescription: values.pageDescription,
        seoKeywords,
        categories: values.categories,
        status: "draft" as const,
        slug: values.slug.trim().replace(/^\//, "") || undefined,
        coverImage: values.coverFile ?? null,
        authorName: values.authorName?.trim() || undefined,
        authorLink: values.authorLink?.trim() || undefined,
      };

      let blogId = values.id;

      if (drawerMode === "edit") {
        if (!blogId) throw new Error("Missing blog id");
        const res = await updateBlog(blogId, {
          ...payload,
          regenerateSlug: false,
        });
        blogId = res.data.id;
        if (action === "draft") {
          toast.success(res.message || "Draft saved successfully");
        }
      } else {
        const res = await createBlog(payload);
        blogId = res.data.id;
        if (action === "draft") {
          toast.success(res.message || "Draft saved successfully");
        }
        setBlogPage(1);
      }

      if (action === "publish") {
        if (!blogId) throw new Error("Missing blog id");
        const res = await publishBlog(blogId);
        toast.success(res.message || "Blog published successfully");
        setBlogPage(1);
      }

      setDrawerOpen(false);
      setEditingBlog(null);
      reloadBlogs();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : action === "publish"
            ? "Failed to publish blog"
            : "Failed to save draft",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublishBlog(id: string) {
    setActionId(id);
    try {
      const res = await publishBlog(id);
      toast.success(res.message || "Blog published successfully");
      reloadBlogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish blog");
    } finally {
      setActionId(null);
    }
  }

  async function handleUnpublishBlog(id: string) {
    setActionId(id);
    try {
      const res = await unpublishBlog(id);
      toast.success(res.message || "Blog unpublished successfully");
      reloadBlogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unpublish blog");
    } finally {
      setActionId(null);
    }
  }

  async function handleDeleteBlog(id: string, title: string) {
    const ok = window.confirm(`Delete “${title}”? This cannot be undone.`);
    if (!ok) return;

    setActionId(id);
    try {
      const res = await deleteBlog(id);
      toast.success(res.message || "Blog deleted successfully");
      reloadBlogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setActionId(null);
    }
  }

  const categoryTabs = ["All", ...categorySlugs];
  const safeBlogPage = Math.min(blogPage, blogTotalPages);
  const blogStart = blogTotal === 0 ? 0 : (safeBlogPage - 1) * PAGE_LIMIT + 1;
  const blogEnd = Math.min(safeBlogPage * PAGE_LIMIT, blogTotal);

  const adTotalPages = Math.max(1, Math.ceil(adItems.length / PAGE_LIMIT));
  const safeAdPage = Math.min(adPage, adTotalPages);
  const pagedAds = adItems.slice((safeAdPage - 1) * PAGE_LIMIT, safeAdPage * PAGE_LIMIT);
  const adStart = adItems.length === 0 ? 0 : (safeAdPage - 1) * PAGE_LIMIT + 1;
  const adEnd = Math.min(safeAdPage * PAGE_LIMIT, adItems.length);

  return (
    <div className="space-y-4 px-3 sm:space-y-6 sm:px-0">
      <h1 className="text-xl font-normal text-[#1D2739] sm:text-[28px]">Ads and Blog</h1>

      <div className="flex gap-4 border-b border-slate-100 sm:gap-6">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMainTab(tab)}
            className={`pb-2 text-xs font-medium transition-colors sm:text-sm ${mainTab === tab
                ? "border-b-2 border-[#FE915D] text-[#711E00]"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {mainTab === "Blogs" ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <StatCard
              title="Total Blog Posted"
              value={blogTotal}
              change="24.8%"
              trend="up"
              subtitle="Blogs"
            />
            <StatCard
              title="Total Categories"
              value={categorySlugs.length}
              change="24.8%"
              trend="up"
              subtitle="Blogs"
            />
          </div>

          <div className="rounded-xl border border-slate-100 bg-white">
            <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:pt-5">
              <h3 className="text-sm font-semibold text-[#364153] sm:text-[14px]">Published Blogs</h3>
              <button
                type="button"
                onClick={openCreateBlog}
                className="text-xs font-semibold text-primary hover:text-[#711E00] sm:text-sm"
              >
                Create New Blog
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 overflow-x-auto px-4 pb-2 sm:mt-4 sm:gap-6 sm:px-5 sm:pb-0">
              {categoryTabs.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setBlogCategory(category);
                    setBlogPage(1);
                  }}
                  className={`whitespace-nowrap pb-2 text-xs font-medium transition-colors sm:text-sm ${blogCategory === category
                      ? "border-b-2 border-[#FE915D] text-[#711E00]"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {category === "All" ? "All" : formatBlogCategoryLabel(category)}
                </button>
              ))}
            </div>

            <SectionDivider />

            {loadingBlogs ? (
              <p className="px-4 pb-4 text-xs text-slate-400 sm:px-5 sm:pb-5 sm:text-sm">Loading blogs…</p>
            ) : blogs.length === 0 ? (
              <p className="px-4 pb-4 text-xs text-slate-400 sm:px-5 sm:pb-5 sm:text-sm">No blogs published yet.</p>
            ) : (
              <div className="grid gap-3 px-4 pb-4 sm:gap-4 sm:px-5 sm:pb-5 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    className="overflow-hidden rounded-lg border border-slate-100 bg-white sm:rounded-xl"
                  >
                    <Link href={`/dashboard/ads/blogs/${blog.id}`} className="block">
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={blog.coverImage || FALLBACK_COVER}
                          alt={blog.title}
                          fill
                          priority={index === 0}
                          unoptimized={Boolean(blog.coverImage)}
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1 p-3 pb-0 sm:space-y-1.5 sm:p-4 sm:pb-0">
                        <p className="text-xs font-medium text-primary">
                          {blog.categories.map(formatBlogCategoryLabel).join(", ")}
                        </p>
                        <h4 className="line-clamp-2 text-sm font-semibold text-[#1E2939] sm:text-base">{blog.title}</h4>
                        <p className="line-clamp-2 text-xs leading-4 text-[#6A7282] sm:text-sm sm:leading-5">
                          {blog.excerpt}
                        </p>
                      </div>
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-3 pb-3 pt-1.5 sm:gap-x-3 sm:px-4 sm:pb-4 sm:pt-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize sm:text-[11px] ${blog.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#F3F4F6] text-[#667085]"
                          }`}
                      >
                        {blog.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#667085] sm:text-[11px]">
                        <svg
                          aria-hidden
                          viewBox="0 0 16 16"
                          fill="none"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {(blog.viewCount ?? 0).toLocaleString()} views
                      </span>
                      <button
                        type="button"
                        onClick={() => void openEditBlog(blog)}
                        className="text-xs font-medium text-primary hover:text-[#711E00] sm:text-sm"
                      >
                        Edit →
                      </button>
                      {blog.status === "published" ? (
                        <button
                          type="button"
                          disabled={actionId === blog.id}
                          onClick={() => void handleUnpublishBlog(blog.id)}
                          className="text-xs font-medium text-[#667085] hover:text-[#344054] disabled:opacity-50 sm:text-sm"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionId === blog.id}
                          onClick={() => void handlePublishBlog(blog.id)}
                          className="text-xs font-medium text-[#667085] hover:text-[#344054] disabled:opacity-50 sm:text-sm"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionId === blog.id}
                        onClick={() => void handleDeleteBlog(blog.id, blog.title)}
                        className="text-xs font-medium text-[#F04438] hover:text-[#D92D20] disabled:opacity-50 sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Pagination
              currentPage={safeBlogPage}
              totalPages={blogTotalPages}
              startEntry={blogStart}
              endEntry={blogEnd}
              total={blogTotal}
              onPageChange={setBlogPage}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <StatCard
              title="Total Ads Posted"
              value={18}
              change="12.4%"
              trend="up"
              subtitle="Ads"
            />
            <StatCard
              title="Active Campaigns"
              value={8}
              change="8.2%"
              trend="up"
              subtitle="Ads"
            />
          </div>

          <div className="rounded-xl border border-slate-100 bg-white">
            <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:pt-5">
              <h3 className="text-sm font-semibold text-[#364153] sm:text-[14px]">Published Ads</h3>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:text-[#711E00] sm:text-sm"
              >
                Create New Ad
              </button>
            </div>

            <SectionDivider />

            <div className="grid gap-3 px-4 pb-4 sm:gap-4 sm:px-5 sm:pb-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagedAds.map((ad) => (
                <article
                  key={ad.id}
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white sm:rounded-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="space-y-1 p-3 sm:space-y-1.5 sm:p-4">
                    <p className="text-xs font-medium text-primary">{ad.category}</p>
                    <h4 className="line-clamp-2 text-sm font-semibold text-[#1E2939] sm:text-base">{ad.title}</h4>
                    <p className="line-clamp-2 text-xs leading-4 text-[#6A7282] sm:text-sm sm:leading-5">{ad.excerpt}</p>
                    <button
                      type="button"
                      className="pt-1.5 text-xs font-medium text-primary hover:text-[#711E00] sm:pt-2 sm:text-sm"
                    >
                      Edit Ad →
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <Pagination
              currentPage={safeAdPage}
              totalPages={adTotalPages}
              startEntry={adStart}
              endEntry={adEnd}
              total={adItems.length}
              onPageChange={setAdPage}
            />
          </div>
        </>
      )}

      <BlogFormDrawer
        open={drawerOpen}
        mode={drawerMode}
        initialValues={editingBlog}
        submitting={submitting || loadingEdit}
        onSubmit={handleBlogSubmit}
        onClose={() => {
          if (submitting) return;
          setDrawerOpen(false);
          setEditingBlog(null);
        }}
      />
    </div>
  );
}
