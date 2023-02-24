/*
  Warnings:

  - Made the column `steamUserId` on table `PerformancePost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PerformancePost" ADD COLUMN     "steamUserIdForSteamUser" TEXT,
ALTER COLUMN "steamUserId" SET NOT NULL;
