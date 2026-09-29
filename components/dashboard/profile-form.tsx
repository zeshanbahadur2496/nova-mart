"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass =
  "store-input h-11 w-full px-3 text-[color:var(--store-text)] placeholder:text-[color:var(--store-text-muted)]";

export function ProfileForm({
  initialName,
  initialPhone,
  email,
  role
}: {
  initialName: string;
  initialPhone: string;
  email: string;
  role: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to save");
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[color:var(--store-text)]">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[color:var(--store-text)]">Email</span>
        <input
          value={email}
          disabled
          className={cn(fieldClass, "cursor-not-allowed opacity-60")}
        />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[color:var(--store-text)]">Phone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className={fieldClass}
        />
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-semibold text-[color:var(--store-text)]">Role</span>
        <input
          value={role}
          disabled
          className={cn(fieldClass, "cursor-not-allowed opacity-60")}
        />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
