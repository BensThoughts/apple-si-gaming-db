-- AlterTable
ALTER TABLE "SteamUser" ADD COLUMN     "siteUserStatsId" TEXT;

-- CreateTable
CREATE TABLE "SiteAchievement" (
    "achievementId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "SiteAchievement_pkey" PRIMARY KEY ("achievementId")
);

-- CreateTable
CREATE TABLE "SiteUserStats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "numLogins" INTEGER NOT NULL DEFAULT 0,
    "numPerfPosts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteUserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SiteAchievementToSteamUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteUserStats_steamUserId_key" ON "SiteUserStats"("steamUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_SiteAchievementToSteamUser_AB_unique" ON "_SiteAchievementToSteamUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SiteAchievementToSteamUser_B_index" ON "_SiteAchievementToSteamUser"("B");

-- AddForeignKey
ALTER TABLE "SiteUserStats" ADD CONSTRAINT "SiteUserStats_steamUserId_fkey" FOREIGN KEY ("steamUserId") REFERENCES "SteamUser"("steamUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteAchievementToSteamUser" ADD CONSTRAINT "_SiteAchievementToSteamUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SiteAchievement"("achievementId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiteAchievementToSteamUser" ADD CONSTRAINT "_SiteAchievementToSteamUser_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
