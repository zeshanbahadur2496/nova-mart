import { getServerSession } from "next-auth";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <DashboardShell title="Profile">
        <div className="store-panel p-6 text-center">
          <h2 className="font-display text-2xl font-bold text-[color:var(--store-text)]">Sign in to manage profile</h2>
          <Link href="/login?callbackUrl=/dashboard/profile" className="store-btn-primary mt-5 inline-flex h-11 items-center px-5">
            Sign in
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true, email: true, emailVerified: true }
  });

  return (
    <DashboardShell title="Profile">
      <div className="store-panel p-6">
        {!user?.emailVerified && (
          <p className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100">
            Email not verified. Check your inbox or request a new link from account settings.
          </p>
        )}
        <ProfileForm
          initialName={user?.name ?? ""}
          initialPhone={user?.phone ?? ""}
          email={user?.email ?? session.user.email ?? ""}
          role={session.user.role}
        />
      </div>
    </DashboardShell>
  );
}
