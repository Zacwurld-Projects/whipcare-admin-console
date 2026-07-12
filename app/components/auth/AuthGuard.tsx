"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clearSession, isSessionValid } from "@/app/lib/auth";

const SESSION_CHECK_INTERVAL_MS = 60_000;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSessionValid()) {
      clearSession();
      toast.error("Session expired. Please log in again.");
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;

    const interval = window.setInterval(() => {
      if (!isSessionValid()) {
        clearSession();
        toast.error("Session expired. Please log in again.");
        router.replace("/login");
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [ready, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <p className="text-sm text-slate-400">Checking session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
