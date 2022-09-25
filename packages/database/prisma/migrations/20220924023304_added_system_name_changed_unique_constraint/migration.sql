/*
  Warnings:

  - A unique constraint covering the columns `[systemName,steamUserId]` on the table `SteamUserSystemSpecs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `systemName` to the `SteamUserSystemSpecs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SteamUserSystemSpecs_steamUserId_key";

-- AlterTable
ALTER TABLE "SteamUserSystemSpecs" ADD COLUMN     "systemName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SteamUserSystemSpecs_systemName_steamUserId_key" ON "SteamUserSystemSpecs"("systemName", "steamUserId");
