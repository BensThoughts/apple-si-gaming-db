/*
  Warnings:

  - A unique constraint covering the columns `[systemName]` on the table `SteamUserSystemSpecs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SteamUserSystemSpecs_systemName_key" ON "SteamUserSystemSpecs"("systemName");
