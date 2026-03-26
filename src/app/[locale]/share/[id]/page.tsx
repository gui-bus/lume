import { getResume, incrementView } from "@/app/actions/resumeActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PageWrapper } from "@/components/preview/PageWrapper";
import { ResumeView } from "@/components/preview/ResumeView";
import { Logo } from "@/components/ui/Logo";
import { ResumeData } from "@/types/resume";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface SharePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id, locale } = await params;
  const resume = await getResume(id, locale);

  if (!resume) {
    notFound();
  }

  const cookieStore = await cookies();
  const viewedCookieName = `viewed_${resume.id}`;
  const hasViewed = cookieStore.get(viewedCookieName);

  if (!hasViewed) {
    incrementView(resume.id);
  }

  const data = resume.content as unknown as ResumeData;

  return (
    <>
      {!hasViewed && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.cookie = "${viewedCookieName}=true; path=/; max-age=86400; SameSite=Lax"`,
          }}
        />
      )}

      <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid overflow-y-auto overflow-x-hidden flex flex-col items-center">
        {/* Header Elegante */}
        <header className="w-full max-w-5xl px-6 py-8 flex justify-between items-center no-print">
          <Logo width={80} height={22} />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </header>

        {/* Container do Currículo */}
        <div className="flex-1 w-full flex flex-col items-center px-4 sm:px-8 pb-12">
          <PageWrapper className="my-4">
            <ResumeView data={data} colorTheme={resume.colorTheme} />
          </PageWrapper>

          {/* Branding sutil ao final */}
          <div className="mt-16 mb-8 flex items-center gap-3 bg-background/50 backdrop-blur-sm border border-border/40 px-6 py-2.5 rounded-full shadow-sm text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 no-print">
            <span>Criado com</span>
            <Logo width={60} height={16} className="opacity-60" />
          </div>
        </div>
      </main>
    </>
  );
}
