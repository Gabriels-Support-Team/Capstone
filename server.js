import express from "express";
const app = express();
app.use(express.json());
import cors from "cors";
app.use(cors());

const PORT = 3000;
import userRoutes from "./Routes/users.js";
import movieRoutes from "./Routes/movies.js";
import mlRoutes from "./scripts/FetchMLRecs.js";
app.listen(PORT, () => {
  console.log("server is running");
});

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.use("/users", userRoutes);

app.use("/movies", movieRoutes);
app.use("/ml", mlRoutes);
app.use("/uploads", express.static("uploads"));
