import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function PaymentsPage() {
  return (
    <DashboardShell title="Payment Methods">
      <div className="store-panel p-6">
        <p className="dashboard-muted">
          Saved payment methods will appear here. Stripe is active for checkout; Razorpay and PayPal integrations are
          ready to wire in production.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] p-6 text-center text-sm text-[color:var(--store-text-muted)]">
          No saved cards yet
        </div>
      </div>
    </DashboardShell>
  );
}
