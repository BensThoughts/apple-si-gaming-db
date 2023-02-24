-- CreateTable
CREATE TABLE "SteamUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
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

    CONSTRAINT "SteamUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamUserSystemSpecs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "formFactor" TEXT NOT NULL,
    "cpuVendor" TEXT NOT NULL,
    "cpuBrand" TEXT NOT NULL,
    "cpuFamily" TEXT NOT NULL,
    "cpuModel" TEXT NOT NULL,
    "cpuStepping" TEXT NOT NULL,
    "cpuType" TEXT NOT NULL,
    "cpuSpeed" TEXT NOT NULL,
    "logicalProcessors" INTEGER NOT NULL,
    "physicalProcessors" INTEGER NOT NULL,
    "osVersion" TEXT NOT NULL,
    "videoDriver" TEXT NOT NULL,
    "videoDriverVersion" TEXT NOT NULL,
    "videoPrimaryVRAM" TEXT NOT NULL,
    "memoryRAM" TEXT NOT NULL,

    CONSTRAINT "SteamUserSystemSpecs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamUserOwnedAppPlaytime" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "playtimeTwoWeeks" INTEGER NOT NULL,
    "playtimeForever" INTEGER NOT NULL,
    "playtimeWindowsForever" INTEGER NOT NULL,
    "playtimeMacForever" INTEGER NOT NULL,
    "playtimeLinuxForever" INTEGER NOT NULL,
    "rTimeLastPlayed" INTEGER NOT NULL,

    CONSTRAINT "SteamUserOwnedAppPlaytime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformancePost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "postText" TEXT NOT NULL,

    CONSTRAINT "PerformancePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamApp" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "steamAppId" INTEGER NOT NULL,
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
    "packages" INTEGER[],
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
CREATE TABLE "SteamDemo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "demoAppId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "SteamDemo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamPriceOverview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "currency" TEXT,
    "initial" INTEGER,
    "final" INTEGER,
    "discountPercent" INTEGER,
    "initialFormatted" TEXT,
    "finalFormatted" TEXT,

    CONSTRAINT "SteamPriceOverview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamPackageGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "selectionText" TEXT,
    "saveText" TEXT,
    "displayType" TEXT,
    "isRecurringSubscription" TEXT,

    CONSTRAINT "SteamPackageGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamPackageGroupSub" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "packageGroupName" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,
    "percentSavingsText" TEXT,
    "percentSavings" INTEGER,
    "optionText" TEXT,
    "optionDescription" TEXT,
    "canGetFreeLicense" TEXT,
    "isFreeLicense" BOOLEAN,
    "priceInCentsWithDiscount" INTEGER,

    CONSTRAINT "SteamPackageGroupSub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SteamCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamGenre" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "genreId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SteamGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamScreenshot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "screenshotId" INTEGER NOT NULL,
    "pathThumbnail" TEXT,
    "pathFull" TEXT,

    CONSTRAINT "SteamScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamMovie" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "name" TEXT,
    "thumbnail" TEXT,
    "webmFourEighty" TEXT,
    "webmMax" TEXT,
    "mp4FourEighty" TEXT,
    "mp4Max" TEXT,
    "highlight" BOOLEAN,

    CONSTRAINT "SteamMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAchievement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamAppId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "highlighted" BOOLEAN,

    CONSTRAINT "SteamAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SteamAppToSteamUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SteamUser_steamUserId_key" ON "SteamUser"("steamUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamUserSystemSpecs_steamUserId_key" ON "SteamUserSystemSpecs"("steamUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamApp_steamAppId_key" ON "SteamApp"("steamAppId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamApp_steamAppId_name_key" ON "SteamApp"("steamAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SteamDemo_steamAppId_demoAppId_key" ON "SteamDemo"("steamAppId", "demoAppId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamPriceOverview_steamAppId_key" ON "SteamPriceOverview"("steamAppId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamPackageGroup_steamAppId_name_key" ON "SteamPackageGroup"("steamAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SteamPackageGroupSub_steamAppId_packageGroupName_packageId_key" ON "SteamPackageGroupSub"("steamAppId", "packageGroupName", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamCategory_categoryId_key" ON "SteamCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamGenre_genreId_key" ON "SteamGenre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamScreenshot_steamAppId_screenshotId_key" ON "SteamScreenshot"("steamAppId", "screenshotId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamMovie_steamAppId_movieId_key" ON "SteamMovie"("steamAppId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamAchievement_steamAppId_name_key" ON "SteamAchievement"("steamAppId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamCategory_AB_unique" ON "_SteamAppToSteamCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamCategory_B_index" ON "_SteamAppToSteamCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamGenre_AB_unique" ON "_SteamAppToSteamGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamGenre_B_index" ON "_SteamAppToSteamGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SteamAppToSteamUser_AB_unique" ON "_SteamAppToSteamUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SteamAppToSteamUser_B_index" ON "_SteamAppToSteamUser"("B");
