import { API_BASE } from "@/app/lib/api";

const ACCESS_TOKEN_KEY = "whipcare_access_token";
const REFRESH_TOKEN_KEY = "whipcare_refresh_token";
const ADMIN_KEY = "whipcare_admin";

export type AdminUser = {
  id: string;
  email: string;
  fullname?: string;
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
