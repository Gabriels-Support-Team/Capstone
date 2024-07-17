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
  if (!userId) {
    return res.status(400).send("UserId is required");
  }
  fetchRatings()
    .then((ratings) => {
      const pythonProcess = spawn("python3", [
        "svd_movie_ratings.py",
        userId.toString(),
      ]);

      pythonProcess.stdin.write(JSON.stringify(ratings));
      pythonProcess.stdin.end();
      let outputData = "";
      pythonProcess.stdout.on("data", (data) => {
        outputData += data.toString();
      });
      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data.toString()}`);
      });
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.log(`Python script exited with code ${code}`);
          return res.status(500).send("Failed to process ratings");
        }
        console.log("Python Output:", outputData);
        res.send(outputData);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("An error occurred while fetching ratings");
    });
}

router.get("/fetchRecs", processRatingsWithPython);
export default router;
