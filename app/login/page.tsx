import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Sign In"
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-260px)] bg-[color:var(--store-bg)] px-5 py-12">
      <Suspense fallback={null}>
        <AuthCard mode="login" />
      </Suspense>
    </div>
  );
}
