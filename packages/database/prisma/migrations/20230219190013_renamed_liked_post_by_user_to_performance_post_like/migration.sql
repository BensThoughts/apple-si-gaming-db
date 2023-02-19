/*
  Warnings:

  - You are about to drop the `LikedPostByUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedPostByUser" DROP CONSTRAINT "LikedPostByUser_performancePostId_fkey";

-- DropForeignKey
ALTER TABLE "LikedPostByUser" DROP CONSTRAINT "LikedPostByUser_steamUserId_fkey";

-- DropTable
DROP TABLE "LikedPostByUser";

-- CreateTable
CREATE TABLE "PerformancePostLike" (
    "performancePostLikeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "performancePostId" TEXT NOT NULL,

    CONSTRAINT "PerformancePostLike_pkey" PRIMARY KEY ("performancePostLikeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerformancePostLike_steamUserId_performancePostId_key" ON "PerformancePostLike"("steamUserId", "performancePostId");

-- AddForeignKey
ALTER TABLE "PerformancePostLike" ADD CONSTRAINT "PerformancePostLike_steamUserId_fkey" FOREIGN KEY ("steamUserId") REFERENCES "SteamUser"("steamUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePostLike" ADD CONSTRAINT "PerformancePostLike_performancePostId_fkey" FOREIGN KEY ("performancePostId") REFERENCES "SteamPerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
