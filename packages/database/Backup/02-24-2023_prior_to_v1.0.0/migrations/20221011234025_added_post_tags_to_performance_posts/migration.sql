-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postTagId" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerformancePostToPostTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_postTagId_key" ON "PostTag"("postTagId");

-- CreateIndex
CREATE UNIQUE INDEX "_PerformancePostToPostTag_AB_unique" ON "_PerformancePostToPostTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PerformancePostToPostTag_B_index" ON "_PerformancePostToPostTag"("B");
