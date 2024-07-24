import React, { useEffect, useState } from "react";
import "./MovieCard.css";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { getRatingColor } from "./utils";

function MovieCard({
  movieImage,
  movieTitle,
  movieRating,
  openModal,
  toggleLiked,
  likedMovies,
  toggleWatched,
  watchedMovies,
  bookmarkMovie,
  includeBookmark,
  movieId,
  unbookmark,
  includeUnbookmark,
  tmdbId,
}) {
  const apiKey = import.meta.env.VITE_STREAMING_API_KEY;

  const [bookmarked, setBookmarked] = useState(false);
  const [uniquePlatforms, setUniquePlatforms] = useState(new Set());
  //toggles movie as watched

  useEffect(() => {
    if (tmdbId) {
      const url = `https://api.watchmode.com/v1/title/movie-${tmdbId}/sources?apiKey=${apiKey}&regions=US`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const newPlatforms = new Set();

          data.forEach((item) => {
            if (item.name) {
              newPlatforms.add(item.name);
            }
          });
          setUniquePlatforms(newPlatforms);

          console.log(
            "Unique Streaming Platforms:",
            Array.from(uniquePlatforms)
          );
          return uniquePlatforms;
        });
    }
  }, [tmdbId]);

  const ratingColor = getRatingColor(movieRating);
  return (
    <div className="movieCard" onClick={openModal}>
      {movieImage && (
        <img className="movieImage" src={movieImage} alt={movieTitle}></img>
      )}
      {movieImage ? null : <div className="movieTitle">{movieTitle}</div>}
      <div
        className="ratingCircle"
        style={{ borderColor: ratingColor, color: ratingColor }}
      >
        {movieRating.toFixed(2)}
      </div>
      <div>
        {includeBookmark && (
          <button
            onClick={(e) => {
              bookmarkMovie(movieId, movieRating);
              setBookmarked(true);
            }}
          >
            {bookmarked ? "Bookmarked!" : "Bookmark"}
          </button>
        )}
      </div>
      <div>
        {includeUnbookmark && !bookmarked && (
          <button
            onClick={(e) => {
              unbookmark(movieId);
              setBookmarked(true);
              e.stopPropagation();
            }}
          >
            X
          </button>
        )}
      </div>
      {unbookmark && (
        <div className="streamingPlatforms">
          <h3>Available Streaming Platforms:</h3>
          <ul>
            {Array.from(uniquePlatforms).map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
