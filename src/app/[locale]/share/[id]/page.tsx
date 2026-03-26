import { getResume } from "@/app/actions/resumeActions";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SharePageClient from "./SharePageClient";

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
  const hasViewed = !!cookieStore.get(viewedCookieName);

  return (
    <SharePageClient
      resume={resume}
      hasViewed={hasViewed}
      viewedCookieName={viewedCookieName}
    />
  );
}
