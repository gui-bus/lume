"use client";

import { useState, useEffect, useCallback } from "react";
import { ResumeForm } from "@/components/editor/ResumeForm";
import { ResumeView } from "@/components/preview/ResumeView";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Palette,
  Sparkle,
  Moon,
  Sun,
  CheckCircle,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CloudCheck,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { saveResume } from "@/app/actions/resume-actions";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "@/components/pdf/ResumePDF";
import { cn } from "@/lib/utils";

const defaultData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
  volunteering: [],
};

const COLORS = [
  "#000000",
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
];

export default function Home() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [colorTheme, setColorTheme] = useState("#000000");
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [zoom, setZoom] = useState(0.85);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("resume-draft");
    const savedId = localStorage.getItem("resume-id");
    const savedColor = localStorage.getItem("resume-color");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedId) setResumeId(savedId);
    if (savedColor) setColorTheme(savedColor);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("resume-color", colorTheme);
  }, [colorTheme, mounted]);

  const handleDataChange = useCallback((newData: ResumeData) => {
    setData(newData);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSyncing(true);
      await saveResume(resumeId, data);
      setIsSyncing(false);
      toast.success("Progresso salvo com sucesso");
    } catch (error) {
      setIsSyncing(false);
      toast.error("Falha ao sincronizar");
    }
  }, [resumeId, data]);

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header Premium High-End */}
      <header className="no-print h-16 border-b bg-background/60 backdrop-blur-2xl flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-lume-indigo via-lume-violet to-lume-blue rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-10 h-10 rounded-xl bg-background border flex items-center justify-center shadow-2xl">
              <Sparkle size={24} weight="fill" className="text-primary" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter">Lume</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-0.5">
              Resume AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="hidden md:flex items-center bg-muted/30 hover:bg-muted/50 transition-colors rounded-full p-1 border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))}
              className="h-7 w-7 rounded-full"
            >
              <MagnifyingGlassMinus size={14} />
            </Button>
            <span className="text-[10px] font-bold w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.min(1.2, prev + 0.1))}
              className="h-7 w-7 rounded-full"
            >
              <MagnifyingGlassPlus size={14} />
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-border/50 mx-1" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-muted/50"
          >
            {theme === "dark" ? (
              <Sun size={20} weight="duotone" />
            ) : (
              <Moon size={20} weight="duotone" />
            )}
          </Button>

          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-border/50 h-9 px-4 hover:bg-muted/50 transition-all"
              >
                <div
                  className="w-3 h-3 rounded-full shadow-inner"
                  style={{ backgroundColor: colorTheme }}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Accent
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 rounded-2xl bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-all hover:scale-110 hover:shadow-lg",
                      colorTheme === color
                        ? "border-primary"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setColorTheme(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Download Action */}
          <AnimatePresence mode="wait">
            <motion.div key={JSON.stringify(data) + colorTheme}>
              <PDFDownloadLink
                document={<ResumePDF data={data} colorTheme={colorTheme} />}
                fileName={`curriculo-${data.personalInfo.name || "lume"}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    size="sm"
                    className="gap-2 rounded-full px-6 h-9 font-black shadow-xl shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-95"
                    disabled={loading}
                  >
                    <Printer size={18} weight="bold" />
                    <span>{loading ? "GERANDO..." : "DOWNLOAD PDF"}</span>
                  </Button>
                )}
              </PDFDownloadLink>
            </motion.div>
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Professional Editor */}
        <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 border-r bg-card/20 overflow-hidden relative flex flex-col">
          <ResumeForm
            initialData={data}
            resumeId={resumeId}
            onDataChange={handleDataChange}
            onIdGenerated={setResumeId}
          />

          {/* Status Badge - Refined */}
          <div className="absolute bottom-6 left-6 no-print z-50">
            <AnimatePresence mode="wait">
              {isSyncing ? (
                <motion.div
                  key="syncing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-xl border px-4 py-2 rounded-full shadow-sm"
                >
                  <ArrowsClockwise
                    size={12}
                    className="animate-spin text-primary"
                  />
                  Sincronizando...
                </motion.div>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-background/80 backdrop-blur-xl border border-emerald-500/20 px-4 py-2 rounded-full shadow-sm"
                >
                  <CloudCheck size={16} weight="bold" />
                  Documento Salvo
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Preview Stage */}
        <div className="hidden lg:flex flex-1 bg-muted/10 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 overflow-auto custom-scrollbar flex items-start justify-center p-16 mesh-bg">
            <motion.div
              animate={{ scale: zoom }}
              className="origin-top"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="shadow-[0_50px_150px_-30px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden bg-white">
                <ResumeView data={data} colorTheme={colorTheme} />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-3 px-5 py-2.5 bg-background/40 backdrop-blur-2xl border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
            Live Preview Engine
          </div>
        </div>
      </div>
    </main>
  );
}
