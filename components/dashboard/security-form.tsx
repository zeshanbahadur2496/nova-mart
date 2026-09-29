"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const fieldClass =
  "store-input h-11 w-full px-3 text-[color:var(--store-text)] placeholder:text-[color:var(--store-text-muted)]";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to update password");
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid max-w-md gap-4">
      <label>
        <span className="dashboard-label">Current password</span>
        <input
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={fieldClass}
          required
        />
      </label>
      <label>
        <span className="dashboard-label">New password</span>
        <input
          type="password"
          placeholder="At least 6 characters"
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={fieldClass}
          required
        />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
