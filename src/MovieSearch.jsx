import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/authContext";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";

function MovieSearch({ initialRating, onMovieLogged }) {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieSelectedFlag, setMovieSelectedFlag] = useState(false);
  const [random, setRandom] = useState([])
  const [suggestions, setSuggestions] = useState(0)
  const [rotate,setRotate] = useState(false)
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
  useEffect(() =>{
    fetch(`http://localhost:3000/movies/random`)
    .then((response) => response.json())
    .then((data) => setRandom(data))
  },[suggestions])
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
        <motion.button
          animate={{x:0, scale:1,rotate:rotate? 360:0}}
          initial={{scale:0}}
          onClick={() => {
            setRotate(!rotate)
            submitSearch(searchQuery);
            setMovieSelectedFlag(false);
          }}
          className="submitSearchButton"
        >
          Search🔍
        </motion.button>
      </div>
      <div
        className={
          movieSelectedFlag ? "moviesListInactive" : "moviesListActive"
        }
      >

        {movies.map((movie) => (
          <motion.div
            whileTap={{ scale: 0.9 }}
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              // once: true,
               margin: "-20px",
              amount: "all",
            }}
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
          </motion.div>
        ))}
        <h3>Movies you may have seen:</h3>
        {random.map((movie) =>(
          <motion.div
          animate={{x:0, scale:1}}
          whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              // once: true,
               margin: "-20px",
              amount: "all",
            }}
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
        </motion.div>
        ))}
        <button onClick={()=>{setSuggestions(suggestions+1)}}>New Suggestions</button>
      </div>
    </div>
  );
}
export default MovieSearch;