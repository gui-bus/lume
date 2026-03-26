"use client";

import { incrementDownload, saveResume } from "@/app/actions/resumeActions";
import { ResumeForm } from "@/components/editor/ResumeForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ResumeView } from "@/components/preview/ResumeView";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { validateATS } from "@/lib/validations/atsValidator";
import { analyzeJobMatch } from "@/lib/validations/keyword-matcher";
import { parseLinkedInPDF } from "@/lib/validations/linkedin-parser";
import { checkStrongVerbs } from "@/lib/validations/spellchecker";
import { ResumeData } from "@/types/resume";
import { Show, UserButton } from "@clerk/nextjs";
import {
  Browser,
  FileArrowDown,
  FileArrowUp,
  Gear,
  Info,
  LinkedinLogo,
  List,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Moon,
  ShareNetwork,
  ShieldCheck,
  Sun,
  Target,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
  courses: [],
};

interface EditorViewProps {
  initialData?: ResumeData;
  resumeId?: string;
  groupId?: string;
  initialSlug?: string;
}

export function EditorView({
  initialData,
  resumeId: serverResumeId,
  groupId: serverGroupId,
  initialSlug,
}: EditorViewProps) {
  const t = useTranslations("common");
  const tResume = useTranslations("common.resume");
  const locale = useLocale();

  const [data, setData] = useState<ResumeData>(
    initialData
      ? { ...defaultData, ...initialData, courses: initialData.courses || [] }
      : defaultData,
  );
  const [resumeId, setResumeId] = useState<string | undefined>(serverResumeId);
  const [groupId, setGroupId] = useState<string | undefined>(serverGroupId);
  const [slug, setSlug] = useState<string>(initialSlug || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!data) return;

    setIsGenerating(true);

    const downloadPromise = async () => {
      // Importações dinâmicas para evitar problemas de SSR e reduzir o bundle inicial
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumePDF } = await import("@/components/pdf/ResumePDF");

      const labels = {
        title: tResume("title"),
        yourName: tResume("yourName"),
        portfolio: tResume("portfolio"),
        experience: tResume("experience"),
        education: tResume("education"),
        skills: tResume("skills"),
        languages: tResume("languages"),
        certifications: tResume("certifications"),
        projects: tResume("projects"),
        volunteering: tResume("volunteering"),
        courses: tResume("courses"),
        current: tResume("current"),
        at: tResume("at"),
        repo: tResume("repo"),
        demo: tResume("demo"),
      };

      const blob = await pdf(
        <ResumePDF data={data} colorTheme="#18181b" labels={labels} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const userName = (data.personalInfo.name || "LUME")
        .toUpperCase()
        .replace(/\s+/g, "_");
      const pdfName =
        locale === "pt" ? `CURRICULO_${userName}` : `RESUME_${userName}`;
      link.download = `${pdfName}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (resumeId) {
        await incrementDownload(resumeId);
      }
    };

    toast.promise(downloadPromise(), {
      loading: t("header.actions.generatingPdf") || "Gerando PDF...",
      success: t("header.actions.successPdf") || "Download concluído!",
      error: t("header.actions.errorPdf") || "Erro ao gerar PDF",
    });

    try {
      await downloadPromise;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [jobDescription, setJobDescription] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) setData(initialData);
    setResumeId(serverResumeId);
    setGroupId(serverGroupId);
    setSlug(initialSlug || "");
  }, [initialData, serverResumeId, serverGroupId, initialSlug]);

  const handleDataChange = useCallback((newData: ResumeData) => {
    setData({ ...newData });
  }, []);

  const handleIdGenerated = useCallback((newId: string, newGroupId: string) => {
    setResumeId(newId);
    setGroupId(newGroupId);
  }, []);

  const atsResult = useMemo(() => validateATS(data), [data]);
  const spellResult = useMemo(() => checkStrongVerbs(data), [data]);
  const matchResult = useMemo(
    () => (jobDescription ? analyzeJobMatch(data, jobDescription) : null),
    [data, jobDescription],
  );

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setData(JSON.parse(event.target?.result as string));
        toast.success(t("header.actions.importJsonSuccess"));
      } catch (error) {
        toast.error(t("header.actions.importJsonError"));
      }
    };
    reader.readAsText(file);
  };

  const handleLinkedInImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const importPromise = async () => {
      const partialData = await parseLinkedInPDF(file);
      setData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...partialData.personalInfo },
      }));
    };

    toast.promise(importPromise(), {
      loading: t("header.actions.importLinkedInInfo"),
      success: t("header.actions.importLinkedInSuccess"),
      error: t("header.actions.importLinkedInError"),
    });

    try {
      await importPromise;
    } catch (error) {
      console.error("LinkedIn import error:", error);
    }
  };

  const handleExportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const userName = (data.personalInfo.name || "LUME")
        .toUpperCase()
        .replace(/\s+/g, "_");
      link.download = `BACKUP_${userName}_${locale.toUpperCase()}.json`;

      link.click();
      toast.success(t("header.actions.exportJsonSuccess"));
    } catch (error) {
      toast.error(t("header.actions.importJsonError"));
    }
  };

  const handleShare = async () => {
    const sharePromise = async () => {
      const result = await saveResume(
        resumeId,
        data,
        data.personalInfo.name || t("title"),
        locale,
        groupId,
        slug,
      );
      setResumeId(result.id);
      setGroupId(result.groupId);
      setSlug(result.slug || "");

      const shareUrl = `${window.location.origin}/share/${result.slug || result.groupId}`;

      await navigator.clipboard.writeText(shareUrl);
    };

    toast.promise(sharePromise(), {
      loading: "Gerando link público...",
      success: t("header.actions.shareSuccess"),
      error: (err: any) => err.message || t("header.actions.shareError"),
    });

    try {
      await sharePromise;
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // @ts-ignore - View Transitions API
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // @ts-ignore
    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  const ToolsDrawerContent = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 text-left">
      <div className="lg:hidden space-y-6 pb-6 border-b border-border/20">
        <div className="flex items-center justify-between bg-muted/20 p-3 rounded-xl border border-border/40">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Tema
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-8 w-8"
          >
            {theme === "dark" ? (
              <Sun size={18} weight="duotone" />
            ) : (
              <Moon size={18} weight="duotone" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between bg-muted/20 p-3 rounded-xl border border-border/40">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Idioma
          </span>
          <LanguageSwitcher />
        </div>
      </div>

      {/* LinkedIn Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <LinkedinLogo size={14} weight="duotone" /> LinkedIn Import
        </h4>
        <div className="relative w-full group">
          <input
            type="file"
            accept=".pdf"
            onChange={handleLinkedInImport}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
          />
          <div className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 group-hover:bg-muted/20 group-hover:border-border/80">
            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
              <LinkedinLogo
                size={22}
                weight="duotone"
                className="text-muted-foreground group-hover:text-foreground"
              />
            </div>
            <div className="flex flex-col items-start leading-tight gap-1">
              <span className="text-sm font-bold text-foreground">
                {t("header.tools.importLinkedIn")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                {t("header.tools.importLinkedInDesc")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slug Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Browser size={14} weight="duotone" />{" "}
          {t("header.tools.visibilityLink")}
        </h4>
        <div className="space-y-3">
          <div className="space-y-2 text-left">
            <Label
              htmlFor="slug"
              className="text-[10px] uppercase font-bold text-muted-foreground ml-1"
            >
              Custom URL
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="seu-nome"
              className="h-12 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20"
            />
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 hover:bg-muted/20 hover:border-border/80 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
              <ShareNetwork
                size={22}
                weight="duotone"
                className="text-muted-foreground group-hover:text-foreground"
              />
            </div>
            <div className="flex flex-col items-start leading-tight gap-1">
              <span className="text-sm font-bold text-foreground">
                {t("header.tools.generateLink")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                {t("header.tools.generateLinkDesc")}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Import/Export Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <FileArrowUp size={14} weight="duotone" /> Backup & Restore
        </h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="relative w-full group">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 group-hover:bg-muted/20 group-hover:border-border/80">
              <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
                <FileArrowUp
                  size={22}
                  weight="duotone"
                  className="text-muted-foreground group-hover:text-foreground"
                />
              </div>
              <div className="flex flex-col items-start leading-tight gap-1">
                <span className="text-sm font-bold text-foreground">
                  {t("header.tools.loadJson")}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                  {t("header.tools.loadJsonDesc")}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 hover:bg-muted/20 hover:border-border/80 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
              <FileArrowDown
                size={22}
                weight="duotone"
                className="text-muted-foreground group-hover:text-foreground"
              />
            </div>
            <div className="flex flex-col items-start leading-tight gap-1">
              <span className="text-sm font-bold text-foreground">
                {t("header.tools.saveBackup")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                {t("header.tools.saveBackupDesc")}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-border/20 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
          <Info size={14} weight="duotone" /> {t("header.tools.version")}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-background text-foreground overflow-hidden text-left">
      {/* Header Mobile */}
      <header className="lg:hidden no-print h-14 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-40">
        <Logo width={80} height={20} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-muted/20"
                >
                  <Target size={20} weight="duotone" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[500px] rounded-3xl bg-background/95 backdrop-blur-2xl">
                <DialogHeader>
                  <DialogTitle>{t("header.jobMatch.title")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder={t("header.jobMatch.placeholder")}
                    className="h-[150px] rounded-2xl bg-muted/20"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  {matchResult && (
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                      <span className="text-3xl font-black text-primary">
                        {matchResult.score}%
                      </span>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-muted/20"
                >
                  <ShieldCheck
                    size={20}
                    weight="duotone"
                    className={cn(
                      (atsResult?.score || 0) > 70
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[90vw] max-w-[350px] rounded-3xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                  {t("header.healthCheck.title")}
                </h3>
                <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                  {atsResult?.suggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck
                          size={24}
                          weight="duotone"
                          className="text-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">
                          {t("header.healthCheck.successTitle")}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {t("header.healthCheck.successDescription")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    atsResult?.checks
                      .filter((c) => c.status !== "success")
                      .map((check, i) => (
                        <div
                          key={i}
                          className="p-3 bg-muted/30 rounded-xl text-[10px] text-muted-foreground"
                        >
                          {t(
                            `header.healthCheck.checks.${check.id}.${check.status}`,
                          )}
                        </div>
                      ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Show when="signed-in">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
            />
          </Show>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 bg-primary/10 text-primary"
              >
                <List size={20} weight="duotone" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] p-0">
              <SheetHeader className="p-6 border-b border-border/20 bg-primary/5">
                <SheetTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Gear size={18} weight="duotone" /> {t("header.tools.title")}
                </SheetTitle>
              </SheetHeader>
              <ToolsDrawerContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="w-full lg:w-[480px] xl:w-[540px] lg:flex-none flex-1 lg:h-full shrink-0 border-r bg-card/10 overflow-hidden relative flex flex-col text-left">
        <ResumeForm
          key={locale}
          initialData={data}
          resumeId={resumeId}
          groupId={groupId}
          onDataChange={handleDataChange}
          onIdGenerated={handleIdGenerated}
          downloadButton={
            <div className="lg:hidden w-full px-10 py-4 border-t bg-card/10">
              <Button
                disabled={isGenerating}
                onClick={handleDownload}
                className="w-full h-12 rounded-xl shadow-xl shadow-primary/20 gap-3 font-black uppercase tracking-widest text-xs"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FileArrowDown size={18} weight="duotone" />
                )}
                {isGenerating
                  ? t("header.actions.generatingPdf")
                  : t("header.actions.downloadPdf")}
              </Button>
            </div>
          }
        />
      </div>

      <div className="hidden lg:flex flex-1 flex-col bg-muted/5 relative overflow-hidden">
        {/* Floating Download Button Mobile (Removido pois preview está oculto no mobile) */}

        <header className="hidden lg:flex no-print h-16 border-b border-border/40 bg-background/50 backdrop-blur-xl items-center justify-between px-8 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <Logo width={100} height={26} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full px-4 h-9 font-bold bg-muted/40 hover:bg-muted/60 border border-border/40 transition-all text-muted-foreground hover:text-foreground"
                >
                  <Target size={18} weight="duotone" />
                  <span className="hidden lg:inline uppercase tracking-widest text-[10px]">
                    {t("header.jobMatch.button")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                    <Target
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />{" "}
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
                    weight="duotone"
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
                  {atsResult?.checks
                    .filter((c) => c.status !== "success")
                    .map((check, i) => (
                      <div
                        key={i}
                        className="p-3 bg-muted/30 rounded-xl text-[11px] text-muted-foreground border border-border/20"
                      >
                        {t(
                          `header.healthCheck.checks.${check.id}.${check.status}`,
                        )}
                      </div>
                    ))}
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-6 hidden md:block" />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun size={20} weight="duotone" />
              ) : (
                <Moon size={20} weight="duotone" />
              )}
            </Button>
            <LanguageSwitcher />

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-border/40",
                  },
                }}
              />
            </Show>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-muted/30"
                >
                  <List size={22} weight="duotone" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl p-0 flex flex-col text-left"
              >
                <SheetHeader className="p-6 border-b border-border/20 bg-primary/5">
                  <SheetTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Gear size={18} weight="duotone" />{" "}
                    {t("header.tools.title")}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Menu de ferramentas e configurações
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 text-left">
                  {/* LinkedIn Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <LinkedinLogo size={14} weight="duotone" /> LinkedIn
                      Import
                    </h4>
                    <div className="relative w-full group">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleLinkedInImport}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      <div className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 group-hover:bg-muted/20 group-hover:border-border/80">
                        <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
                          <LinkedinLogo
                            size={22}
                            weight="duotone"
                            className="text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                        <div className="flex flex-col items-start leading-tight gap-1">
                          <span className="text-sm font-bold text-foreground">
                            {t("header.tools.importLinkedIn")}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                            {t("header.tools.importLinkedInDesc")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slug Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Browser size={14} weight="duotone" />{" "}
                      {t("header.tools.visibilityLink")}
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2 text-left">
                        <Label
                          htmlFor="slug"
                          className="text-[10px] uppercase font-bold text-muted-foreground ml-1"
                        >
                          Custom URL
                        </Label>
                        <Input
                          id="slug"
                          value={slug}
                          onChange={(e) =>
                            setSlug(
                              e.target.value.toLowerCase().replace(/\s+/g, "-"),
                            )
                          }
                          placeholder="seu-nome"
                          className="h-12 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20"
                        />
                      </div>
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 hover:bg-muted/20 hover:border-border/80 group text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
                          <ShareNetwork
                            size={22}
                            weight="duotone"
                            className="text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                        <div className="flex flex-col items-start leading-tight gap-1">
                          <span className="text-sm font-bold text-foreground">
                            {t("header.tools.generateLink")}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                            {t("header.tools.generateLinkDesc")}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Import/Export Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <FileArrowUp size={14} weight="duotone" /> Backup &
                      Restore
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="relative w-full group">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 group-hover:bg-muted/20 group-hover:border-border/80">
                          <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
                            <FileArrowUp
                              size={22}
                              weight="duotone"
                              className="text-muted-foreground group-hover:text-foreground"
                            />
                          </div>
                          <div className="flex flex-col items-start leading-tight gap-1">
                            <span className="text-sm font-bold text-foreground">
                              {t("header.tools.loadJson")}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                              {t("header.tools.loadJsonDesc")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleExportJSON}
                        className="flex items-center gap-4 w-full p-4 rounded-2xl border border-border/40 bg-muted/5 transition-all duration-300 hover:bg-muted/20 hover:border-border/80 group text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-background">
                          <FileArrowDown
                            size={22}
                            weight="duotone"
                            className="text-muted-foreground group-hover:text-foreground"
                          />
                        </div>
                        <div className="flex flex-col items-start leading-tight gap-1">
                          <span className="text-sm font-bold text-foreground">
                            {t("header.tools.saveBackup")}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                            {t("header.tools.saveBackupDesc")}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/20 text-center">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                      <Info size={14} weight="duotone" />{" "}
                      {t("header.tools.version")}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden items-center justify-center">
          <div className="absolute top-4 right-8 z-40 flex items-center bg-card/95 backdrop-blur-xl rounded-full px-2 py-1.5 border border-border/40 shadow-2xl gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((v) => Math.max(0.4, v - 0.1))}
                className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
              >
                <MagnifyingGlassMinus size={16} weight="duotone" />
              </Button>
              <span className="text-[10px] font-black w-10 text-center tracking-tighter">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((v) => Math.min(1.2, v + 0.1))}
                className="h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
              >
                <MagnifyingGlassPlus size={16} weight="duotone" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-4 bg-border/40" />

            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2 rounded-full px-4 h-8 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/10"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileArrowDown size={16} weight="duotone" />
              )}
              {isGenerating
                ? t("header.actions.generatingPdf")
                : t("header.actions.pdfShort")}
            </Button>
          </div>
          <div className="absolute inset-0 overflow-auto custom-scrollbar flex items-start justify-center p-12 bg-neutral-50 dark:bg-neutral-950/50">
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none [background-image:radial-gradient(circle_at_center,#000_1px,transparent_1px)] [background-size:24px_24px] dark:[background-image:radial-gradient(circle_at_center,#fff_1px,transparent_1px)]" />
            <motion.div
              animate={{ scale: zoom }}
              className="origin-top my-8 z-10"
            >
              <div className="w-[210mm] shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden bg-white ring-1 ring-black/5 dark:ring-white/10">
                <ResumeView data={data} colorTheme="#18181b" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
