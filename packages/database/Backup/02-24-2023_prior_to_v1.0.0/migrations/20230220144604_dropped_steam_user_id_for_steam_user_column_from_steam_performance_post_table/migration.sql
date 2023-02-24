/*
  Warnings:

  - You are about to drop the column `steamUserIdForSteamUser` on the `SteamPerformancePost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SteamPerformancePost" DROP CONSTRAINT "SteamPerformancePost_steamUserIdForSteamUser_fkey";

-- AlterTable
ALTER TABLE "SteamPerformancePost" DROP COLUMN "steamUserIdForSteamUser";
