import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditorView } from "@/components/editor/EditorView";
import { getResume, listUserResumes } from "@/app/actions/resume-actions";
import { ResumeData } from "@/types/resume";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;
  const { id } = await searchParams;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  let initialData = null;
  let resumeId: string | undefined = undefined;
  let groupId: string | undefined = id;

  if (id) {
    const res = await getResume(id, locale);
    if (res) {
      initialData = res.content as unknown as ResumeData;
      resumeId = res.id;
      groupId = res.groupId ?? undefined;
    }
  } else {
    const userResumes = await listUserResumes();
    if (userResumes.length > 0) {
      const latest = userResumes[0];
      const res = await getResume(latest.groupId, locale);
      if (res) {
        initialData = res.content as unknown as ResumeData;
        resumeId = res.id;
        groupId = res.groupId ?? undefined;
      } else {
        groupId = latest.groupId ?? undefined;
      }
    }
  }

  return (
    <EditorView
      initialData={initialData || undefined}
      resumeId={resumeId}
      groupId={groupId}
    />
  );
}
