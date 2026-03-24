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
  slug?: string,
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

  // Verifica se o slug já está em uso por outro grupo
  if (slug) {
    const slugExists = await prisma.resume.findFirst({
      where: {
        slug,
        NOT: { groupId: finalGroupId },
      },
    });
    if (slugExists) {
      throw new Error(
        "Este link personalizado já está em uso por outro usuário.",
      );
    }
  }

  // Busca manual para separar idiomas corretamente
  const existingVersion = await prisma.resume.findFirst({
    where: {
      groupId: finalGroupId,
      locale: locale,
      userId: userId,
    },
  });

  let result;

  if (existingVersion) {
    result = await prisma.resume.update({
      where: { id: existingVersion.id },
      data: {
        content: data as any,
        title,
        isPortfolio: isPortfolio ?? undefined,
        slug: slug || undefined,
      },
    });
  } else {
    result = await prisma.resume.create({
      data: {
        content: data as any,
        title,
        locale,
        groupId: finalGroupId,
        isPortfolio: isPortfolio ?? false,
        userId,
        slug: slug || undefined,
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

export async function getResume(identifier: string, locale?: string) {
  try {
    // 1. Tenta buscar por SLUG primeiro
    const bySlug = await prisma.resume.findFirst({
      where: { slug: identifier },
    });

    if (bySlug) {
      // Se o slug encontrado for do idioma certo, retorna ele
      if (!locale || bySlug.locale === locale) return bySlug;

      // Se o slug for de outro idioma, buscamos a versão correta no MESMO GRUPO
      const localized = await prisma.resume.findFirst({
        where: {
          groupId: bySlug.groupId,
          locale: locale,
        },
      });

      // Retorna a versão traduzida se existir, ou o rascunho original se não
      return localized || bySlug;
    }

    // 2. Busca por GROUP ID + LOCALE (Para links UUID padrão)
    if (locale) {
      const byGroup = await prisma.resume.findFirst({
        where: {
          groupId: identifier,
          locale: locale,
        },
      });
      if (byGroup) return byGroup;
    }

    // 3. Fallback: Busca por ID individual
    const byId = await prisma.resume.findUnique({ where: { id: identifier } });
    if (byId) {
      if (locale && byId.locale !== locale) {
        const localized = await prisma.resume.findFirst({
          where: { groupId: byId.groupId, locale },
        });
        return localized || byId;
      }
      return byId;
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
