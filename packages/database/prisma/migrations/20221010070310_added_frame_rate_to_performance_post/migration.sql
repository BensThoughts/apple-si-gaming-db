-- CreateEnum
CREATE TYPE "FrameRate" AS ENUM ('VeryLow', 'Low', 'Medium', 'High', 'VeryHigh');

-- AlterTable
ALTER TABLE "PerformancePost" ADD COLUMN     "frameRateAverage" "FrameRate",
ADD COLUMN     "frameRateStutters" BOOLEAN;
