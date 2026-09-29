"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { heroSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

const SLIDE_MS = 7000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slide = heroSlides[active];
  const total = heroSlides.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + total) % total);
      setProgress(0);
    },
    [total]
  );

  const move = useCallback(
    (direction: number) => {
      goTo(active + direction);
    },
    [active, goTo]
  );

  useEffect(() => {
    if (paused) return;

    setProgress(0);
    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(100, (elapsed / SLIDE_MS) * 100));
      if (elapsed >= SLIDE_MS) {
        setActive((value) => (value + 1) % total);
      }
    }, 50);

    return () => window.clearInterval(tick);
  }, [active, paused, total]);

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setProgress(0);
      }}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <div className="relative mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--store-border)] shadow-glow">
          <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={active === 0}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover object-center"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/90 via-[#0c0a09]/55 to-[#0c0a09]/20 dark:from-[#0c0a09]/95 dark:via-[#0c0a09]/70 dark:to-transparent" />

                <div className="relative flex h-full flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:max-w-2xl lg:px-14 lg:py-16">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--store-accent)] sm:text-sm">
                    {slide.eyebrow}
                  </span>

                  <h1 className="font-display mt-4 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                    {slide.title}
                  </h1>

                  <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">{slide.description}</p>

                  <Link
                    href={slide.href}
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[color:var(--store-accent)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[color:var(--store-accent-hover)] hover:shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
              <div className="flex items-center gap-2">
                {heroSlides.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to slide ${index + 1}: ${item.title}`}
                    aria-current={index === active ? "true" : undefined}
                    className={cn(
                      "group relative h-1.5 overflow-hidden rounded-full transition-all",
                      index === active ? "w-12 bg-white/30" : "w-6 bg-white/20 hover:bg-white/35"
                    )}
                  >
                    {index === active && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width]"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
