import { Check, Circle } from "lucide-react";

import type { OrderTimelineStep } from "@/types";

export function OrderTracking({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={`${step.status}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            {step.completed ? (
              <Check className="h-5 w-5 text-[color:var(--store-success)]" />
            ) : (
              <Circle className="h-5 w-5 text-[color:var(--store-text-muted)]" />
            )}
            {index < steps.length - 1 && <span className="mt-1 h-full w-px bg-[color:var(--store-border)]" />}
          </div>
          <div className="pb-4">
            <p
              className={`font-semibold ${step.completed ? "text-[color:var(--store-text)]" : "text-[color:var(--store-text-muted)]"}`}
            >
              {step.status.replaceAll("_", " ")}
            </p>
            <p className="dashboard-muted">{step.message}</p>
            {step.createdAt && (
              <p className="mt-1 text-xs text-[color:var(--store-text-muted)]">
                {new Date(step.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
