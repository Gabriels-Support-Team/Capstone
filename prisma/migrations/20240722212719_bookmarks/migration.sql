-- CreateTable
CREATE TABLE "BookmarkedMovie" (
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "predictedRating" DOUBLE PRECISION,

    CONSTRAINT "BookmarkedMovie_pkey" PRIMARY KEY ("userId","movieId")
);

-- AddForeignKey
ALTER TABLE "BookmarkedMovie" ADD CONSTRAINT "BookmarkedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedMovie" ADD CONSTRAINT "BookmarkedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE RESTRICT ON UPDATE CASCADE;
