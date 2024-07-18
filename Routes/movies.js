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
router.get("/random", (req, res) => {
  prisma.$queryRaw`SELECT * FROM "Movie" ORDER BY RANDOM() LIMIT 3`
    .then((randomMovies) => {
      res.json(randomMovies);
    })
    .catch((error) => {
      console.error("Failed to fetch random movies:", error);
      res.status(500).json({ error: "Failed to fetch random movies" });
    });
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  prisma.movie
    .findFirst({
      where: { movieId: parseInt(id) },
    })
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ error: "Movie not found" });
      }
    })
    .catch((error) => {
      console.error("Failed to fetch movie:", error);
      res.status(500).json({ error: "Failed to fetch movie" });
    });
});
export default router;
