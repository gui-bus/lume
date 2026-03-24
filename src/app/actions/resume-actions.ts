"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
  isPortfolio?: boolean,
) {
  // Busca o estado atual se não for provido, para não sobrescrever com o default da função
  let currentPortfolio = isPortfolio;
  if (id && currentPortfolio === undefined) {
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { isPortfolio: true },
    });
    currentPortfolio = existing?.isPortfolio ?? false;
  }

  const result = await prisma.resume.upsert({
    where: {
      id: id || "",
    },
    update: {
      content: data as any,
      title,
      isPortfolio: currentPortfolio ?? false,
    },
    create: {
      content: data as any,
      title,
      isPortfolio: currentPortfolio ?? false,
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

export async function incrementView(id: string) {
  try {
    await prisma.resume.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to increment view", error);
  }
}

export async function incrementDownload(id: string | undefined) {
  if (!id) return;
  try {
    await prisma.resume.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to increment download", error);
  }
}
