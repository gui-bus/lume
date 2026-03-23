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
      toast.success("Progresso salvo!");
    } catch (error) {
      setIsSyncing(false);
      toast.error("Erro ao salvar.");
    }
  }, [resumeId, data]);

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header Premium */}
      <header className="no-print h-16 border-b bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkle
              size={22}
              weight="fill"
              className="text-primary-foreground"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Lume</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-full p-1 border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))}
              className="h-8 w-8 rounded-full"
            >
              <MagnifyingGlassMinus size={16} />
            </Button>
            <span className="text-[10px] font-mono w-10 text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.min(1.2, prev + 0.1))}
              className="h-8 w-8 rounded-full"
            >
              <MagnifyingGlassPlus size={16} />
            </Button>
          </div>

          <div className="h-6 w-[1px] bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
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
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-dashed"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorTheme }}
                />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cor
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-3 rounded-2xl">
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
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

          <AnimatePresence mode="wait">
            <motion.div key={JSON.stringify(data) + colorTheme}>
              <PDFDownloadLink
                document={<ResumePDF data={data} colorTheme={colorTheme} />}
                fileName={`curriculo-${data.personalInfo.name || "lume"}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    size="sm"
                    className="gap-2 rounded-full px-5 font-bold shadow-xl shadow-primary/20"
                    disabled={loading}
                  >
                    <Printer size={18} weight="bold" />
                    <span className="hidden sm:inline">
                      {loading ? "Gerando..." : "Download"}
                    </span>
                  </Button>
                )}
              </PDFDownloadLink>
            </motion.div>
          </AnimatePresence>
        </div>
      </header>

      {/* Editor & Preview Split Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor */}
        <div className="w-full lg:w-[480px] xl:w-[580px] shrink-0 border-r bg-card/30 overflow-hidden relative flex flex-col">
          <ResumeForm
            initialData={data}
            resumeId={resumeId}
            onDataChange={handleDataChange}
            onIdGenerated={setResumeId}
          />

          {/* Status Badge */}
          <div className="absolute bottom-6 left-6 no-print z-50">
            <AnimatePresence mode="wait">
              {isSyncing ? (
                <motion.div
                  key="syncing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-md border px-3 py-1.5 rounded-full shadow-sm"
                >
                  <ArrowsClockwise size={12} className="animate-spin" />
                  Salvando...
                </motion.div>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-background/80 backdrop-blur-md border border-green-500/20 px-3 py-1.5 rounded-full shadow-sm"
                >
                  <CloudCheck size={14} weight="fill" />
                  Documento Salvo
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Preview Engine */}
        <div className="hidden lg:flex flex-1 bg-muted/20 relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 overflow-auto custom-scrollbar flex items-start justify-center p-12">
            <motion.div
              animate={{ scale: zoom }}
              className="origin-top"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden bg-white">
                <ResumeView data={data} colorTheme={colorTheme} />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md border rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Edição em Tempo Real
          </div>
        </div>
      </div>
    </main>
  );
}
