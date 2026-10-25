import { useEffect, useState } from "react";
import type { RefObject } from "react";

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  {
    threshold = 0.15,
    rootMargin = "0px 0px -8% 0px",
    once = true,
  }: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const enterObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          if (once) enterObserver.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    enterObserver.observe(node);

    // Re-arm only once the element is fully outside the viewport, so replays
    // never fade out while still visible at an edge.
    const exitObserver = once
      ? null
      : new IntersectionObserver(
          (entries) => {
            if (entries.every((entry) => !entry.isIntersecting)) setInView(false);
          },
          { threshold: 0, rootMargin: "12% 0px 12% 0px" },
        );
    exitObserver?.observe(node);

    return () => {
      enterObserver.disconnect();
      exitObserver?.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);

  return inView;
}
