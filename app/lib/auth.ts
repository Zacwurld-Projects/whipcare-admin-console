import { API_BASE } from "@/app/lib/api";

const ACCESS_TOKEN_KEY = "whipcare_access_token";
const REFRESH_TOKEN_KEY = "whipcare_refresh_token";
const ADMIN_KEY = "whipcare_admin";

export type AdminPermission = {
  name: string;
  slug: string;
};

export type AdminRole = {
  id: string;
  name: string;
  permissions: AdminPermission[];
};

export type AdminUser = {
  id: string;
  email: string;
  fullname: string;
  role: AdminRole;
};

export type LoginResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    admin: AdminUser;
    accessToken: string;
    refreshToken: string;
  };
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await res.json()) as LoginResponse;

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export function persistSession(data: LoginResponse["data"]) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function getAdminInitials(admin: AdminUser | null): string {
  if (!admin) return "NA";
  const name = admin.fullname?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  }
  const local = admin.email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "NA";
}

export function isSuperAdmin(admin: AdminUser | null = getAdmin()): boolean {
  if (!admin?.role?.permissions?.length) return false;
  return admin.role.permissions.some(
    (permission) =>
      permission.slug === "super_admin" ||
      permission.name.toLowerCase() === "super admin",
  );
}
