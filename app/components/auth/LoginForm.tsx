"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { WhipcareLogo } from "./WhipcareLogo";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { IOSSpinner } from "./IOSSpinner";
import { isAuthenticated, login, persistSession } from "@/app/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      persistSession(res.data);
      toast.success(res.message || "Login successful");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col px-8 py-10 sm:px-12 lg:px-16 lg:py-12">
      <WhipcareLogo />

      <div className="mt-6 flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Login to your Admin Account
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Fill in your details to access your admin account.
          </p>

          <div className="relative my-8 flex items-center">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="mx-3 h-2 w-2 rounded-full bg-slate-400" />
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed ${isLoading
                ? "bg-primary"
                : "bg-primary disabled:bg-slate-100 disabled:text-slate-400"
                }`}
            >
              {isLoading ? <IOSSpinner /> : "Next"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
