import { PrismaClient } from "@prisma/client";
import express from "express";
const router = express.Router();
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
      return ratings.map((r) => ({
        userID: r.userId,
        itemID: r.movie.movieId,
        rating: r.rating / 2,
        timestamp: r.timestamp,
      }));
    });
}
import { spawn } from "child_process";
function processRatingsWithPython(req, res) {
  const userId = req.query.userId;
  const age = req.query.age;

  if (!userId || !age) {
    return res.status(400).send("UserId is required");
  }
  fetchRatings().then((ratings) => {
    const pythonProcess = spawn("python3", [
      "svd_movie_ratings.py",
      userId.toString(),
      age.toString(),
    ]);

    pythonProcess.stdin.write(JSON.stringify(ratings));
    pythonProcess.stdin.end();
    let outputData = "";
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).send("Failed to process ratings");
      }
      res.send(outputData);
    });
  });
}

router.get("/fetchRecs", processRatingsWithPython);
export default router;
