"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  saveResume,
  getResume,
  incrementDownload,
} from "@/app/actions/resume-actions";
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
import { UserButton, SignInButton, SignUpButton, Show } from "@clerk/nextjs";

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

export function EditorView() {
  const t = useTranslations();
  const locale = useLocale();
  const [data, setData] = useState<ResumeData>(defaultData);
  const [colorTheme, setColorTheme] = useState("#18181b");
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [spellResult, setSpellResult] = useState<SpellCheckResult | null>(null);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [analytics, setAnalytics] = useState({ views: 0, downloads: 0 });

  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`resume-draft-${locale}`);
    const savedId = localStorage.getItem(`resume-id-${locale}`);
    const savedColor = localStorage.getItem("resume-color");

    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {}
    } else {
      setData(defaultData);
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
    } else {
      setResumeId(undefined);
      setIsPortfolio(false);
      setAnalytics({ views: 0, downloads: 0 });
    }
  }, [locale]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("resume-color", colorTheme);
      setAtsResult(validateATS(data));
      setSpellResult(checkStrongVerbs(data));

      if (jobDescription) {
        setMatchResult(analyzeJobMatch(data, jobDescription));
      }
    }
  }, [colorTheme, data, mounted, jobDescription]);

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
    try {
      toast.info(t("header.actions.importLinkedInInfo"));
      const partialData = await parseLinkedInPDF(file);
      setData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...partialData.personalInfo },
      }));
      toast.success(t("header.actions.importLinkedInSuccess"));
    } catch (error) {
      toast.error(t("header.actions.importLinkedInError"));
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = t("header.export.jsonFilename", {
      name: data.personalInfo.name || "lume",
    });
    link.click();
    toast.success(t("header.actions.exportJsonSuccess"));
  };

  const handleShare = async () => {
    try {
      const groupId = localStorage.getItem("resume-group-id");
      const result = await saveResume(
        resumeId,
        data,
        t("common.title"),
        isPortfolio,
        locale,
        groupId || undefined,
      );
      setResumeId(result.id);
      if (result.groupId) {
        localStorage.setItem("resume-group-id", result.groupId);
      }
      localStorage.setItem(`resume-id-${locale}`, result.id);
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/${result.groupId || result.id}`,
      );
      toast.success(t("header.actions.shareSuccess"));
    } catch (error) {
      toast.error(t("header.actions.shareError"));
    }
  };

  const togglePortfolio = async () => {
    const newValue = !isPortfolio;
    setIsPortfolio(newValue);
    if (resumeId) {
      const groupId = localStorage.getItem("resume-group-id");
      const result = await saveResume(
        resumeId,
        data,
        t("common.myResume"),
        newValue,
        locale,
        groupId || undefined,
      );
      if (result.groupId) {
        localStorage.setItem("resume-group-id", result.groupId);
      }
      toast.success(
        newValue
          ? t("header.actions.portfolioEnabled")
          : t("header.actions.portfolioDisabled"),
      );
    }
  };

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="no-print h-16 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center group cursor-pointer select-none"
            whileHover="hover"
          >
            <span className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 transition-all duration-500 group-hover:from-primary group-hover:to-primary/70">
              Lume
            </span>
          </motion.div>
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
                <div className="space-y-3">
                  <Textarea
                    placeholder={t("header.jobMatch.placeholder")}
                    className="h-[200px] rounded-2xl text-sm bg-muted/20 border-border/40 focus:ring-primary/20 transition-all resize-none p-4 custom-scrollbar"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                      {t("header.jobMatch.charCount", {
                        count: jobDescription.length,
                      })}
                    </span>
                    {jobDescription && (
                      <button
                        onClick={() => {
                          setJobDescription("");
                          setMatchResult(null);
                        }}
                        className="text-[10px] font-bold uppercase text-primary hover:underline"
                      >
                        {t("header.jobMatch.clear")}
                      </button>
                    )}
                  </div>
                </div>

                {matchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          {t("header.jobMatch.technicalMatch")}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {t("header.jobMatch.basedOnKeywords")}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-4xl font-black tracking-tighter",
                          matchResult.score > 70
                            ? "text-emerald-500"
                            : matchResult.score > 40
                              ? "text-amber-500"
                              : "text-rose-500",
                        )}
                      >
                        {matchResult.score}%
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {matchResult.missingKeywords.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                            <WarningCircle size={14} />{" "}
                            {t("header.jobMatch.missingKeywords")}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {matchResult.missingKeywords.map((k, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/5 text-rose-600 border border-rose-500/10 text-[9px] font-bold uppercase"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {matchResult.matchingKeywords.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle size={14} />{" "}
                            {t("header.jobMatch.matchingKeywords")}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {matchResult.matchingKeywords.map((k, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 text-[9px] font-bold uppercase"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2.5 px-4 py-2 bg-muted/40 hover:bg-muted/60 border border-border/40 rounded-full transition-all duration-300 group shadow-sm text-muted-foreground hover:text-foreground">
                <div className="relative">
                  <MagicWand
                    size={18}
                    weight="bold"
                    className={cn(
                      "transition-colors duration-500",
                      spellResult?.hasIssues
                        ? "text-amber-500 animate-pulse"
                        : "group-hover:text-primary",
                    )}
                  />
                  {spellResult?.hasIssues && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="h-4 w-px bg-border/60" />
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
                    {t("common.atsScore", { score: atsResult?.score ?? 0 })}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[340px] md:w-[380px] p-0 rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl overflow-hidden"
              align="center"
            >
              <div className="bg-primary/5 p-4 border-b border-border/40">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                  <ShieldCheck size={16} weight="bold" />{" "}
                  {t("header.healthCheck.title")}
                </h3>
              </div>
              <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-3 text-left">
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {t("header.healthCheck.atsStructure")}
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
                  </div>
                </div>
                {spellResult?.hasIssues && (
                  <div className="space-y-4 text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {t("header.healthCheck.strongVerbs")}
                    </span>
                    <div className="space-y-4">
                      {spellResult.suggestions.map((s, i) => (
                        <div key={i} className="space-y-3">
                          <div className="text-[10px] font-black text-primary/70 uppercase">
                            {s.section}
                          </div>
                          {s.found.map((f, j) => (
                            <div
                              key={j}
                              className="p-4 bg-background border border-border/60 rounded-2xl shadow-sm"
                            >
                              <div className="text-[11px] text-muted-foreground mb-3 leading-relaxed italic">
                                "{f.context}"
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[9px] font-black text-emerald-500 uppercase">
                                  {t("header.healthCheck.suggestionsLabel")}
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
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-9 w-9"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: colorTheme }}
                  />
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
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          <div className="mx-1">
            <LanguageSwitcher />
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <div className="flex items-center gap-2 mr-2">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-full"
                  >
                    {t("header.auth.signIn")}
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-full shadow-lg shadow-primary/10"
                  >
                    {t("header.auth.signUp")}
                  </Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="mr-2">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 border border-border/40",
                    },
                  }}
                />
              </div>
            </Show>

            <AnimatePresence mode="wait">
              <motion.div key={JSON.stringify(data) + colorTheme}>
                <PDFDownloadLink
                  document={<ResumePDF data={data} colorTheme={colorTheme} />}
                  fileName={t("header.export.pdfFilename", {
                    name: data.personalInfo.name || "lume",
                  })}
                >
                  {({ loading }) => (
                    <Button
                      size="sm"
                      className="gap-2 rounded-full px-4 md:px-6 h-9 font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all"
                      disabled={loading}
                      onClick={() => incrementDownload(resumeId)}
                    >
                      <FileArrowDown size={18} weight="bold" />
                      <span className="hidden sm:inline">
                        {loading
                          ? t("header.actions.generatingPdf")
                          : t("header.actions.downloadPdf")}
                      </span>
                      <span className="sm:hidden">
                        {t("header.actions.pdfShort")}
                      </span>
                    </Button>
                  )}
                </PDFDownloadLink>
              </motion.div>
            </AnimatePresence>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-muted/30 hover:bg-muted/50 border border-border/20"
                >
                  <List size={22} weight="bold" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-xl border-l border-border/40 flex flex-col"
              >
                <SheetHeader className="p-6 border-b border-border/20 bg-primary/5">
                  <SheetTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Gear size={18} /> {t("header.tools.title")}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 text-left">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <FileArrowUp size={14} /> {t("header.tools.importExport")}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="relative w-full text-left">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleLinkedInImport}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 rounded-xl py-6 border-border/40 hover:bg-[#0A66C2]/5 hover:text-[#0A66C2] transition-colors"
                        >
                          <LinkedinLogo size={20} weight="fill" />
                          <div className="flex flex-col items-start leading-tight text-left">
                            <span className="text-sm font-bold">
                              {t("header.tools.importLinkedIn")}
                            </span>
                            <span className="text-[10px] opacity-60">
                              {t("header.tools.importLinkedInDesc")}
                            </span>
                          </div>
                        </Button>
                      </div>
                      <div className="relative w-full text-left">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 rounded-xl py-6 border-border/40"
                        >
                          <FileArrowUp size={20} />
                          <div className="flex flex-col items-start leading-tight text-left">
                            <span className="text-sm font-bold">
                              {t("header.tools.loadJson")}
                            </span>
                            <span className="text-[10px] opacity-60">
                              {t("header.tools.loadJsonDesc")}
                            </span>
                          </div>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleExportJSON}
                        className="w-full justify-start gap-3 rounded-xl py-6 border-border/40"
                      >
                        <FileArrowDown size={20} />
                        <div className="flex flex-col items-start leading-tight text-left">
                          <span className="text-sm font-bold">
                            {t("header.tools.saveBackup")}
                          </span>
                          <span className="text-[10px] opacity-60">
                            {t("header.tools.saveBackupDesc")}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <ShareNetwork size={14} />{" "}
                      {t("header.tools.visibilityLink")}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="w-full justify-start gap-3 rounded-xl py-6 border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                      >
                        <ShareNetwork
                          size={20}
                          weight="duotone"
                          className="text-primary"
                        />
                        <div className="flex flex-col items-start leading-tight text-left">
                          <span className="text-sm font-bold">
                            {t("header.tools.generateLink")}
                          </span>
                          <span className="text-[10px] opacity-60">
                            {t("header.tools.generateLinkDesc")}
                          </span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={togglePortfolio}
                        className={cn(
                          "w-full justify-start gap-3 rounded-xl py-6 border-border/40 transition-all text-left",
                          isPortfolio &&
                            "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
                        )}
                      >
                        <Browser
                          size={20}
                          weight={isPortfolio ? "fill" : "regular"}
                        />
                        <div className="flex flex-col items-start leading-tight text-left">
                          <span className="text-sm font-bold">
                            {isPortfolio
                              ? t("header.tools.portfolioActive")
                              : t("header.tools.portfolioActivate")}
                          </span>
                          <span className="text-[10px] opacity-60">
                            {t("header.tools.portfolioDesc")}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {resumeId && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <ChartLineUp size={14} /> {t("header.tools.metrics")}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 text-center">
                          <span className="block text-2xl font-black text-primary">
                            {analytics.views}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {t("header.tools.views")}
                          </span>
                        </div>
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 text-center">
                          <span className="block text-2xl font-black text-emerald-500">
                            {analytics.downloads}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {t("header.tools.downloads")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-border/20 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                      <Info size={14} /> {t("header.tools.version")}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
        </div>

        <div className="hidden lg:flex flex-1 bg-muted/5 relative overflow-hidden items-center justify-center">
          <div className="absolute top-4 right-8 z-50 flex items-center bg-muted/30 hover:bg-muted/50 rounded-full px-1 py-1 border border-border/30 backdrop-blur-md transition-all">
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
