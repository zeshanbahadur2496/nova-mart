"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Reset failed");
      setDone(true);
      toast.success("Password reset successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    }
  }

  return (
    <div className="amazon-card">
      <h1 className="text-2xl font-bold">Reset password</h1>
      {done ? (
        <p className="mt-4 text-sm">
          Your password has been updated.{" "}
          <Link href="/login" className="text-amazon-teal underline">
            Sign in
          </Link>
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            placeholder="New password"
            className="h-11 w-full rounded border border-slate-200 px-3 dark:border-white/10 dark:bg-slate-950"
          />
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Suspense
        fallback={
          <div className="amazon-card">
            <h1 className="text-2xl font-bold">Reset password</h1>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading...</p>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
