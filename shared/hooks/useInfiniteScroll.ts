"use client";

import { useEffect, useRef } from "react";

/**
 * Observa um elemento sentinela (ref) e chama `onIntersect` quando ele entra na viewport.
 * Usado para scroll infinito.
 */
export function useInfiniteScroll(
  onIntersect: () => void,
  enabled: boolean
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return ref;
}
