"use client";

import { SignUp } from "@clerk/nextjs";
import { ShieldCheck, Target, Moon, Sun, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative text-foreground selection:bg-primary/30">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 overflow-hidden border-r border-border/40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Architecture"
            className="w-full h-full object-cover opacity-50 dark:opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-black via-black/80 to-transparent dark:from-background dark:via-background/90" />
        </div>

        <div className="relative z-10 w-full max-w-2xl flex flex-col gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <span className="text-4xl font-black tracking-tighter uppercase text-white font-sans">
              Lume
            </span>
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
                  {t("auth.heroLegacy")}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["ats", "pdf", "portfolio", "keywords"].map((key, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-white/80"
                >
                  {t(`auth.tags.${key}`)}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative h-64 w-full mt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -12, x: 20, y: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -12, x: 0, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              className="absolute top-0 left-0 w-60 p-8 rounded-[3rem] bg-white border border-white/20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] z-20"
            >
              <div className="flex items-center justify-between mb-6 text-slate-900">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck
                    size={28}
                    weight="bold"
                    className="text-primary"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                    {t("auth.atsEngine")}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-500 uppercase">
                    {t("auth.status")}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[98%]" />
              </div>
              <div className="mt-4 flex items-end gap-1 text-slate-900">
                <span className="text-4xl font-black tracking-tighter leading-none text-slate-900">
                  98%
                </span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-1">
                  {t("auth.match")}
                </span>
              </div>
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
              className="rounded-full h-8 w-8 hover:bg-background/80 transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        <div className="lg:hidden absolute top-10 left-12">
          <span className="text-2xl font-black uppercase tracking-tighter text-primary">
            Lume
          </span>
        </div>

        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-3">
            <h3 className="text-5xl font-black tracking-tight text-foreground">
              {t("auth.signUpTitle")}
            </h3>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              {t("auth.signUpDesc")}
            </p>
          </div>

          <div className="w-full">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none p-0 text-foreground",
                  header: "hidden",
                  main: "space-y-8",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-sm font-bold h-14 rounded-2xl transition-all shadow-xl shadow-primary/10 active:scale-[0.98]",
                  formFieldInput:
                    "h-13 rounded-2xl bg-muted/30 border-border/50 focus:ring-4 focus:ring-primary/10 transition-all text-base px-5 text-foreground font-medium",
                  formFieldLabel:
                    "text-[11px] font-bold text-muted-foreground/60 mb-2.5 ml-2",
                  footer: "mt-12 border-t border-border/40 pt-10 px-0",
                  footerActionLink:
                    "text-primary font-bold hover:underline ml-1 text-sm",
                  socialButtonsBlockButton:
                    "h-14 rounded-2xl border-border/50 bg-background hover:bg-muted/50 transition-all font-bold text-sm shadow-sm text-foreground",
                  dividerLine: "bg-border/40",
                  dividerText:
                    "text-[11px] font-medium text-muted-foreground/30 px-5",
                  identityPreviewText: "text-foreground font-bold",
                },
              }}
            />
          </div>
        </div>

        <p className="absolute bottom-10 text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] select-none">
          Lume &bull; Global Suite &bull; 2026
        </p>
      </div>
    </div>
  );
}
