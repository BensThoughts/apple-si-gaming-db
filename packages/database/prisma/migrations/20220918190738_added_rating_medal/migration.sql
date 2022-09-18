/*
  Warnings:

  - Added the required column `ratingMedal` to the `PerformancePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PerformancePost" ADD COLUMN     "ratingMedal" TEXT NOT NULL;
