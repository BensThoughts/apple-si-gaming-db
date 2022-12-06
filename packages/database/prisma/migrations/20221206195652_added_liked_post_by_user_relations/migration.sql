-- CreateTable
CREATE TABLE "LikedPostByUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "performancePostId" TEXT NOT NULL,

    CONSTRAINT "LikedPostByUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikedPostByUser_steamUserId_performancePostId_key" ON "LikedPostByUser"("steamUserId", "performancePostId");

-- AddForeignKey
ALTER TABLE "LikedPostByUser" ADD CONSTRAINT "LikedPostByUser_steamUserId_fkey" FOREIGN KEY ("steamUserId") REFERENCES "SteamUser"("steamUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPostByUser" ADD CONSTRAINT "LikedPostByUser_performancePostId_fkey" FOREIGN KEY ("performancePostId") REFERENCES "SteamPerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
