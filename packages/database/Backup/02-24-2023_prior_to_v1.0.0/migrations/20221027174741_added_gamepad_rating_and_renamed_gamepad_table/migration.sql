/*
  Warnings:

  - You are about to drop the column `steamGamepadId` on the `SteamPerformancePost` table. All the data in the column will be lost.
  - You are about to drop the `SteamGamepad` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GamepadRating" AS ENUM ('GamepadBorked', 'GamepadBronze', 'GamepadSilver', 'GamepadGold', 'GamepadPlatinum');

-- DropForeignKey
ALTER TABLE "SteamPerformancePost" DROP CONSTRAINT "SteamPerformancePost_steamGamepadId_fkey";

-- AlterTable
ALTER TABLE "SteamPerformancePost" DROP COLUMN "steamGamepadId",
ADD COLUMN     "gamepadId" INTEGER,
ADD COLUMN     "gamepadRating" "GamepadRating";

-- DropTable
DROP TABLE "SteamGamepad";

-- CreateTable
CREATE TABLE "GamepadMetadata" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gamepadId" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GamepadMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GamepadMetadata_gamepadId_key" ON "GamepadMetadata"("gamepadId");

-- CreateIndex
CREATE UNIQUE INDEX "GamepadMetadata_manufacturer_model_key" ON "GamepadMetadata"("manufacturer", "model");

-- AddForeignKey
ALTER TABLE "SteamPerformancePost" ADD CONSTRAINT "SteamPerformancePost_gamepadId_fkey" FOREIGN KEY ("gamepadId") REFERENCES "GamepadMetadata"("gamepadId") ON DELETE SET NULL ON UPDATE CASCADE;
