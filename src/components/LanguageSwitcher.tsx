"use client";

import React, { useTransition } from "react";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      // Forçamos o refresh para garantir que o Server Component (SharePage)
      // busque os dados novamente com o novo locale
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        "flex gap-1 bg-muted/30 p-1 rounded-full border border-border/40 transition-all duration-200",
        isPending && "opacity-50 pointer-events-none",
      )}
    >
      <button
        onClick={() => switchLanguage("pt")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold",
          locale === "pt"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <ReactCountryFlag
          countryCode="BR"
          svg
          style={{
            width: "1.2em",
            height: "1.2em",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span className="hidden sm:inline">PT</span>
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold",
          locale === "en"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <ReactCountryFlag
          countryCode="US"
          svg
          style={{
            width: "1.2em",
            height: "1.2em",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
