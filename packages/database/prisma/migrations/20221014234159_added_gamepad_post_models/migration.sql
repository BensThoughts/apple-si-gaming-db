-- CreateTable
CREATE TABLE "SteamGamepadPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "steamUserIdForSteamUser" TEXT,
    "steamAppId" INTEGER NOT NULL,
    "steamUserId" TEXT NOT NULL,
    "avatarMedium" TEXT,
    "displayName" TEXT,
    "postText" TEXT NOT NULL,
    "gamepadId" INTEGER NOT NULL,
    "gamepadManufacturer" TEXT NOT NULL,
    "gamepadModel" TEXT NOT NULL,
    "ratingMedal" "RatingMedal" NOT NULL,
    "systemManufacturer" TEXT,
    "systemModel" TEXT,
    "systemOsVersion" TEXT,
    "systemCpuBrand" TEXT,
    "systemVideoDriver" TEXT,
    "systemVideoDriverVersion" TEXT,
    "systemVideoPrimaryVRAM" TEXT,
    "systemMemoryRAM" TEXT,

    CONSTRAINT "SteamGamepadPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamGamepad" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gamepadId" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "SteamGamepad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostTagToSteamGamepadPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SteamGamepad_gamepadId_key" ON "SteamGamepad"("gamepadId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamGamepad_manufacturer_model_key" ON "SteamGamepad"("manufacturer", "model");

-- CreateIndex
CREATE UNIQUE INDEX "_PostTagToSteamGamepadPost_AB_unique" ON "_PostTagToSteamGamepadPost"("A", "B");

-- CreateIndex
CREATE INDEX "_PostTagToSteamGamepadPost_B_index" ON "_PostTagToSteamGamepadPost"("B");
