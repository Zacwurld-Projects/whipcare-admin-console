import { API_BASE } from "@/app/lib/config";
import { normalizeEmail, validateLoginInput } from "@/app/lib/validation";

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

type JwtPayload = {
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

function isValidAdminUser(admin: unknown): admin is AdminUser {
  if (!admin || typeof admin !== "object") return false;
  const value = admin as Partial<AdminUser>;
  return Boolean(
    value.id &&
      value.email &&
      value.fullname &&
      value.role?.id &&
      value.role?.name &&
      Array.isArray(value.role.permissions),
  );
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const validation = validateLoginInput(email, password);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || "Invalid login credentials");
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizeEmail(email),
      password,
    }),
  });

  const data = (await res.json()) as LoginResponse;

  if (!res.ok || !data.status) {
    throw new Error(data.message || "Login failed");
  }

  if (!data.data?.accessToken || !data.data?.refreshToken || !isValidAdminUser(data.data.admin)) {
    throw new Error("Invalid login response from server");
  }

  return data;
}

export function persistSession(data: LoginResponse["data"]) {
  if (!data.accessToken || !data.refreshToken || !isValidAdminUser(data.admin)) {
    throw new Error("Cannot persist invalid session");
  }

  if (isTokenExpired(data.accessToken)) {
    throw new Error("Received an expired access token");
  }

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

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function isSessionValid(): boolean {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();
  const admin = getAdmin();

  if (!token || !refreshToken || !admin) return false;
  if (isTokenExpired(token)) return false;
  return isValidAdminUser(admin);
}

export function isAuthenticated(): boolean {
  return isSessionValid();
}

export function getAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    const admin = JSON.parse(raw) as AdminUser;
    return isValidAdminUser(admin) ? admin : null;
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

export function handleUnauthorized() {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
