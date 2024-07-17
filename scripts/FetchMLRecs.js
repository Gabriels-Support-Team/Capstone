import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function fetchRatings() {
  return prisma.userMovies
    .findMany({
      select: {
        userId: true,
        movie: {
          select: {
            movieId: true,
          },
        },
        rating: true,
      },
    })
    .then((ratings) => {
      ratings.map((r) => ({
        userID: r.userId,
        itemID: r.movie.movieId,
        rating: r.rating / 2,
        timestamp: r.timestamp,
      }));
    });
}
import { spawn } from "child_process";
function processRatingsWithPython() {
  fetchRatings().then((ratings) => {
    const pythonProcess = spawn("python3", ["../svd_movie_ratings.py"]);
    pythonProcess.stdin.write(JSON.stringify(ratings));
    pythonProcess.stdin.end();
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python Output: ${data}`);
    });
  });
}
processRatingsWithPython();
