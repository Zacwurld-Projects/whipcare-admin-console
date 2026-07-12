"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { WhipcareLogo } from "./WhipcareLogo";
import { AuthInput } from "./AuthInput";
import { PasswordInput } from "./PasswordInput";
import { IOSSpinner } from "./IOSSpinner";
import { isAuthenticated, login, persistSession } from "@/app/lib/auth";
import { validateLoginInput } from "@/app/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function validateFields(nextEmail = email, nextPassword = password) {
    const result = validateLoginInput(nextEmail, nextPassword);
    setErrors(result.errors);
    return result.valid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateFields()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
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

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) validateFields(e.target.value, password);
                }}
                onBlur={() => validateFields()}
                autoComplete="email"
                required
              />
              {errors.email ? (
                <p className="mt-1.5 text-sm font-medium text-red-600">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) validateFields(email, e.target.value);
                }}
                onBlur={() => validateFields()}
                autoComplete="current-password"
                required
              />
              {errors.password ? (
                <p className="mt-1.5 text-sm font-medium text-red-600">{errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading}
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
