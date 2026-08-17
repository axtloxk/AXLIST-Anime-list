-- CreateTable
CREATE TABLE "SavedAnime" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedAnime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedAnime_userId_animeId_key" ON "SavedAnime"("userId", "animeId");

-- AddForeignKey
ALTER TABLE "SavedAnime" ADD CONSTRAINT "SavedAnime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
