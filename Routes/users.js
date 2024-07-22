import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { email, id, age, gender, occupation } = req.body;
  const newUser = await prisma.user.create({
    data: {
      email,
      id,
      age: Number(age),
      gender: gender,
      occupation: Number(occupation),
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
      comparisons: {
        increment: 1,
      },
    },
    create: {
      userId: userId,
      movieId: movieId,
      rating: rating,
      comparisons: 0,
    },
  });
  res.json(upsertMovie);
});

router.get("/userMovies/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userMovies = await prisma.userMovies.findMany({
      where: { userId: userId },
      orderBy: {
        rating: "asc",
      },
      include: {
        movie: true,
      },
    });
    res.json(
      userMovies.map((um) => ({
        movieId: um.movieId,
        title: um.movie.title,
        genres: um.movie.genres,
        rating: um.rating,
        comparisons: um.comparisons,
      }))
    );
  } catch (error) {
    res.status(500).send("Error fetching movies");
  }
});
router.post("/getUserMovie", async (req, res) => {
  const { userId, movieId } = req.body;
  const userMovie = await prisma.userMovies.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
    include: {
      movie: true,
    },
  });
  if (userMovie) {
    res.json(userMovie);
  } else {
    res.status(404).send("UserMovie not found");
  }
});
router.get("/userAge/:userId", async (req, res) => {
  const { userId } = req.params;
  prisma.user
    .findUnique({
      where: { id: userId },
      select: { age: true },
    })
    .then((user) => {
      if (user) {
        res.json({ userId: userId, age: user.age });
      } else {
        res.status(404).send("User not found");
      }
    });
});
export default router;
