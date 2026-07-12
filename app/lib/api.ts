export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://whipcare-admin-dev-954606804258.europe-west1.run.app";

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

function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("whipcare_access_token");
}

export async function fetchAdmins(): Promise<AdminsResponse> {
  const token = getBearerToken();
  const res = await fetch(`${API_BASE}/api/v1/admin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = (await res.json()) as AdminsResponse;

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to fetch admins");
  }

  return data;
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
  const token = getBearerToken();
  const res = await fetch(`${API_BASE}/api/v1/auth/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as InviteAdminResponse;

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to invite admin");
  }

  return data;
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
  const token = getBearerToken();
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
  });

  const res = await fetch(`${API_BASE}/api/v1/user?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = (await res.json()) as UsersResponse;

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
}
