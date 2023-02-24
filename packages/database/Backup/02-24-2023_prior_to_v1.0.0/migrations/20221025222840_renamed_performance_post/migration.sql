/*
  Warnings:

  - You are about to drop the `PerformancePost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PerformancePostToPostTag` table. If the table is not empty, all the data it contains will be lost.

*/
ALTER TABLE "PerformancePost" RENAME TO "SteamPerformancePost";
ALTER TABLE "_PerformancePostToPostTag" RENAME TO "_PostTagToSteamPerformancePost";
ALTER TABLE "_PostTagToSteamPerformancePost" RENAME COLUMN "A" TO "C";
ALTER TABLE "_PostTagToSteamPerformancePost" RENAME COLUMN "B" TO "D";
ALTER TABLE "_PostTagToSteamPerformancePost" RENAME COLUMN "C" TO "B";
ALTER TABLE "_PostTagToSteamPerformancePost" RENAME COLUMN "D" TO "A";

-- CreateIndex
CREATE UNIQUE INDEX "_PostTagToSteamPerformancePost_AB_unique" ON "_PostTagToSteamPerformancePost"("A", "B");

-- CreateIndex
CREATE INDEX "_PostTagToSteamPerformancePost_B_index" ON "_PostTagToSteamPerformancePost"("B");

DROP INDEX "_PerformancePostToPostTag_AB_unique";

-- CreateIndex
DROP INDEX "_PerformancePostToPostTag_B_index";
