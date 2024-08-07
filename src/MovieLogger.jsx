import React, { useState, useEffect } from "react";
import FlixterHeader from "./FlixterHeader";
import "./MovieLogger.css";
import { useAuth } from "./contexts/authContext";
import MovieSearch from "./MovieSearch";
import { GOOD_RATING, OK_RATING, BAD_RATING } from "./config";
import { useNavigate } from "react-router-dom";
function MovieLogger() {
  const { currentUser } = useAuth();
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLogged, setMoviesLogged] = useState(0);
  const [showFirstSearch, setShowFirstSearch] = useState(true);
  const [showSecondSearch, setShowSecondSearch] = useState(true);
  const [showThirdSearch, setShowThirdSearch] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetch(
        `${import.meta.env.VITE_API_URL}/users/userMovies/${currentUser.uid}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUserMovies(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [currentUser, moviesLogged]);
  const handleMovieLogged = (searchId) => {
    setMoviesLogged(moviesLogged + 1);
    if (searchId === 1) {
      setShowFirstSearch(false);
    }
    if (searchId === 2) {
      setShowSecondSearch(false);
    }
    if (searchId === 3) {
      setShowThirdSearch(false);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (userMovies.length < 3) {
    return (
      <div>
        <FlixterHeader />

        <div className="loggingContainer">
          {showFirstSearch && (
            <>
              <div className="question">
                What is a movie that you really loved watching?
              </div>
              <MovieSearch
                initialRating={GOOD_RATING}
                onMovieLogged={() => {
                  handleMovieLogged(1);
                }}
              />
            </>
          )}

          {showSecondSearch && (
            <>
              <div className="question">
                What is a movie that you didn't enjoy?
              </div>
              <MovieSearch
                initialRating={BAD_RATING}
                onMovieLogged={() => {
                  handleMovieLogged(2);
                }}
              />
            </>
          )}
          {showThirdSearch && (
            <>
              <div className="question">What is a movie that was just ok?</div>

              <MovieSearch
                initialRating={OK_RATING}
                onMovieLogged={() => {
                  handleMovieLogged(3);
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <FlixterHeader />
      <div className="loggingContainer">
        <button
          class="recsButton"
          onClick={() => navigate("../recommendations")}
        >
          Done Logging? Get Elite Recommendations based on your Preferences!
        </button>
        <div className="question">New Movie to Log?</div>
        <MovieSearch />
      </div>
    </div>
  );
}

export default MovieLogger;
