import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Create Account"
};

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-260px)] bg-[color:var(--store-bg)] px-5 py-12">
      <Suspense fallback={null}>
        <AuthCard mode="signup" />
      </Suspense>
    </div>
  );
}
