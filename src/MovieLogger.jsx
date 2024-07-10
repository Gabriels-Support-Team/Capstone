import React, { useState, useEffect } from "react";
import FlixterHeader from "./FlixterHeader";
import "./MovieLogger.css";
import { useAuth } from "./contexts/authContext";

function MovieLogger() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieSelectedFlag, setMovieSelectedFlag] = useState(false);
  const { currentUser } = useAuth();

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
  function logMovieForUser(movieId) {
    const rating = 1;
    const userId = currentUser ? currentUser.uid : null; // This should be dynamically set based on the logged-in user
    fetch("http://localhost:3000/users/logMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId, rating }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error logging movie:", error);
      });
  }
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
              logMovieForUser(movie.movieId);
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
