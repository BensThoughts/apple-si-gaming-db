-- AlterTable
ALTER TABLE "SteamPerformancePost" RENAME CONSTRAINT "PerformancePost_pkey" TO "SteamPerformancePost_pkey";

-- AddForeignKey
ALTER TABLE "SteamUserSystemSpecs" ADD CONSTRAINT "SteamUserSystemSpecs_steamUserId_fkey" FOREIGN KEY ("steamUserId") REFERENCES "SteamUser"("steamUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamUserOwnedAppPlaytime" ADD CONSTRAINT "SteamUserOwnedAppPlaytime_steamUserId_fkey" FOREIGN KEY ("steamUserId") REFERENCES "SteamUser"("steamUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamPerformancePost" ADD CONSTRAINT "SteamPerformancePost_steamUserIdForSteamUser_fkey" FOREIGN KEY ("steamUserIdForSteamUser") REFERENCES "SteamUser"("steamUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamPerformancePost" ADD CONSTRAINT "SteamPerformancePost_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamDemo" ADD CONSTRAINT "SteamDemo_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamPriceOverview" ADD CONSTRAINT "SteamPriceOverview_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamPackageGroup" ADD CONSTRAINT "SteamPackageGroup_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamPackageGroupSub" ADD CONSTRAINT "SteamPackageGroupSub_steamAppId_packageGroupName_fkey" FOREIGN KEY ("steamAppId", "packageGroupName") REFERENCES "SteamPackageGroup"("steamAppId", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamScreenshot" ADD CONSTRAINT "SteamScreenshot_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamMovie" ADD CONSTRAINT "SteamMovie_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamAchievement" ADD CONSTRAINT "SteamAchievement_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTagToSteamPerformancePost" ADD CONSTRAINT "_PostTagToSteamPerformancePost_A_fkey" FOREIGN KEY ("A") REFERENCES "PostTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostTagToSteamPerformancePost" ADD CONSTRAINT "_PostTagToSteamPerformancePost_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamPerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamCategory" ADD CONSTRAINT "_SteamAppToSteamCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamCategory" ADD CONSTRAINT "_SteamAppToSteamCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamGenre" ADD CONSTRAINT "_SteamAppToSteamGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamGenre" ADD CONSTRAINT "_SteamAppToSteamGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamUser" ADD CONSTRAINT "_SteamAppToSteamUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamUser" ADD CONSTRAINT "_SteamAppToSteamUser_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
