/*
  Warnings:

  - Added the required column `systemName` to the `PerformancePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
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
    "systemName" TEXT NOT NULL,

    CONSTRAINT "PerformancePost_pkey" PRIMARY KEY ("id")
);
