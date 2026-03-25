"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 120, height = 31 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar erro de hidratação garantindo que o tema só seja lido no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} className={className} />;
  }

  const isDark = resolvedTheme === "dark";
  const src = isDark ? "/LUME_WHITE.svg" : "/LUME_BLACK.svg";

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <Image
        src={src}
        alt="Lume Logo"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}
