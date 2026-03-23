"use client";

import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "page-wrapper min-h-full w-full py-12 flex flex-col items-center gap-10",
        className,
      )}
    >
      {children}
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

      {/* Régua Visual Opcional */}
      <div className="absolute -top-6 left-0 right-0 h-4 no-print flex justify-between px-[20mm] opacity-20">
        <div className="text-[8px] font-mono">0mm</div>
        <div className="text-[8px] font-mono text-center">105mm</div>
        <div className="text-[8px] font-mono">210mm</div>
      </div>
    </div>
  );
}
