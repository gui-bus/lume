import { getResume } from "@/app/actions/resume-actions";
import { ResumeView } from "@/components/preview/ResumeView";
import { ResumeData } from "@/types/resume";
import { notFound } from "next/navigation";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const resume = await getResume(id);

  if (!resume) {
    notFound();
  }

  const data = resume.content as unknown as ResumeData;

  return (
    <main className="min-h-screen w-full bg-muted/30 py-20 canvas-grid overflow-x-hidden">
      <div className="w-full flex flex-col items-center px-4">
        <ResumeView data={data} colorTheme={resume.colorTheme} />

        {/* Branding sutil ao final do scroll */}
        <div className="mt-20 bg-background/80 backdrop-blur-md border px-6 py-2.5 rounded-full shadow-lg text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Criado com <span className="text-primary">Lume</span>
        </div>
      </div>
    </main>
  );
}
