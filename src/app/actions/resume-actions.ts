"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
  isPortfolio?: boolean,
  locale: string = "pt",
  groupId?: string,
) {
  const finalId = id || "";

  let targetGroupId = groupId;
  if (!targetGroupId && id) {
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { groupId: true },
    });
    targetGroupId = existing?.groupId || undefined;
  }

  const finalGroupId = targetGroupId || crypto.randomUUID();

  const result = await prisma.resume.upsert({
    where: {
      id: finalId,
    },
    update: {
      content: data as any,
      title,
      locale,
      groupId: finalGroupId,
      isPortfolio: isPortfolio ?? undefined,
    },
    create: {
      content: data as any,
      title,
      locale,
      groupId: finalGroupId,
      isPortfolio: isPortfolio ?? false,
    },
  });

  revalidatePath("/[locale]/share/[id]", "page");
  return result;
}

export async function getResume(id: string, locale?: string) {
  console.log(
    `[DEBUG] Buscando currículo. ID/GroupId: ${id}, Locale solicitado: ${locale}`,
  );

  try {
    if (locale) {
      // 1. Tenta buscar a versão exata do idioma para aquele groupId
      const resumeByGroup = await prisma.resume.findFirst({
        where: {
          groupId: id,
          locale: locale,
        },
      });

      if (resumeByGroup) {
        console.log(
          `[DEBUG] Encontrado por GroupId + Locale: ${resumeByGroup.id}`,
        );
        return resumeByGroup;
      }

      // 2. Se o ID passado for um ID individual e não um groupId, descobrimos o groupId dele
      const individualResume = await prisma.resume.findUnique({
        where: { id: id },
        select: { groupId: true },
      });

      if (individualResume?.groupId) {
        const localized = await prisma.resume.findFirst({
          where: {
            groupId: individualResume.groupId,
            locale: locale,
          },
        });
        if (localized) {
          console.log(
            `[DEBUG] Encontrado por GroupId do individual + Locale: ${localized.id}`,
          );
          return localized;
        }
      }
    }

    // Fallback: busca pelo ID exato ou primeiro disponível
    const fallback = await prisma.resume.findFirst({
      where: {
        OR: [{ id: id }, { groupId: id }],
      },
      orderBy: { updatedAt: "desc" },
    });

    console.log(
      `[DEBUG] Usando fallback: ${fallback?.id} (${fallback?.locale})`,
    );
    return fallback;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
}

export async function incrementView(id: string) {
  try {
    await prisma.resume.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {}
}

export async function incrementDownload(id: string | undefined) {
  if (!id) return;
  try {
    await prisma.resume.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  } catch (error) {}
}
