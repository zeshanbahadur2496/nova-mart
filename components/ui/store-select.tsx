"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type StoreSelectOption = {
  value: string;
  label: string;
};

type StoreSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: StoreSelectOption[];
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  placeholder?: string;
  "aria-label"?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  size?: "sm" | "md";
};

export function StoreSelect({
  value,
  onChange,
  options,
  className,
  triggerClassName,
  menuClassName,
  placeholder = "Select",
  "aria-label": ariaLabel,
  id,
  name,
  disabled = false,
  size = "md"
}: StoreSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const scrollable = options.length > 10;

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  function selectOption(option: StoreSelectOption) {
    onChange(option.value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        return;
      }
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        return;
      }
      if (activeIndex >= 0 && options[activeIndex]) {
        selectOption(options[activeIndex]);
      }
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${selectId}-listbox`}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
          setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "store-input flex w-full items-center justify-between gap-2 text-left font-semibold transition",
          size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-3 text-sm",
          open && "border-[color:var(--store-accent)] ring-2 ring-[color:var(--store-focus)]",
          disabled && "cursor-not-allowed opacity-50",
          triggerClassName
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[color:var(--store-text-muted)] transition", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          id={`${selectId}-listbox`}
          role="listbox"
          aria-labelledby={selectId}
          className={cn(
            "absolute left-0 top-[calc(100%+6px)] z-[80] w-full min-w-[8rem] rounded-xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] py-1 shadow-dropdown",
            scrollable && "store-scroll max-h-60",
            menuClassName
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition",
                    isSelected && "bg-[color:var(--store-accent-soft)] font-semibold text-[color:var(--store-accent)]",
                    !isSelected && isActive && "bg-[color:var(--store-surface-muted)] text-[color:var(--store-text)]",
                    !isSelected && !isActive && "text-[color:var(--store-text-muted)] hover:bg-[color:var(--store-surface-muted)] hover:text-[color:var(--store-text)]"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
