/*
  Warnings:

  - You are about to drop the column `label` on the `SteamGamepad` table. All the data in the column will be lost.
  - You are about to drop the column `gamepadManufacturer` on the `SteamGamepadPost` table. All the data in the column will be lost.
  - You are about to drop the column `gamepadModel` on the `SteamGamepadPost` table. All the data in the column will be lost.
  - Added the required column `description` to the `SteamGamepad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SteamGamepad" RENAME COLUMN "label" TO "description";

-- AlterTable
ALTER TABLE "SteamGamepadPost" DROP COLUMN "gamepadManufacturer",
DROP COLUMN "gamepadModel";
