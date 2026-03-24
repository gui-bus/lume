"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ResumeForm } from "@/components/editor/ResumeForm";
import { ResumeView } from "@/components/preview/ResumeView";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ShareNetwork,
  FileArrowUp,
  FileArrowDown,
  ShieldCheck,
  LinkedinLogo,
  ChartLineUp,
  Browser,
  MagicWand,
  List,
  Gear,
  Info,
  Target,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { saveResume, incrementDownload } from "@/app/actions/resume-actions";
import { useTheme } from "@/components/theme-provider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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
import {
  analyzeJobMatch,
  MatchResult,
} from "@/lib/validations/keyword-matcher";
import { useLocale, useTranslations } from "next-intl";
import { UserButton, Show } from "@clerk/nextjs";

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

interface EditorViewProps {
  initialData?: ResumeData;
  resumeId?: string;
  groupId?: string;
}

export function EditorView({
  initialData,
  resumeId: serverResumeId,
  groupId: serverGroupId,
}: EditorViewProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  // O estado 'data' é usado apenas para o PREVIEW
  const [data, setData] = useState<ResumeData>(initialData || defaultData);
  const [resumeId, setResumeId] = useState<string | undefined>(serverResumeId);
  const [groupId, setGroupId] = useState<string | undefined>(serverGroupId);

  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [jobDescription, setJobDescription] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quando o servidor envia novos dados (ex: troca de idioma), atualizamos o preview
  useEffect(() => {
    if (initialData) setData(initialData);
    setResumeId(serverResumeId);
    setGroupId(serverGroupId);
  }, [initialData, serverResumeId, serverGroupId]);

  const handleDataChange = useCallback((newData: ResumeData) => {
    setData(newData);
  }, []);

  const handleIdGenerated = useCallback((newId: string, newGroupId: string) => {
    setResumeId(newId);
    setGroupId(newGroupId);
  }, []);

  // Memoziação de cálculos pesados para evitar loops de render
  const atsResult = useMemo(() => validateATS(data), [data]);
  const spellResult = useMemo(() => checkStrongVerbs(data), [data]);
  const matchResult = useMemo(
    () => (jobDescription ? analyzeJobMatch(data, jobDescription) : null),
    [data, jobDescription],
  );

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${data.personalInfo.name || "lume"}.json`;
    link.click();
  };

  const handleShare = async () => {
    try {
      const result = await saveResume(
        resumeId,
        data,
        data.personalInfo.name || t("title"),
        false,
        locale,
        groupId,
      );
      setResumeId(result.id);
      setGroupId(result.groupId);
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/${result.groupId}`,
      );
      toast.success(t("header.actions.shareSuccess"));
    } catch (error) {
      toast.error(t("header.actions.shareError"));
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="no-print h-16 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-primary">
            Lume
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full px-4 h-9 font-bold bg-muted/40 hover:bg-muted/60 border border-border/40 transition-all text-muted-foreground hover:text-foreground"
              >
                <Target size={18} weight="bold" />
                <span className="hidden lg:inline uppercase tracking-widest text-[10px]">
                  {t("header.jobMatch.button")}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                  <Target size={24} weight="bold" className="text-primary" />{" "}
                  {t("header.jobMatch.title")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  {t("header.jobMatch.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <Textarea
                  placeholder={t("header.jobMatch.placeholder")}
                  className="h-[200px] rounded-2xl text-sm bg-muted/20 border-border/40 focus:ring-primary/20 transition-all resize-none p-4 custom-scrollbar"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                {matchResult && (
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <span className="text-4xl font-black tracking-tighter text-primary">
                      {matchResult.score}%
                    </span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2.5 px-4 py-2 bg-muted/40 hover:bg-muted/60 border border-border/40 rounded-full transition-all duration-300 group shadow-sm text-muted-foreground hover:text-foreground">
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
                  {t("atsScore", { score: atsResult?.score ?? 0 })}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] md:w-[380px] p-5 rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                {t("header.healthCheck.title")}
              </h3>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
                {atsResult?.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 bg-muted/30 rounded-xl text-[11px] text-muted-foreground border border-border/20"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-9 w-9"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <LanguageSwitcher />

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 border border-border/40",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={t("header.auth.dashboard")}
                  labelIcon={<ChartLineUp size={16} />}
                  href={`/${locale}/dashboard`}
                />
              </UserButton.MenuItems>
            </UserButton>
          </Show>

          <PDFDownloadLink
            document={<ResumePDF data={data} colorTheme="#18181b" />}
            fileName={`resume-${data.personalInfo.name || "lume"}.pdf`}
          >
            {({ loading }) => (
              <Button
                size="sm"
                className="gap-2 rounded-full px-6 h-9 font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all"
                disabled={loading}
              >
                <FileArrowDown size={18} weight="bold" />
                <span className="hidden sm:inline">
                  {loading
                    ? t("header.actions.generatingPdf")
                    : t("header.actions.downloadPdf")}
                </span>
              </Button>
            )}
          </PDFDownloadLink>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 bg-muted/30"
              >
                <List size={22} weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl p-6"
            >
              <div className="space-y-8 mt-8">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full justify-start gap-3 rounded-xl py-6"
                >
                  <ShareNetwork size={20} /> {t("header.tools.generateLink")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportJSON}
                  className="w-full justify-start gap-3 rounded-xl py-6"
                >
                  <FileArrowDown size={20} /> {t("header.tools.saveBackup")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 border-r bg-card/10 overflow-hidden relative flex flex-col">
          <ResumeForm
            key={`${locale}-${serverResumeId || "new"}`} // MATA e CRIA o form ao trocar de idioma
            initialData={initialData || defaultData}
            resumeId={resumeId}
            groupId={groupId}
            onDataChange={handleDataChange}
            onIdGenerated={handleIdGenerated}
          />
        </div>

        <div className="hidden lg:flex flex-1 bg-muted/5 relative overflow-hidden items-center justify-center">
          <div className="absolute top-4 right-8 z-50 flex items-center bg-muted/30 rounded-full px-1 py-1 border border-border/30 backdrop-blur-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((v) => Math.max(0.4, v - 0.1))}
              className="h-7 w-7"
            >
              <MagnifyingGlassMinus size={14} />
            </Button>
            <span className="text-[10px] font-black w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((v) => Math.min(1.2, v + 0.1))}
              className="h-7 w-7"
            >
              <MagnifyingGlassPlus size={14} />
            </Button>
          </div>
          <div className="absolute inset-0 overflow-auto custom-scrollbar flex items-start justify-center p-12 canvas-grid">
            <motion.div animate={{ scale: zoom }} className="origin-top my-8">
              <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                <ResumeView data={data} colorTheme="#18181b" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
