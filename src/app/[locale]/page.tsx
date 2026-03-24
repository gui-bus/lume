import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditorView } from "@/components/editor/EditorView";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  return <EditorView />;
}
