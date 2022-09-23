/*
  Warnings:

  - Added the required column `ratingMedal` to the `PerformancePost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RatingMedal" AS ENUM ('Borked', 'Bronze', 'Silver', 'Gold', 'Platinum');

-- DropTable
DROP TABLE "PerformancePost";

-- CreateTable
CREATE TABLE "PerformancePost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "postText" TEXT NOT NULL,
    "ratingMedal" "RatingMedal" NOT NULL,

    CONSTRAINT "PerformancePost_pkey" PRIMARY KEY ("id")
);
