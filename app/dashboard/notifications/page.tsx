"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { NotificationItem } from "@/types";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data: { notifications: NotificationItem[] }) => {
        setNotifications(
          data.notifications.map((n) => ({
            ...n,
            createdAt: n.createdAt
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setNotifications((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true })
    });
    setNotifications((list) => list.map((item) => ({ ...item, read: true })));
  }

  return (
    <DashboardShell title="Notifications">
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={markAllRead} className="dashboard-link">
          Mark all as read
        </button>
      </div>
      <div className="space-y-3">
        {loading && <p className="dashboard-muted">Loading notifications...</p>}
        {!loading && notifications.length === 0 && <p className="dashboard-muted">No notifications yet.</p>}
        {notifications.map((n) => (
          <article
            key={n.id}
            className={cn("store-panel p-4", !n.read && "border-l-4 border-l-[color:var(--store-accent)]")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-[color:var(--store-text-muted)]">{n.type}</p>
                <h3 className="font-semibold text-[color:var(--store-text)]">{n.title}</h3>
                <p className="dashboard-muted mt-1">{n.body}</p>
                {n.link && (
                  <Link href={n.link} className="dashboard-link mt-2 inline-block">
                    View details
                  </Link>
                )}
              </div>
              {!n.read && (
                <button type="button" className="dashboard-link text-xs" onClick={() => markRead(n.id)}>
                  Mark read
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
