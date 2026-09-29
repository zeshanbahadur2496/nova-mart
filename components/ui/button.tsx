import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        "focus:ring-2 focus:ring-[color:var(--store-focus)]",
        variant === "primary" &&
          "bg-[color:var(--store-primary)] text-[color:var(--store-primary-fg)] shadow-sm hover:bg-[color:var(--store-primary-hover)] active:scale-[0.98]",
        variant === "secondary" && "bg-[color:var(--store-accent)] text-white shadow-sm hover:opacity-90",
        variant === "ghost" && "text-[color:var(--store-text-muted)] hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-text)]",
        variant === "dark" && "bg-[color:var(--store-primary)] text-[color:var(--store-primary-fg)] hover:bg-[color:var(--store-primary-hover)]",
        variant === "outline" &&
          "border border-[color:var(--store-border)] bg-[color:var(--store-surface)] text-[color:var(--store-text)] hover:border-[color:var(--store-accent)] hover:bg-[color:var(--store-accent-soft)]",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        size === "icon" && "h-10 w-10 p-0",
        className
      )}
      {...props}
    />
  );
}
