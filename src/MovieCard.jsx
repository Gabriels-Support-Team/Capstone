import React, { useState } from "react";
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
}) {
  const [bookmarked, setBookmarked] = useState(false);
  //toggles movie as watched
  const toggleWathchedInternal = (event) => {
    toggleWatched(movieTitle);
  };

  // const isFavorite = !!likedMovies[movieTitle];
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
            }}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
