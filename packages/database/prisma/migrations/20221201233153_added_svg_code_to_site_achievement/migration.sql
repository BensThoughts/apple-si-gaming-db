/*
  Warnings:

  - Added the required column `svgCode` to the `SiteAchievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SiteAchievement" ADD COLUMN     "svgCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SiteUserStats" ADD COLUMN     "numSystemsCreated" INTEGER NOT NULL DEFAULT 0;
