import { getResume, incrementView } from "@/app/actions/resumeActions";
import { ResumeView } from "@/components/preview/ResumeView";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ResumeData } from "@/types/resume";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Logo } from "@/components/ui/Logo";

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
      <main className="min-h-screen w-full bg-muted/30 py-20 canvas-grid overflow-x-hidden">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <div className="w-full flex flex-col items-center px-4">
          <ResumeView data={data} colorTheme={resume.colorTheme} />

          {/* Branding sutil ao final do scroll */}
          <div className="mt-20 flex items-center gap-3 bg-background/80 backdrop-blur-md border px-6 py-2.5 rounded-full shadow-lg text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span>Criado com</span>
            <Logo width={60} height={16} />
          </div>
        </div>
      </main>
    </>
  );
}
