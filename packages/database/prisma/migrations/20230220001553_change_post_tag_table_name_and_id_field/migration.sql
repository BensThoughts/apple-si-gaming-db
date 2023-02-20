/*
  Warnings:

  - You are about to drop the `PostTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostTagToSteamPerformancePost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostTagToSteamPerformancePost" DROP CONSTRAINT "_PostTagToSteamPerformancePost_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostTagToSteamPerformancePost" DROP CONSTRAINT "_PostTagToSteamPerformancePost_B_fkey";

-- DropTable
DROP TABLE "PostTag";

-- DropTable
DROP TABLE "_PostTagToSteamPerformancePost";

-- CreateTable
CREATE TABLE "PerformancePostTag" (
    "postTagId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PerformancePostTag_pkey" PRIMARY KEY ("postTagId")
);

-- CreateTable
CREATE TABLE "_PerformancePostTagToSteamPerformancePost" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PerformancePostTagToSteamPerformancePost_AB_unique" ON "_PerformancePostTagToSteamPerformancePost"("A", "B");

-- CreateIndex
CREATE INDEX "_PerformancePostTagToSteamPerformancePost_B_index" ON "_PerformancePostTagToSteamPerformancePost"("B");

-- AddForeignKey
ALTER TABLE "_PerformancePostTagToSteamPerformancePost" ADD CONSTRAINT "_PerformancePostTagToSteamPerformancePost_A_fkey" FOREIGN KEY ("A") REFERENCES "PerformancePostTag"("postTagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerformancePostTagToSteamPerformancePost" ADD CONSTRAINT "_PerformancePostTagToSteamPerformancePost_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamPerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
