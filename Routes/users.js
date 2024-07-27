import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });
router.get("/getFriends", (req, res) => {
  const { userId } = req.query;
  prisma.user
    .findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: {
            friend: {
              select: {
                id: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        friendOf: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
    })
    .then((userWithFriends) => {
      res.json({
        initiatedFriends: userWithFriends.friends.map((f) => f.friend),
        receivedFriends: userWithFriends.friendOf.map((f) => f.user),
      });
    });
});

router.post("/addFriend", (req, res) => {
  const { userId, friendId } = req.body;
  prisma.friend
    .create({
      data: {
        userId: userId,
        friendId: friendId,
      },
    })
    .then((result) => {
      res.json(result);
    });
});
router.get("/friendSearch", (req, res) => {
  const { query, userId } = req.query;
  prisma.user
    .findUnique({
      where: { id: userId },
      include: {
        friends: {
          select: { friendId: true },
        },
        friendOf: {
          select: { userId: true },
        },
      },
    })
    .then((userWithFriends) => {
      const friendIds = [
        ...userWithFriends.friends.map((f) => f.friendId),
        userId,
      ];
      return prisma.user.findMany({
        where: {
          AND: [
            { email: { contains: query, mode: "insensitive" } },
            { id: { notIn: friendIds } },
          ],
        },
        select: {
          id: true,
          email: true,
          profilePic: true,
        },
      });
    })
    .then((users) => res.json(users));
});
router.post(
  "/upload-profile-pic",
  upload.single("profilePic"),
  async (req, res) => {
    const { userId } = req.body;
    const profilePicUrl = req.file.path;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePic: profilePicUrl },
    });
    res.json(user);
  }
);
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

router.post("/bookmarkMovie", (req, res) => {
  const { userId, movieId, predictedRating } = req.body;
  prisma.bookmarkedMovie
    .upsert({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
      update: {
        predictedRating: predictedRating,
      },
      create: {
        userId: userId,
        movieId: movieId,
        predictedRating: predictedRating,
      },
    })
    .then((data) => {
      res.json(data);
    });
});
router.delete("/bookmarkMovie", (req, res) => {
  const { userId, movieId } = req.body;
  prisma.bookmarkedMovie
    .delete({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
    })
    .then((data) => {
      res.json(data);
    });
});
router.delete("/userMovie", (req, res) => {
  const { userId, movieId } = req.body;
  prisma.userMovies
    .delete({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
    })
    .then((data) => {
      res.json(data);
    });
});
router.get("/bookmarkedMovies/:userId", (req, res) => {
  const userId = req.params.userId;
  prisma.bookmarkedMovie
    .findMany({
      where: { userId: userId },
      include: {
        movie: true,
      },
    })
    .then((data) => {
      res.json(data);
    });
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
        tmdbId: um.movie.tmdbId,
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
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  prisma.user
    .findUnique({
      where: { id: userId },
      select: {
        email: true,
        id: true,
        age: true,
        gender: true,
        occupation: true,
        profilePic: true,
      },
    })
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      user.profilePic = user.profilePic || "path/to/default/image.jpg";
      res.json({ data: user });
    });
});

router.delete("/removeFriend", (req, res) => {
  const { userId, friendId } = req.body;
  prisma.friend
    .deleteMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    })
    .then((result) => {
      res.json(result);
    });
});

export default router;
