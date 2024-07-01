import React from "react";
import "./MovieCard.css";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

function MovieCard({
  movieImage,
  movieTitle,
  movieRating,
  openModal,
  toggleLiked,
  likedMovies,
  toggleWatched,
  watchedMovies,
}) {
  //toggles movie as watched
  const toggleWathchedInternal = (event) => {
    toggleWatched(movieTitle);
  };
  const getRatingColor = (rating) => {
    const normalizedRating = Math.min(1, Math.max(0, (rating - 5) / 5));

    //  red and green values based on the normalized rating
    const red = Math.min(255, Math.max(0, 255 - normalizedRating * 255));
    const green = Math.min(255, Math.max(0, normalizedRating * 255));

    return `rgb(${red}, ${green}, 0)`;
  };

  const isFavorite = !!likedMovies[movieTitle];
  const ratingColor = getRatingColor(movieRating);
  return (
    <div className="movieCard" onClick={openModal}>
      <img className="movieImage" src={movieImage} alt={movieTitle}></img>
      {/* <p className="movieTitle">{movieTitle}</p> */}
      <div
        className="ratingCircle"
        style={{ borderColor: ratingColor, color: ratingColor }}
      >
        {movieRating.toFixed(2)}
      </div>
      <div className="toggleContainer">
        <div className="checkBoxContainer">
          <input
            className="checkBox"
            type="checkbox"
            checked={watchedMovies.includes(movieTitle)}
            onChange={toggleWathchedInternal}
            onClick={(event) => event.stopPropagation()}
            id={`watched-${movieTitle}`}
          />
          <label htmlFor={`watched-${movieTitle}`}>Watched</label>
        </div>
        {isFavorite ? (
          <FaHeart
            className="favorite"
            size="2em"
            onClick={(event) => {
              event.stopPropagation();
              toggleLiked(movieTitle);
            }}
          />
        ) : (
          <CiHeart
            className="favorite"
            size="2em"
            onClick={(event) => {
              event.stopPropagation();
              toggleLiked(movieTitle);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default MovieCard;
