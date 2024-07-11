import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { email, id } = req.body;
  const newUser = await prisma.user.create({
    data: {
      email,
      id,
    },
  });
  res.json(newUser);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      email,
    },
  });
  res.json(updatedUser);
});

router.post("/logMovie", async (req, res) => {
  const { userId, movieId, rating } = req.body;
  const upsertMovie = await prisma.userMovies.upsert({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
    update: {
      rating: rating,
    },
    create: {
      userId: userId,
      movieId: movieId,
      rating: rating,
    },
  });
  res.json(upsertMovie);
});

router.get("/userMovies/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const userMovies = await prisma.userMovies.findMany({
      where: { userId: userId },
      include: {
        movie: true,
      },
    });
    res.json(userMovies);
  } catch (error) {
    res.statusCode(500).send("failed to retrieve movies");
  }
});

export default router;
