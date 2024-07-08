import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function loadMovies() {
  const data = fs.readFileSync("../ml-1m/movies.dat", "utf-8");
  const movies = data.split("\n");
  let promises = movies.map((movie) => {
    const [movieId, title, genres] = movie.split("::");
    if (movieId && title && genres) {
      return prisma.movie.create({
        data: {
          movieId: parseInt(movieId),
          title,
          genres,
        },
      });
    } else {
      return Promise.resolve(null);
    }
  });
  return Promise.all(promises);
}

loadMovies()
  .then((results) => {
    console.log("Movies loaded:", results);
  })
  .catch((error) => {
    console.error("Error loading movies:", error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
