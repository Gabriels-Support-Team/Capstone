import React, { useState, useEffect } from "react";
import FlixterHeader from "./FlixterHeader";
import "./MovieLogger.css";
function MovieLogger() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieSelectedFlag, setMovieSelectedFlag] = useState(false);
  const [movieToLog, setMovieToLog] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const submitSearch = (query) => {
    const encodedQuery = encodeURIComponent(query);
    fetch(`http://localhost:3000/movies/search?query=${encodedQuery}`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  };

  return (
    <div>
      <FlixterHeader />
      <div className="searchContainer">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search"
          className="searchBar"
        />
        <button
          onClick={() => {
            submitSearch(searchQuery);
            setMovieSelectedFlag(false);
          }}
          className="submitSearchButton"
        >
          Search🔍
        </button>
      </div>
      <div
        className={
          movieSelectedFlag ? "moviesListInactive" : "moviesListActive"
        }
      >
        {movies.map((movie) => (
          <div
            onClick={() => {
              setMovieSelectedFlag(true);
              setMovieToLog(movie.movieId);
            }}
            className="movieSelection"
            key={movie.movieId}
          >
            {movie.title}
            <br></br>
            <br></br>

            {movie.genres}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieLogger;
