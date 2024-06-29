import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { email } = req.body;
  const newUser = await prisma.user.create({
    data: {
      email,
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

export default router;
