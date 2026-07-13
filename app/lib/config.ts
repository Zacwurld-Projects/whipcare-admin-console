const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBase) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL. Copy .env.example to .env and set it.",
  );
}

export const API_BASE = apiBase.replace(/\/$/, "");
