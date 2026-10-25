/* eslint-disable react-hooks/set-state-in-effect -- animation state is synced deliberately after visibility changes */
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/utils/format";

export function CountUp({
  value,
  format = formatNumber,
  decimals = 0,
  duration = 1600,
  delay = 0,
  className,
}: {
  value: number;
  format?: (value: number) => string;
  decimals?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.35, rootMargin: "0px 0px -4% 0px", once: false });
  const [display, setDisplay] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    if (!Number.isFinite(value)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shownRef.current = value;
      setDisplay(value);
      return;
    }

    if (!inView) {
      if (shownRef.current !== 0) {
        shownRef.current = 0;
        setDisplay(0);
      }
      return;
    }

    const from = shownRef.current;
    const delta = value - from;
    if (delta === 0) {
      setDisplay(value);
      return;
    }

    const factor = 10 ** decimals;
    let frame = 0;
    let timer = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / duration);
      if (progress === 1) {
        shownRef.current = value;
        setDisplay(value);
        return;
      }
      const eased = 1 - (1 - progress) ** 3;
      const next = from + delta * eased;
      const rounded = decimals > 0 ? Math.round(next * factor) / factor : Math.round(next);
      shownRef.current = rounded;
      setDisplay(rounded);
      frame = requestAnimationFrame(tick);
    };

    timer = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [inView, value, duration, delay, decimals]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className={cn("tabular-nums", className)}>
        {format(display)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
