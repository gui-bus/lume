"use client";

import { useState, useEffect, useCallback } from "react";
import { ResumeForm } from "@/components/editor/ResumeForm";
import { ResumeView } from "@/components/preview/ResumeView";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Moon,
  Sun,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CloudCheck,
  ArrowsClockwise,
  ShareNetwork,
  FileArrowUp,
  FileArrowDown,
  ShieldCheck,
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
import { validateATS, ATSResult } from "@/lib/validations/ats-validator";

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
  "#18181b",
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#be185d",
];

export default function Home() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [colorTheme, setColorTheme] = useState("#18181b");
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);

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
    if (mounted) {
      localStorage.setItem("resume-color", colorTheme);
      setAtsResult(validateATS(data));
    }
  }, [colorTheme, data, mounted]);

  const handleDataChange = useCallback((newData: ResumeData) => {
    setData(newData);
  }, []);

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setData(json);
        toast.success("Dados importados com sucesso");
      } catch (error) {
        toast.error("Erro ao ler o arquivo JSON");
      }
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `curriculo-${data.personalInfo.name?.toLowerCase().replace(/\s+/g, "-") || "lume"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("JSON exportado com sucesso");
  };

  const handleShare = async () => {
    try {
      setIsSyncing(true);
      const result = await saveResume(resumeId, data);
      setIsSyncing(false);

      const shareUrl = `${window.location.origin}/share/${result.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setResumeId(result.id);
      localStorage.setItem("resume-id", result.id);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      setIsSyncing(false);
      toast.error("Falha ao gerar link de compartilhamento");
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="no-print h-16 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50">
        <motion.div
          className="flex items-center group cursor-pointer select-none"
          whileHover="hover"
        >
          <span className="text-3xl font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 transition-all duration-500 group-hover:from-primary group-hover:to-primary/70">
            Lume
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          {atsResult && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full transition-all">
                  <ShieldCheck
                    size={18}
                    weight="bold"
                    className={cn(
                      atsResult.score > 70
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Score: {atsResult.score}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl"
                align="end"
              >
                <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-primary">
                  <ShieldCheck size={16} /> Análise de ATS
                </h3>
                <div className="space-y-3">
                  {atsResult.suggestions.length > 0 ? (
                    atsResult.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-muted-foreground flex gap-2"
                      >
                        <span className="text-primary font-bold">•</span> {s}
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-emerald-500 font-bold text-center py-2">
                      ✨ Seu currículo está otimizado!
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className="h-4 w-[1px] bg-border/40" />

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Importar JSON"
              />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Importar JSON"
              >
                <FileArrowUp size={20} weight="duotone" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportJSON}
              className="rounded-full"
              title="Exportar JSON"
            >
              <FileArrowDown size={20} weight="duotone" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
              title="Compartilhar link público"
            >
              <ShareNetwork size={20} weight="duotone" />
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-border/40" />

          <div className="hidden md:flex items-center bg-muted/20 rounded-full px-1 py-1 border border-border/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))}
              className="h-7 w-7 rounded-full hover:bg-background/80"
            >
              <MagnifyingGlassMinus size={14} weight="bold" />
            </Button>
            <span className="text-[10px] font-black w-10 text-center text-muted-foreground/70 tracking-tighter">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.min(1.2, prev + 0.1))}
              className="h-7 w-7 rounded-full hover:bg-background/80"
            >
              <MagnifyingGlassPlus size={14} weight="bold" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-muted/50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun size={20} weight="duotone" />
              ) : (
                <Moon size={20} weight="duotone" />
              )}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full h-9 px-3 hover:bg-muted/50"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/5 shadow-sm"
                    style={{ backgroundColor: colorTheme }}
                  />
                  <span className="text-xs font-bold tracking-tight">
                    Estilo
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-3 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl"
                align="end"
              >
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all hover:scale-110 active:scale-90",
                        colorTheme === color
                          ? "border-primary scale-105"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setColorTheme(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <AnimatePresence mode="wait">
              <motion.div key={JSON.stringify(data) + colorTheme}>
                <PDFDownloadLink
                  document={<ResumePDF data={data} colorTheme={colorTheme} />}
                  fileName={`curriculo-${data.personalInfo.name || "lume"}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      size="sm"
                      className="gap-2 rounded-full px-5 h-9 font-bold shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all active:scale-95"
                      disabled={loading}
                    >
                      <Printer size={18} weight="bold" />
                      <span>{loading ? "Gerando..." : "Exportar PDF"}</span>
                    </Button>
                  )}
                </PDFDownloadLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 border-r bg-card/10 overflow-hidden relative flex flex-col">
          <ResumeForm
            initialData={data}
            resumeId={resumeId}
            onDataChange={handleDataChange}
            onIdGenerated={setResumeId}
          />

          <div className="absolute bottom-6 left-6 no-print z-50">
            <AnimatePresence mode="wait">
              {isSyncing ? (
                <motion.div
                  key="syncing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/90 backdrop-blur-md border px-4 py-2 rounded-full shadow-sm"
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
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-background/90 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-full shadow-sm"
                >
                  <CloudCheck size={16} weight="bold" />
                  Salvo Localmente
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 bg-muted/5 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 overflow-auto custom-scrollbar flex items-start justify-center p-12 canvas-grid">
            <motion.div
              animate={{ scale: zoom }}
              className="origin-top my-8"
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <div className="shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden bg-white">
                <ResumeView data={data} colorTheme={colorTheme} />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md border border-border/50 rounded-full text-[11px] font-medium text-muted-foreground shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Visualização em Tempo Real
          </div>
        </div>
      </div>
    </main>
  );
}
