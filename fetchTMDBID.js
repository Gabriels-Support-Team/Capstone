import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import Bottleneck from "bottleneck";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const apiKey = process.env.VITE_API_KEY; // Ensure your API key is loaded from .env

// Initialize the limiter to handle up to 50 requests per second
const limiter = new Bottleneck({
  minTime: 100,
  maxConcurrent: 1,
  highWater: 10000,
});

async function fetchAndUpdateMovie(movie) {
  const cleanedTitle = movie.title.slice(0, -6);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    cleanedTitle
  )}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  const movieData = data.results[0];
  if (movieData) {
    await prisma.movie.update({
      where: { movieId: movie.movieId },
      data: {
        tmdbId: movieData.id,
      },
    });
    console.log(`Updated movie: ${movie.title}`);
  } else {
    console.log(`No data found for movie: ${movie.title}`);
  }
}

async function updateMovieIds() {
  try {
    const movies = await prisma.movie.findMany({
      where: {
        tmdbId: null,
      },
    });

    movies.forEach((movie) => {
      limiter.schedule(fetchAndUpdateMovie, movie);
    });
  } finally {
    await prisma.$disconnect();
  }
}

updateMovieIds();
