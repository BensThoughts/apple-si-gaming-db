/*
  Warnings:

  - You are about to drop the column `systemName` on the `PerformancePost` table. All the data in the column will be lost.
  - Added the required column `avatarMedium` to the `PerformancePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `PerformancePost` table without a default value. This is not possible if the table is not empty.

*/

DELETE FROM "PerformancePost";

-- AlterTable
ALTER TABLE "PerformancePost" DROP COLUMN "systemName",
ADD COLUMN     "avatarMedium" TEXT NOT NULL,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "systemCpuBrand" TEXT,
ADD COLUMN     "systemManufacturer" TEXT,
ADD COLUMN     "systemMemoryRAM" TEXT,
ADD COLUMN     "systemModel" TEXT,
ADD COLUMN     "systemOsVersion" TEXT,
ADD COLUMN     "systemVideoDriver" TEXT,
ADD COLUMN     "systemVideoDriverVersion" TEXT,
ADD COLUMN     "systemVideoPrimaryVRAM" TEXT,
ALTER COLUMN "steamUserId" DROP NOT NULL;
