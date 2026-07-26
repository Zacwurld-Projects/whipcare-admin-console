import {
  getAuthHeaders,
  handleUnauthorized,
  isSessionValid,
} from "@/app/lib/auth";
import { API_BASE } from "@/app/lib/config";
import { normalizeEmail, validateInviteInput } from "@/app/lib/validation";

type ApiEnvelope = {
  status?: boolean;
  message?: string;
};

async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  if (auth && !isSessionValid()) {
    handleUnauthorized();
    throw new Error("Session expired. Please log in again.");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? getAuthHeaders() : {}),
      ...headers,
    },
  });

  const data = (await res.json()) as T & ApiEnvelope;

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok || data.status === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export type AdminPermission = {
  name: string;
  slug: string;
};

export type AdminRole = {
  id: string;
  name: string;
  permissions: AdminPermission[];
};

export type Admin = {
  id: string;
  email: string;
  fullname: string;
  role: AdminRole;
};

export type AdminsResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Admin[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function fetchAdmins(): Promise<AdminsResponse> {
  return apiRequest<AdminsResponse>("/api/v1/admin", { method: "GET" });
}

export type InviteAdminPayload = {
  email: string;
  fullname: string;
  roleId: string;
};

export type InviteAdminResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Admin;
};

export async function inviteAdmin(
  payload: InviteAdminPayload,
): Promise<InviteAdminResponse> {
  const validation = validateInviteInput(
    payload.email,
    payload.fullname,
    payload.roleId,
  );

  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || "Invalid invite details");
  }

  return apiRequest<InviteAdminResponse>("/api/v1/auth/invite", {
    method: "POST",
    body: JSON.stringify({
      email: normalizeEmail(payload.email),
      fullname: payload.fullname.trim(),
      roleId: payload.roleId.trim(),
    }),
  });
}

export type User = {
  id: string;
  email: string;
  image: string | null;
  phone: string;
  emailVerified: boolean;
  firstname: string;
  lastname: string;
  type: string;
  nationality: string;
  language: string;
  firebaseClientId: string | null;
  kycStatus: string;
  biometrics: boolean;
  lastLogin: string | null;
  businessName: string | null;
  available: boolean;
  about: string | null;
  notificationType: string[];
  referredBy: string | null;
  tier: number | null;
};

export type UsersResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FetchUsersParams = {
  page?: number;
  limit?: number;
  type?: string;
};

export function getUserDisplayName(user: User): string {
  const fullName = `${user.firstname} ${user.lastname}`.trim();
  if (fullName) return fullName;
  if (user.businessName) return user.businessName;
  return user.email;
}

export function formatUserDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function fetchUsers(params: FetchUsersParams = {}): Promise<UsersResponse> {
  const { page = 1, limit = 10, type = "Service Provider" } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
  });

  return apiRequest<UsersResponse>(`/api/v1/user?${query}`, { method: "GET" });
}

export type TierUpgradeStatus = "pending" | "approved" | "rejected";

export type TierUpgradeGuarantor = {
  name: string;
  phoneNumber: string;
};

export type TierUpgradeWorker = {
  name?: string;
  phoneNumber?: string;
  documentType?: string | null;
  nationalId?: string | null;
  selfie?: string | null;
  skillTestScore?: number | string | null;
  document?: string | null;
};

export type TierUpgradeUser = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  type: string;
  tier: number | null;
};

export type TierUpgradeApplication = {
  id: string;
  user: TierUpgradeUser;
  fromTier: number;
  toTier: number;
  status: TierUpgradeStatus | string;
  providerSelfie?: string | null;
  workShopVideo?: string | null;
  documentType?: string | null;
  document?: string | null;
  guarantor: TierUpgradeGuarantor[];
  workers: TierUpgradeWorker[];
  workersCapacity?: number | null;
  cac?: string | null;
  cacUrl?: string | null;
  cacNumber?: string | null;
  test?: string | null;
  testScore?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type TierUpgradesResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: TierUpgradeApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FetchTierUpgradesParams = {
  status?: TierUpgradeStatus;
  page?: number;
  limit?: number;
};

export function getTierUpgradeDisplayName(app: TierUpgradeApplication): string {
  const fullName = `${app.user.firstname} ${app.user.lastname}`.trim();
  if (fullName) return fullName;
  return app.user.email;
}

export function asTierLevel(value: number): 1 | 2 | 3 | null {
  return value === 1 || value === 2 || value === 3 ? value : null;
}

export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  if (/example\.com/i.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("www.")) return `https://${trimmed}`;
  return trimmed;
}

export async function fetchTierUpgrades(
  params: FetchTierUpgradesParams = {},
): Promise<TierUpgradesResponse> {
  const { status = "pending", page = 1, limit = 10 } = params;
  const query = new URLSearchParams({
    status,
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<TierUpgradesResponse>(`/api/v1/tier-upgrade?${query}`, {
    method: "GET",
  });
}

export type ReviewTierUpgradePayload = {
  status: "approved" | "rejected";
  reason?: string;
};

export type ReviewTierUpgradeResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    user: string | TierUpgradeUser;
    fromTier: number;
    toTier: number;
    status: TierUpgradeStatus | string;
    providerSelfie?: string | null;
    workShopVideo?: string | null;
    documentType?: string | null;
    document?: string | null;
    guarantor: TierUpgradeGuarantor[];
    workers: TierUpgradeWorker[];
    createdAt: string;
    updatedAt: string;
  };
};

export async function reviewTierUpgrade(
  id: string,
  payload: ReviewTierUpgradePayload,
): Promise<ReviewTierUpgradeResponse> {
  return apiRequest<ReviewTierUpgradeResponse>(`/api/v1/tier-upgrade/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export type BlogStatus = "draft" | "published";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  pageTitle: string;
  pageDescription: string;
  categories: string[];
  status: BlogStatus | string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  coverImage?: string | null;
};

export type CreateBlogPayload = {
  title: string;
  content: string;
  excerpt: string;
  pageTitle: string;
  pageDescription: string;
  categories: string[];
  status?: BlogStatus;
  slug?: string;
  coverImage?: File | null;
};

export type UpdateBlogPayload = CreateBlogPayload & {
  regenerateSlug?: boolean;
};

export type CreateBlogResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Blog;
};

export type UpdateBlogResponse = CreateBlogResponse;

function buildBlogFormData(
  payload: CreateBlogPayload,
  options?: { regenerateSlug?: boolean },
): FormData {
  const formData = new FormData();
  formData.append("title", payload.title.trim());
  formData.append("content", payload.content);
  formData.append("excerpt", payload.excerpt.trim());
  formData.append("pageTitle", payload.pageTitle.trim() || payload.title.trim());
  formData.append("pageDescription", payload.pageDescription.trim());
  formData.append("status", payload.status ?? "draft");

  const categories = payload.categories.map(toBlogCategorySlug).filter(Boolean);

  if (categories.length === 0) {
    throw new Error("Add at least one category");
  }

  formData.append("categories", categories.join(","));

  if (payload.slug?.trim()) {
    formData.append("slug", payload.slug.trim().replace(/^\//, ""));
  }

  if (options?.regenerateSlug !== undefined) {
    formData.append("regenerateSlug", String(options.regenerateSlug));
  }

  if (payload.coverImage) {
    formData.append("coverImage", payload.coverImage);
  }

  return formData;
}

export function toBlogCategorySlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> {
  if (!isSessionValid()) {
    handleUnauthorized();
    throw new Error("Session expired. Please log in again.");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const data = (await res.json()) as T & ApiEnvelope;

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok || data.status === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
  status: BlogStatus | string;
  createdAt: string;
  publishedAt?: string | null;
  coverImage?: string | null;
};

export type BlogsResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: BlogListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FetchBlogsParams = {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  status?: BlogStatus;
  category?: string;
  search?: string;
};

export function formatBlogCategoryLabel(slug: string): string {
  return slug
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function fetchBlogs(
  params: FetchBlogsParams = {},
): Promise<BlogsResponse> {
  const { page = 1, limit = 20, sort = "newest", status, category, search } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (status) query.set("status", status);
  if (category) query.set("category", category);
  if (search?.trim()) query.set("search", search.trim());

  return apiRequest<BlogsResponse>(`/api/v1/admin/blogs?${query}`, {
    method: "GET",
  });
}

export type BlogResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Blog;
};

export async function fetchBlog(id: string): Promise<BlogResponse> {
  return apiRequest<BlogResponse>(`/api/v1/admin/blogs/${id}`, {
    method: "GET",
  });
}

export async function createBlog(
  payload: CreateBlogPayload,
): Promise<CreateBlogResponse> {
  return apiFormRequest<CreateBlogResponse>(
    "/api/v1/admin/blogs",
    buildBlogFormData({ ...payload, status: payload.status ?? "draft" }),
  );
}

export async function updateBlog(
  id: string,
  payload: UpdateBlogPayload,
): Promise<UpdateBlogResponse> {
  const { regenerateSlug = false, ...rest } = payload;
  return apiFormRequest<UpdateBlogResponse>(
    `/api/v1/admin/blogs/${id}`,
    buildBlogFormData({ ...rest, status: rest.status ?? "draft" }, { regenerateSlug }),
    "PUT",
  );
}

export type PublishBlogResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Blog;
};

export async function publishBlog(id: string): Promise<PublishBlogResponse> {
  return apiRequest<PublishBlogResponse>(`/api/v1/admin/blogs/${id}/publish`, {
    method: "PATCH",
  });
}

export type UnpublishBlogResponse = PublishBlogResponse;

export async function unpublishBlog(id: string): Promise<UnpublishBlogResponse> {
  return apiRequest<UnpublishBlogResponse>(`/api/v1/admin/blogs/${id}/unpublish`, {
    method: "PATCH",
  });
}

export type DeleteBlogResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
};

export async function deleteBlog(id: string): Promise<DeleteBlogResponse> {
  return apiRequest<DeleteBlogResponse>(`/api/v1/admin/blogs/${id}`, {
    method: "DELETE",
  });
}
