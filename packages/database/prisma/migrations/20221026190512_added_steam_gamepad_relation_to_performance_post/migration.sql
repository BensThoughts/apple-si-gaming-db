-- AlterTable
ALTER TABLE "SteamPerformancePost" ADD COLUMN     "steamGamepadId" INTEGER;

-- AddForeignKey
ALTER TABLE "SteamPerformancePost" ADD CONSTRAINT "SteamPerformancePost_steamGamepadId_fkey" FOREIGN KEY ("steamGamepadId") REFERENCES "SteamGamepad"("gamepadId") ON DELETE SET NULL ON UPDATE CASCADE;
