/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,locale]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'pt',
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "colorTheme" SET DEFAULT '#18181b';

-- CreateIndex
CREATE UNIQUE INDEX "Resume_slug_key" ON "Resume"("slug");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_groupId_locale_key" ON "Resume"("groupId", "locale");
