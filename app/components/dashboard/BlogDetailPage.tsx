"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteBlog,
  fetchBlog,
  formatBlogCategoryLabel,
  publishBlog,
  unpublishBlog,
  type Blog,
} from "@/app/lib/api";

const FALLBACK_COVER = "/images/blog-empty.jpg";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

function slugifyHeading(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `section-${index + 1}`;
}

function prepareContent(html: string): { html: string; toc: TocItem[] } {
  if (typeof window === "undefined") {
    return { html, toc: [] };
  }

  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));
  const usedIds = new Set<string>();
  const toc: TocItem[] = [];

  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim() || `Section ${index + 1}`;
    let id = slugifyHeading(text, index);
    if (usedIds.has(id)) id = `${id}-${index + 1}`;
    usedIds.add(id);
    heading.id = id;
    toc.push({
      id,
      text,
      level: Number(heading.tagName.replace("H", "")) || 2,
    });
  });

  return { html: doc.body.innerHTML, toc };
}

type BlogDetailPageProps = {
  blogId: string;
};

export function BlogDetailPage({ blogId }: BlogDetailPageProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetchBlog(blogId);
        if (cancelled) return;
        setBlog(res.data);
      } catch (err) {
        if (cancelled) return;
        setBlog(null);
        toast.error(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [blogId]);

  const { html, toc } = useMemo(
    () => prepareContent(blog?.content ?? ""),
    [blog?.content],
  );

  useEffect(() => {
    if (toc.length > 0) setActiveId(toc[0].id);
  }, [toc]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observers: IntersectionObserver[] = [];

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveId(item.id);
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [toc, html]);

  async function handlePublish() {
    setActing(true);
    try {
      const res = await publishBlog(blogId);
      setBlog(res.data);
      toast.success(res.message || "Blog published successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish blog");
    } finally {
      setActing(false);
    }
  }

  async function handleUnpublish() {
    setActing(true);
    try {
      const res = await unpublishBlog(blogId);
      setBlog(res.data);
      toast.success(res.message || "Blog unpublished successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unpublish blog");
    } finally {
      setActing(false);
    }
  }

  async function handleDelete() {
    if (!blog) return;
    const ok = window.confirm(`Delete “${blog.title}”? This cannot be undone.`);
    if (!ok) return;

    setActing(true);
    try {
      const res = await deleteBlog(blogId);
      toast.success(res.message || "Blog deleted successfully");
      router.push("/dashboard/ads");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
      setActing(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-sm text-slate-400">Loading blog…</p>;
  }

  if (!blog) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="text-sm text-slate-500">Blog not found.</p>
        <Link href="/dashboard/ads" className="text-sm font-semibold text-primary underline">
          Back to Ads and Blog
        </Link>
      </div>
    );
  }

  const categoryLabel = blog.categories.map(formatBlogCategoryLabel).join(" · ");
  const coverSrc = blog.coverImage || FALLBACK_COVER;
  const isPublished = blog.status === "published";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/ads"
          className="text-sm font-medium text-[#667085] hover:text-[#711E00]"
        >
          ← Back to Ads and Blog
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              isPublished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-[#F3F4F6] text-[#667085]"
            }`}
          >
            {blog.status}
          </span>
          {isPublished ? (
            <button
              type="button"
              disabled={acting}
              onClick={() => void handleUnpublish()}
              className="text-sm font-medium text-[#667085] hover:text-[#344054] disabled:opacity-50"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={acting}
              onClick={() => void handlePublish()}
              className="text-sm font-medium text-primary hover:text-[#711E00] disabled:opacity-50"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            disabled={acting}
            onClick={() => void handleDelete()}
            className="text-sm font-medium text-[#F04438] hover:text-[#D92D20] disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <header className="mx-auto max-w-3xl space-y-3 text-center">
        {categoryLabel && (
          <p className="text-sm font-medium text-[#711E00]">{categoryLabel}</p>
        )}
        <h1 className="text-[32px] font-semibold leading-tight text-[#101828] sm:text-[40px]">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="text-base leading-7 text-[#667085]">{blog.excerpt}</p>
        )}
      </header>

      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl bg-[#F3F4F6]">
        <Image
          src={coverSrc}
          alt={blog.title}
          fill
          priority
          unoptimized={Boolean(blog.coverImage)}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
        />
      </div>

      <div className={`grid gap-8 ${toc.length > 0 ? "lg:grid-cols-[240px_minmax(0,1fr)]" : ""}`}>
        {toc.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="space-y-1 border-l border-[#E5E7EB]">
              {toc.map((item) => {
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    className={`relative block py-2 pl-4 text-sm leading-5 transition-colors ${
                      active
                        ? "font-medium text-[#101828]"
                        : "text-[#667085] hover:text-[#344054]"
                    }`}
                    style={{ paddingLeft: `${12 + (item.level - 1) * 8}px` }}
                  >
                    {active && (
                      <span className="absolute left-0 top-1.5 h-[calc(100%-12px)] w-[3px] rounded-full bg-[#711E00]" />
                    )}
                    {item.text}
                  </a>
                );
              })}
            </nav>
          </aside>
        )}

        <article
          className="blog-detail-content max-w-none text-[#344054]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
