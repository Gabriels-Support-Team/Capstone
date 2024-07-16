import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
router.get("/", (req, res) => {
  prisma.movie
    .findMany()
    .then((movies) => {
      res.json(movies);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch movies" });
    });
});
router.get("/search", (req, res) => {
  const { query } = req.query;
  prisma.movie
    .findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { genres: { contains: query, mode: "insensitive" } },
        ],
      },
    })
    .then((movies) => res.json(movies));
});
router.get("/random", async (req, res) => {
  try {
    const randomMovies = await prisma.$queryRaw`SELECT * FROM "Movie" ORDER BY RANDOM() LIMIT 3`;
    res.json(randomMovies);
  } catch (error) {
    console.error("Failed to fetch random movies:", error);
    res.status(500).json({ error: "Failed to fetch random movies" });
  }
});
export default router;
