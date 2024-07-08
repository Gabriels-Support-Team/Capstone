-- CreateTable
CREATE TABLE "Movie" (
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "genres" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("movieId")
);

-- CreateTable
CREATE TABLE "UserMovies" (
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "UserMovies_pkey" PRIMARY KEY ("userId","movieId")
);

-- AddForeignKey
ALTER TABLE "UserMovies" ADD CONSTRAINT "UserMovies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovies" ADD CONSTRAINT "UserMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("movieId") ON DELETE RESTRICT ON UPDATE CASCADE;
