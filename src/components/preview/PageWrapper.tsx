"use client";

import { cn } from "@/lib/utils";
import React, { useLayoutEffect, useRef, useState } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | string>("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const windowWidth = window.innerWidth;
      const padding = windowWidth < 640 ? 32 : 64;
      const availableWidth = windowWidth - padding;
      const contentWidth = 794; // 210mm em pixels (aprox)

      let newScale = 1;
      if (availableWidth < contentWidth) {
        newScale = availableWidth / contentWidth;
      }

      setScale(newScale);

      // Pegamos a altura real do conteúdo e multiplicamos pela escala
      const rect = contentRef.current.getBoundingClientRect();
      const realHeight = contentRef.current.offsetHeight;
      setHeight(realHeight * newScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col items-center no-print",
        className,
      )}
      style={{ height }}
    >
      <div
        ref={contentRef}
        className="absolute top-0 origin-top transition-transform duration-200"
        style={{
          transform: `scale(${scale})`,
          width: "210mm",
        }}
      >
        <div className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden">
          {children}
        </div>
      </div>

      {/* Versão para impressão */}
      <div className="hidden print:block w-full">{children}</div>
    </div>
  );
}

interface A4SheetProps {
  children: React.ReactNode;
  pageNumber?: number;
  totalPages?: number;
}

export function A4Sheet({ children, pageNumber, totalPages }: A4SheetProps) {
  return (
    <div className="relative group">
      {pageNumber && (
        <div className="absolute -left-20 top-0 h-full flex flex-col items-center justify-start py-4 no-print">
          <span
            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest vertical-text rotate-180"
            style={{ writingMode: "vertical-rl" }}
          >
            Página {pageNumber} de {totalPages || "?"}
          </span>
          <div className="w-[1px] flex-1 bg-border/50 my-4" />
        </div>
      )}

      <div
        className="a4-sheet aspect-[1/1.414]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </div>
    </div>
  );
}
