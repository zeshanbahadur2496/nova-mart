"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email })
    })
      .then(async (res) => {
        const data = await res.json();
        setMessage(res.ok ? "Email verified successfully." : data.message ?? "Verification failed.");
      })
      .catch(() => setMessage("Verification failed."));
  }, [token, email]);

  return (
    <div className="amazon-card">
      <h1 className="text-2xl font-bold">Email verification</h1>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      <Link href="/dashboard/profile" className="mt-6 inline-block text-amazon-teal underline">
        Back to profile
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <Suspense
        fallback={
          <div className="amazon-card">
            <h1 className="text-2xl font-bold">Email verification</h1>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
