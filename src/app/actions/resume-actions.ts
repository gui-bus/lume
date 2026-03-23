"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
) {
  const result = await prisma.resume.upsert({
    where: {
      id: id || "",
    },
    update: {
      content: data as any,
      title,
    },
    create: {
      content: data as any,
      title,
    },
  });

  revalidatePath("/");
  return result;
}

export async function getResume(id: string) {
  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  return resume;
}
