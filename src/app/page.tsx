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
  LinkedinLogo,
  ChartLineUp,
  Browser,
  MagicWand,
} from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  saveResume,
  getResume,
  incrementDownload,
} from "@/app/actions/resume-actions";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "@/components/pdf/ResumePDF";
import { cn } from "@/lib/utils";
import { validateATS, ATSResult } from "@/lib/validations/ats-validator";
import {
  checkStrongVerbs,
  SpellCheckResult,
} from "@/lib/validations/spellchecker";
import { parseLinkedInPDF } from "@/lib/validations/linkedin-parser";

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
  const [spellResult, setSpellResult] = useState<SpellCheckResult | null>(null);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [analytics, setAnalytics] = useState({ views: 0, downloads: 0 });

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("resume-draft");
    const savedId = localStorage.getItem("resume-id");
    const savedColor = localStorage.getItem("resume-color");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {}
    }
    if (savedColor) setColorTheme(savedColor);

    if (savedId) {
      setResumeId(savedId);
      getResume(savedId).then((res) => {
        if (res) {
          setIsPortfolio(res.isPortfolio);
          setAnalytics({ views: res.views, downloads: res.downloads });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("resume-color", colorTheme);
      setAtsResult(validateATS(data));
      setSpellResult(checkStrongVerbs(data));
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
        setData(JSON.parse(event.target?.result as string));
        toast.success("JSON importado com sucesso!");
      } catch (error) {
        toast.error("Erro ao ler o arquivo JSON");
      }
    };
    reader.readAsText(file);
  };

  const handleLinkedInImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.info("Processando PDF do LinkedIn...");
      const partialData = await parseLinkedInPDF(file);
      setData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...partialData.personalInfo },
      }));
      toast.success("Dados do LinkedIn extraídos!");
    } catch (error) {
      toast.error("Erro ao processar o PDF do LinkedIn.");
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `curriculo-${data.personalInfo.name?.toLowerCase().replace(/\s+/g, "-") || "lume"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("JSON exportado!");
  };

  const handleShare = async () => {
    try {
      setIsSyncing(true);
      const result = await saveResume(
        resumeId,
        data,
        "Meu Currículo",
        isPortfolio,
      );
      setIsSyncing(false);
      setResumeId(result.id);
      localStorage.setItem("resume-id", result.id);
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/${result.id}`,
      );
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      setIsSyncing(false);
      toast.error("Falha ao gerar link.");
    }
  };

  const togglePortfolio = async () => {
    const newValue = !isPortfolio;
    setIsPortfolio(newValue);
    if (resumeId) {
      await saveResume(resumeId, data, "Meu Currículo", newValue);
      toast.success(
        newValue ? "Modo Portfólio Ativado!" : "Modo Currículo Padrão Ativado!",
      );
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="no-print h-16 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <motion.div
          className="flex items-center group cursor-pointer select-none"
          whileHover="hover"
        >
          <span className="text-3xl font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 transition-all duration-500 group-hover:from-primary group-hover:to-primary/70">
            Lume
          </span>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Validador ATS e Spellchecker */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2.5 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-full transition-all duration-300 group shadow-sm">
                <div className="relative">
                  <MagicWand
                    size={18}
                    weight="bold"
                    className={cn(
                      "transition-colors duration-500",
                      spellResult?.hasIssues
                        ? "text-amber-500 animate-pulse"
                        : "text-emerald-500",
                    )}
                  />
                  {spellResult?.hasIssues && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="h-4 w-px bg-primary/20" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    size={18}
                    weight="bold"
                    className={cn(
                      (atsResult?.score || 0) > 70
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  />
                  <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                    Score {atsResult?.score}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[380px] p-0 rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl overflow-hidden"
              align="center"
            >
              <div className="bg-primary/5 p-4 border-b border-border/40">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                  <ShieldCheck size={16} weight="bold" /> Health Check
                  Profissional
                </h3>
              </div>

              <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-3">
                {/* ATS Suggestions */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    Otimização de Leitura (ATS)
                  </span>
                  <div className="grid gap-2">
                    {atsResult?.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 bg-muted/30 rounded-2xl border border-border/20 text-[11px] leading-relaxed text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                        {s}
                      </div>
                    ))}
                    {atsResult?.suggestions.length === 0 && (
                      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-[11px] text-emerald-600 font-bold text-center">
                        ✨ Sua estrutura está impecável para o ATS!
                      </div>
                    )}
                  </div>
                </div>

                {/* Spellchecker Contextual */}
                {spellResult?.hasIssues && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                      Verbos de Ação e Impacto
                    </span>
                    <div className="space-y-4">
                      {spellResult.suggestions.map((s, i) => (
                        <div key={i} className="space-y-3">
                          <div className="px-1 text-[10px] font-black text-primary/70 uppercase">
                            {s.section}
                          </div>
                          {s.found.map((f, j) => (
                            <div
                              key={j}
                              className="group relative p-4 bg-background border border-border/60 rounded-2xl shadow-sm hover:border-primary/30 transition-all"
                            >
                              <div className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                                {f.context.split(f.word).map((part, k, arr) => (
                                  <span key={k}>
                                    {part}
                                    {k < arr.length - 1 && (
                                      <span className="px-1 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded mx-0.5">
                                        {f.word}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                  Sugestões:
                                </span>
                                {f.alternatives.map((alt, k) => (
                                  <span
                                    key={k}
                                    className="px-2 py-0.5 bg-emerald-500/5 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-500/10"
                                  >
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/20 border-t border-border/40 text-center">
                <p className="text-[9px] text-muted-foreground font-medium italic">
                  Dica: Verbos fortes aumentam suas chances em até 40%
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-4 w-[1px] bg-border/40" />

          {/* Importações / LinkedIn */}
          <div className="flex items-center gap-1 bg-muted/20 rounded-full p-1 border border-border/30">
            <div className="relative" title="Importar PDF do LinkedIn">
              <input
                type="file"
                accept=".pdf"
                onChange={handleLinkedInImport}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-background/80 text-[#0A66C2]"
              >
                <LinkedinLogo size={16} weight="fill" />
              </Button>
            </div>
            <div className="relative" title="Importar Backup JSON">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-background/80"
              >
                <FileArrowUp size={16} />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportJSON}
              className="h-7 w-7 rounded-full hover:bg-background/80"
              title="Exportar Backup JSON"
            >
              <FileArrowDown size={16} />
            </Button>
          </div>

          {/* Share & Analytics */}
          <div className="flex items-center gap-1 bg-muted/20 rounded-full p-1 border border-border/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-7 w-7 rounded-full hover:bg-background/80"
              title="Gerar Link Público"
            >
              <ShareNetwork size={16} />
            </Button>
            {resumeId && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-background/80"
                    title="Analytics"
                  >
                    <ChartLineUp size={16} className="text-emerald-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl"
                  align="center"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-muted-foreground text-center">
                    Analytics do Link
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                      <span className="block text-2xl font-black text-primary">
                        {analytics.views}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Views
                      </span>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                      <span className="block text-2xl font-black text-emerald-500">
                        {analytics.downloads}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Downloads
                      </span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePortfolio}
              className={cn(
                "h-7 w-7 rounded-full hover:bg-background/80",
                isPortfolio && "bg-primary/20 text-primary",
              )}
              title={
                isPortfolio
                  ? "Modo Portfólio Ativado"
                  : "Ativar Modo Portfólio no Link"
              }
            >
              <Browser size={16} weight={isPortfolio ? "fill" : "regular"} />
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-border/40" />

          {/* Theme & Export */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full h-8 px-3"
                >
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: colorTheme }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Cor
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
                        "w-9 h-9 rounded-full border-2 transition-all hover:scale-110",
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
                      className="gap-2 rounded-full px-5 h-8 text-xs font-bold shadow-lg shadow-primary/5 active:scale-95 transition-all"
                      disabled={loading}
                      onClick={() => incrementDownload(resumeId)}
                    >
                      <Printer size={16} weight="bold" />
                      {loading ? "..." : "PDF"}
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
                  />{" "}
                  Sincronizando...
                </motion.div>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-background/90 backdrop-blur-md border border-emerald-500/20 px-4 py-2 rounded-full shadow-sm"
                >
                  <CloudCheck size={16} weight="bold" /> Salvo
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 bg-muted/5 relative overflow-hidden items-center justify-center">
          <div className="absolute top-4 right-8 z-50 flex items-center bg-muted/20 rounded-full px-1 py-1 border border-border/30 backdrop-blur-md">
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
        </div>
      </div>
    </main>
  );
}
