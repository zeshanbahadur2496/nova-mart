"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SecurityForm } from "@/components/dashboard/security-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SecurityPage() {
  async function sendVerification() {
    const res = await fetch("/api/auth/verify-email", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message, { description: data.verifyUrl });
    } else {
      toast.error(data.message ?? "Failed to send verification");
    }
  }

  return (
    <DashboardShell title="Login & Security">
      <div className="space-y-4">
        <div className="store-panel p-6">
          <h2 className="dashboard-heading text-lg">Change password</h2>
          <SecurityForm />
        </div>
        <div className="store-panel p-6">
          <h2 className="dashboard-heading text-lg">Email verification</h2>
          <p className="dashboard-muted mt-2">Verify your email address for account security.</p>
          <Button variant="outline" className="mt-4" onClick={sendVerification}>
            Send verification email
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
