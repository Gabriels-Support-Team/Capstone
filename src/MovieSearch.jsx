import React, { useState } from "react";
import { useAuth } from "./contexts/authContext";
import { useNavigate } from "react-router-dom";

function MovieSearch({ initialRating, onMovieLogged }) {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieSelectedFlag, setMovieSelectedFlag] = useState(false);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

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
    const rating = initialRating;
    const userId = currentUser ? currentUser.uid : null; // This should be dynamically set based on the logged-in user
    fetch("http://localhost:3000/users/logMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId, rating }),
    })
      .then((response) => response.json())
      .then(() => {
        if (onMovieLogged) {
          onMovieLogged(); // Call the callback function when the movie is logged
        }
      })
      .catch((error) => {
        console.error("Error logging movie:", error);
      });
  }
  return (
    <div>
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
              if (initialRating) {
                logMovieForUser(movie.movieId);
              } else {
                navigate("../rankMovie", { state: { movie } });
              }
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
export default MovieSearch;
