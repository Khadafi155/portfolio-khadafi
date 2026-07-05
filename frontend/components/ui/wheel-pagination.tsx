"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WheelPaginationProps {
  totalPages?: number;
  className?: string;
  visibleCount?: number; // Number of pages visible at once
  onChange?: (page: number) => void;
  /** Controlled active page (0-based). */
  page?: number;
  /** Wrap around at the ends (arrows never disable). */
  loop?: boolean;
}

export default function WheelPagination({
  totalPages = 50,
  visibleCount = 5,
  className,
  onChange,
  page,
  loop = false,
}: WheelPaginationProps) {
  const [internal, setInternal] = useState(0);
  const active = page ?? internal;
  const containerRef = useRef<HTMLDivElement>(null);

  // keep latest active for the (once-bound) wheel handler
  const activeRef = useRef(active);
  activeRef.current = active;

  const commit = (n: number) => {
    const next = loop
      ? ((n % totalPages) + totalPages) % totalPages
      : Math.max(0, Math.min(n, totalPages - 1));
    if (next === active) return;
    if (page === undefined) setInternal(next);
    onChange?.(next);
  };

  const prevPage = () => commit(active - 1);
  const nextPage = () => commit(active + 1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      commit(activeRef.current + (e.deltaY < 0 ? -1 : 1));
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, loop, page]);

  // Determine visible pages based on active
  const getVisiblePages = () => {
    const pages: number[] = [];
    const half = Math.floor(visibleCount / 2);
    let start = active - half;
    let end = active + half;

    if (start < 0) {
      end += -start;
      start = 0;
    }
    if (end > totalPages - 1) {
      start -= end - (totalPages - 1);
      end = totalPages - 1;
      if (start < 0) start = 0;
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center justify-center gap-2 p-4 select-none cursor-pointer",
        className,
      )}
    >
      {/* Previous arrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevPage}
        disabled={!loop && active === 0}
        className="text-gray-400 hover:text-[#15c8b6] disabled:opacity-40 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Page numbers carousel */}
      <div className="flex gap-2">
        {visiblePages.map((p) => (
          <motion.div
            key={p}
            layout
            animate={{ scale: active === p ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium min-h-[40px]",
              active === p
                ? "bg-[#15c8b6] text-[#03211d] border border-[#15c8b6]"
                : "bg-[#141b1a] text-[#9ba6a3] hover:text-white border border-[rgba(255,255,255,0.08)]",
            )}
            onClick={() => commit(p)}
          >
            {p + 1}
          </motion.div>
        ))}
      </div>

      {/* Next arrow */}
      <Button
        variant="ghost"
        size="icon"
        onClick={nextPage}
        disabled={!loop && active === totalPages - 1}
        className="text-gray-400 hover:text-[#15c8b6] disabled:opacity-40 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
