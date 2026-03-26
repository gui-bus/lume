"use client";

import { incrementDownload, incrementView } from "@/app/actions/resumeActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PageWrapper } from "@/components/preview/PageWrapper";
import { ResumeView } from "@/components/preview/ResumeView";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { ResumeData } from "@/types/resume";
import { FileArrowDown } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SharePageClientProps {
  resume: {
    id: string;
    content: any;
    colorTheme?: string;
  };
  hasViewed: boolean;
  viewedCookieName: string;
}

export default function SharePageClient({
  resume,
  hasViewed,
  viewedCookieName,
}: SharePageClientProps) {
  const t = useTranslations("common");
  const tResume = useTranslations("common.resume");
  const locale = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);

  const data = resume.content as unknown as ResumeData;

  useEffect(() => {
    if (!hasViewed) {
      incrementView(resume.id);
      document.cookie = `${viewedCookieName}=true; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [hasViewed, resume.id, viewedCookieName]);

  const handleDownload = async () => {
    if (!data) return;

    setIsGenerating(true);

    const downloadPromise = async () => {
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
        langLabels: {
          conversation: tResume("extras.languages.conversation"),
          writing: tResume("extras.languages.writing"),
          reading: tResume("extras.languages.reading"),
        },
        langLevels: {
          basico: tResume("extras.languages.levels.basico"),
          intermediario: tResume("extras.languages.levels.intermediario"),
          avancado: tResume("extras.languages.levels.avancado"),
          fluente: tResume("extras.languages.levels.fluente"),
          nativo: tResume("extras.languages.levels.nativo"),
        },
      };

      const blob = await pdf(
        <ResumePDF
          data={data}
          colorTheme={resume.colorTheme || "#18181b"}
          labels={labels}
        />,
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

      await incrementDownload(resume.id);
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

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid overflow-y-auto overflow-x-hidden flex flex-col items-center">
      {/* Header Elegante */}
      <header className="w-full max-w-5xl px-6 py-8 flex justify-between items-center no-print">
        <Link href="/sign-in">
          <Logo width={80} height={22} />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2 rounded-full px-4 h-9 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/10"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileArrowDown size={16} weight="duotone" />
            )}
            {isGenerating
              ? t("header.actions.generatingPdf")
              : t("header.actions.downloadPdf")}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Container do Currículo */}
      <div className="flex-1 w-full flex flex-col items-center px-4 sm:px-8 pb-12">
        <PageWrapper className="my-4">
          <ResumeView data={data} colorTheme={resume.colorTheme} />
        </PageWrapper>

        {/* Branding sutil ao final */}
        <Link
          href="/sign-in"
          className="mt-16 mb-8 flex items-center gap-3 bg-background/50 backdrop-blur-sm border border-border/40 px-6 py-2.5 rounded-full shadow-sm text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 no-print hover:bg-background/80 hover:text-primary transition-all group"
        >
          <span>Criado com</span>
          <Logo
            width={60}
            height={16}
            className="opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      </div>
    </main>
  );
}
