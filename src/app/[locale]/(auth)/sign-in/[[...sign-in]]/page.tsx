"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { Moon, Sun } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function SignInPage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative text-foreground selection:bg-primary/30">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 overflow-hidden border-r border-border/40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
            alt="Workspace"
            className="w-full h-full object-cover opacity-50 dark:opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent dark:from-background dark:via-background/90" />
        </div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Image
              src="/LUME_WHITE.svg"
              alt="Lume Logo"
              width={120}
              height={31}
              priority
              className="object-contain"
            />
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-8xl font-black tracking-tighter leading-[0.85] text-white">
                {t("auth.heroTitle")} <br />
                <span className="text-primary italic font-serif">
                  {t("auth.heroSubtitle")}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["ats", "pdf", "keywords"].map((key, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-white/80"
                >
                  {t(`auth.tags.${key}`)}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-12 relative items-center justify-center bg-background">
        <div className="absolute top-10 right-12 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-full border border-border/40 backdrop-blur-md px-3 py-1.5">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-border/60 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-8 w-8 hover:bg-background/80"
            >
              {theme === "dark" ? (
                <Sun size={18} weight="duotone" />
              ) : (
                <Moon size={18} weight="duotone" />
              )}
            </Button>
          </div>
        </div>

        <div className="lg:hidden absolute top-10 left-12">
          <Image
            src="/LUME_WHITE.svg"
            alt="Lume Logo"
            width={100}
            height={26}
            priority
            className="object-contain brightness-0 dark:brightness-100"
          />
        </div>

        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-3">
            <h3 className="text-5xl font-black tracking-tight text-foreground">
              {t("auth.signInTitle")}
            </h3>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              {t("auth.signInDesc")}
            </p>
          </div>

          <div className="w-full flex justify-center">
            <SignIn routing="path" path={`/${locale}/sign-in`} />
          </div>
        </div>

        <p className="absolute bottom-10 text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] select-none">
          LUME &bull; Global Suite &bull; 2026
        </p>
      </div>
    </div>
  );
}
