"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
  isPortfolio?: boolean,
  locale: string = "pt",
  groupId?: string,
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Usuário não autenticado");
  }

  // Sincronizar Usuário
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`.trim(),
    },
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`.trim(),
    },
  });

  const finalGroupId = groupId || crypto.randomUUID();

  // Busca manual para evitar erro de 'Unknown argument groupId_locale'
  const existingVersion = await prisma.resume.findFirst({
    where: {
      groupId: finalGroupId,
      locale: locale,
      userId: userId,
    },
  });

  let result;

  if (existingVersion) {
    // Atualiza o existente
    result = await prisma.resume.update({
      where: { id: existingVersion.id },
      data: {
        content: data as any,
        title,
        isPortfolio: isPortfolio ?? undefined,
      },
    });
  } else {
    // Cria um novo
    result = await prisma.resume.create({
      data: {
        content: data as any,
        title,
        locale,
        groupId: finalGroupId,
        isPortfolio: isPortfolio ?? false,
        userId,
      },
    });
  }

  return result;
}

export async function listUserResumes() {
  const { userId } = await auth();
  if (!userId) return [];

  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const uniqueGroups = new Map();
  resumes.forEach((r) => {
    if (!uniqueGroups.has(r.groupId)) {
      uniqueGroups.set(r.groupId, r);
    }
  });

  return Array.from(uniqueGroups.values());
}

export async function deleteResume(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const resume = await prisma.resume.findUnique({ where: { id } });
  if (resume?.groupId) {
    await prisma.resume.deleteMany({
      where: { groupId: resume.groupId, userId },
    });
  }

  revalidatePath("/", "layout");
}

export async function getResume(id: string, locale?: string) {
  try {
    // Busca prioritária por GroupId + Locale usando findFirst para evitar erros de validação
    if (locale) {
      const resume = await prisma.resume.findFirst({
        where: {
          groupId: id,
          locale: locale,
        },
      });
      if (resume) return resume;
    }

    // Fallback: ID individual
    const individual = await prisma.resume.findUnique({ where: { id } });
    if (individual) {
      if (locale && individual.locale !== locale) {
        const localized = await prisma.resume.findFirst({
          where: {
            groupId: individual.groupId,
            locale: locale,
          },
        });
        return localized || null;
      }
      return individual;
    }

    return null;
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
