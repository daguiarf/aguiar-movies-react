"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function HorizontalCarousel({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!ref.current) return;

    const amount = 300;

    ref.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur border rounded-full p-2 shadow hover:bg-background"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur border rounded-full p-2 shadow hover:bg-background"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-3 px-8 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}