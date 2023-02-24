-- CreateEnum
CREATE TYPE "RatingMedal" AS ENUM ('Borked', 'Bronze', 'Silver', 'Gold', 'Platinum');

-- CreateEnum
CREATE TYPE "FrameRate" AS ENUM ('VeryLow', 'Low', 'Medium', 'High', 'VeryHigh');

-- CreateEnum
CREATE TYPE "GamepadRating" AS ENUM ('GamepadBorked', 'GamepadBronze', 'GamepadSilver', 'GamepadGold', 'GamepadPlatinum');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId64" BIGINT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSystemSpecs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userProfileId" INTEGER NOT NULL,
    "systemName" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "formFactor" TEXT,
    "cpuVendor" TEXT,
    "cpuBrand" TEXT,
    "cpuFamily" TEXT,
    "cpuModel" TEXT,
    "cpuStepping" TEXT,
    "cpuType" TEXT,
    "cpuSpeed" TEXT,
    "logicalProcessors" INTEGER,
    "physicalProcessors" INTEGER,
    "osVersion" TEXT,
    "videoDriver" TEXT,
    "videoDriverVersion" TEXT,
    "videoPrimaryVRAM" TEXT,
    "memoryRAM" TEXT,

    CONSTRAINT "UserSystemSpecs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userProfileId" INTEGER NOT NULL,
    "numLogins" INTEGER NOT NULL DEFAULT 0,
    "numPerfPosts" INTEGER NOT NULL DEFAULT 0,
    "numSystemsCreated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePostLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "performancePostId" TEXT NOT NULL,
    "userProfileId" INTEGER NOT NULL,

    CONSTRAINT "PerformancePostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "steamUserId64" BIGINT NOT NULL,
    "avatarMedium" TEXT,
    "displayName" TEXT,
    "postText" TEXT NOT NULL,
    "ratingMedal" "RatingMedal" NOT NULL,
    "frameRateAverage" "FrameRate",
    "frameRateStutters" BOOLEAN NOT NULL DEFAULT false,
    "userSystemSpecsId" INTEGER,
    "systemManufacturer" TEXT,
    "systemModel" TEXT,
    "systemOsVersion" TEXT,
    "systemCpuBrand" TEXT,
    "systemVideoDriver" TEXT,
    "systemVideoDriverVersion" TEXT,
    "systemVideoPrimaryVRAM" TEXT,
    "systemMemoryRAM" TEXT,
    "gamepadId" INTEGER,
    "gamepadRating" "GamepadRating",

    CONSTRAINT "PerformancePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePostTag" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PerformancePostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamepadMetadata" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GamepadMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamUserProfile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId64" BIGINT NOT NULL,
    "displayName" TEXT,
    "communityVisibilityState" INTEGER,
    "profileState" INTEGER,
    "personaName" TEXT,
    "commentPermission" INTEGER,
    "profileUrl" TEXT,
    "avatar" TEXT,
    "avatarMedium" TEXT,
    "avatarFull" TEXT,
    "avatarHash" TEXT,
    "lastLogoff" INTEGER,
    "personaState" INTEGER,
    "realName" TEXT,
    "primaryClanId" TEXT,
    "timeCreated" INTEGER,
    "personaStateFlags" INTEGER,
    "locCountryCode" TEXT,
    "locStateCode" TEXT,
    "locCityId" INTEGER,
    "appCount" INTEGER,

    CONSTRAINT "SteamUserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamApp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dataDownloadAttempted" BOOLEAN NOT NULL DEFAULT false,
    "dataDownloadAttemptedAt" TIMESTAMP(3),
    "dataDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "dataDownloadedAt" TIMESTAMP(3),
    "type" TEXT,
    "requiredAge" TEXT,
    "isFree" BOOLEAN,
    "controllerSupport" TEXT,
    "dlc" INTEGER[],
    "detailedDescription" TEXT,
    "aboutTheGame" TEXT,
    "shortDescription" TEXT,
    "supportedLanguages" TEXT,
    "reviews" TEXT,
    "headerImage" TEXT,
    "website" TEXT,
    "pcRequirementsMinimum" TEXT,
    "pcRequirementsRecommended" TEXT,
    "macRequirementsMinimum" TEXT,
    "macRequirementsRecommended" TEXT,
    "linuxRequirementsMinimum" TEXT,
    "linuxRequirementsRecommended" TEXT,
    "legalNotice" TEXT,
    "developers" TEXT[],
    "publishers" TEXT[],
    "platformWindows" BOOLEAN,
    "platformMac" BOOLEAN,
    "platformLinux" BOOLEAN,
    "metacriticScore" INTEGER,
    "metacriticUrl" TEXT,
    "recommendationsTotal" INTEGER,
    "achievementsTotal" INTEGER,
    "comingSoon" BOOLEAN,
    "releaseDate" TEXT,
    "supportUrl" TEXT,
    "supportEmail" TEXT,
    "background" TEXT,
    "backgroundRaw" TEXT,
    "contentDescriptorIds" INTEGER[],
    "contentDescriptorNotes" TEXT,

    CONSTRAINT "SteamApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamCategory" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamGenre" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerformancePostToPerformancePostTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamGenre" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_steamUserId64_key" ON "UserProfile"("steamUserId64");

-- CreateIndex
CREATE UNIQUE INDEX "UserSystemSpecs_systemName_userProfileId_key" ON "UserSystemSpecs"("systemName", "userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userProfileId_key" ON "UserStats"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformancePostLike_userProfileId_performancePostId_key" ON "PerformancePostLike"("userProfileId", "performancePostId");

-- CreateIndex
CREATE UNIQUE INDEX "GamepadMetadata_manufacturer_model_key" ON "GamepadMetadata"("manufacturer", "model");

-- CreateIndex
CREATE UNIQUE INDEX "SteamUserProfile_steamUserId64_key" ON "SteamUserProfile"("steamUserId64");

-- CreateIndex
CREATE UNIQUE INDEX "SteamApp_steamAppId_key" ON "SteamApp"("steamAppId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamApp_steamAppId_name_key" ON "SteamApp"("steamAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_PerformancePostToPerformancePostTag_AB_unique" ON "_PerformancePostToPerformancePostTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PerformancePostToPerformancePostTag_B_index" ON "_PerformancePostToPerformancePostTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamCategory_AB_unique" ON "_SteamAppToSteamCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamCategory_B_index" ON "_SteamAppToSteamCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamGenre_AB_unique" ON "_SteamAppToSteamGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamGenre_B_index" ON "_SteamAppToSteamGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamUserProfile_AB_unique" ON "_SteamAppToSteamUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamUserProfile_B_index" ON "_SteamAppToSteamUserProfile"("B");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_steamUserId64_fkey" FOREIGN KEY ("steamUserId64") REFERENCES "SteamUserProfile"("steamUserId64") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSystemSpecs" ADD CONSTRAINT "UserSystemSpecs_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePostLike" ADD CONSTRAINT "PerformancePostLike_performancePostId_fkey" FOREIGN KEY ("performancePostId") REFERENCES "PerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePostLike" ADD CONSTRAINT "PerformancePostLike_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePost" ADD CONSTRAINT "PerformancePost_steamAppId_fkey" FOREIGN KEY ("steamAppId") REFERENCES "SteamApp"("steamAppId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePost" ADD CONSTRAINT "PerformancePost_userSystemSpecsId_fkey" FOREIGN KEY ("userSystemSpecsId") REFERENCES "UserSystemSpecs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformancePost" ADD CONSTRAINT "PerformancePost_gamepadId_fkey" FOREIGN KEY ("gamepadId") REFERENCES "GamepadMetadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerformancePostToPerformancePostTag" ADD CONSTRAINT "_PerformancePostToPerformancePostTag_A_fkey" FOREIGN KEY ("A") REFERENCES "PerformancePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerformancePostToPerformancePostTag" ADD CONSTRAINT "_PerformancePostToPerformancePostTag_B_fkey" FOREIGN KEY ("B") REFERENCES "PerformancePostTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamCategory" ADD CONSTRAINT "_SteamAppToSteamCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamCategory" ADD CONSTRAINT "_SteamAppToSteamCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamGenre" ADD CONSTRAINT "_SteamAppToSteamGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamGenre" ADD CONSTRAINT "_SteamAppToSteamGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamUserProfile" ADD CONSTRAINT "_SteamAppToSteamUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "SteamApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteamAppToSteamUserProfile" ADD CONSTRAINT "_SteamAppToSteamUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "SteamUserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
