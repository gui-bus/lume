"use server";

import prisma from "@/lib/prisma";
import { ResumeData } from "@/types/resume";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";

export async function saveResume(
  id: string | undefined,
  data: ResumeData,
  title: string = "Meu Currículo",
  locale: string = "pt",
  groupId?: string,
  slug?: string,
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Usuário não autenticado");
  }

  const email = user.emailAddresses[0].emailAddress;
  const name = `${user.firstName} ${user.lastName}`.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: userId }, { email }],
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: { id: userId, email, name },
    });
  } else if (existingUser.id !== userId) {
    await prisma.$transaction([
      prisma.resume.updateMany({
        where: { userId: existingUser.id },
        data: { userId: userId },
      }),
      prisma.user.delete({ where: { id: existingUser.id } }),
      prisma.user.create({
        data: { id: userId, email, name },
      }),
    ]);
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { email, name },
    });
  }

  const finalGroupId = groupId || crypto.randomUUID();

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

  const uniqueGroups = new Map<string, (typeof resumes)[0]>();
  resumes.forEach((r: (typeof resumes)[0]) => {
    if (r.groupId && !uniqueGroups.has(r.groupId)) {
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
    const bySlug = await prisma.resume.findFirst({
      where: { slug: identifier },
    });

    if (bySlug) {
      if (!locale || bySlug.locale === locale) return bySlug;

      const localized = await prisma.resume.findFirst({
        where: {
          groupId: bySlug.groupId,
          locale: locale,
        },
      });

      return localized || bySlug;
    }

    if (locale) {
      const byGroup = await prisma.resume.findFirst({
        where: {
          groupId: identifier,
          locale: locale,
        },
      });
      if (byGroup) return byGroup;
    }

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
