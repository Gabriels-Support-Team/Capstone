import { PrismaClient } from "@prisma/client";
import express from "express";
const router = express.Router();
const prisma = new PrismaClient();
import { spawn } from "child_process";

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
async function fetchUserDetails(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      age: true,
      gender: true,
      occupation: true,
    },
  });
}
function processRatingsWithPython(req, res) {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("UserId is required");
  }
  Promise.all([fetchUserDetails(userId), fetchRatings()]).then(
    ([userDetails, ratings]) => {
      console.log(userDetails);
      const pythonProcess = spawn("python3", [
        "svd_movie_ratings.py",
        userId.toString(),
      ]);
      pythonProcess.stdin.write(JSON.stringify({ userDetails, ratings }));
      pythonProcess.stdin.end();
      let outputData = "";
      pythonProcess.stdout.on("data", (data) => {
        outputData += data.toString();
      });
      pythonProcess.stderr.on("data", (data) => {
        console.error("Python Error:", data.toString()); // Log errors from Python script
      });
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return res.status(500).send("Failed to process ratings");
        }
        res.send(outputData);
      });
    }
  );
}

router.get("/fetchRecs", processRatingsWithPython);
export default router;
