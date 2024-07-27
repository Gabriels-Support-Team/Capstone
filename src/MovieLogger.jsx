import React, { useState, useEffect } from "react";
import FlixterHeader from "./FlixterHeader";
import "./MovieLogger.css";
import { useAuth } from "./contexts/authContext";
import MovieSearch from "./MovieSearch";

function MovieLogger() {
  const { currentUser } = useAuth();
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLogged, setMoviesLogged] = useState(0);
  const [showFirstSearch, setShowFirstSearch] = useState(true);
  const [showSecondSearch, setShowSecondSearch] = useState(true);
  const [showThirdSearch, setShowThirdSearch] = useState(true);
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/userMovies/${currentUser.uid}`)
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
    if (searchId == 1) {
      setShowFirstSearch(false);
    }
    if (searchId == 2) {
      setShowSecondSearch(false);
    }
    if (searchId == 3) {
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
                What is one movie that you really enjoyed?
              </div>
              <MovieSearch
                initialRating={7.5}
                onMovieLogged={() => {
                  handleMovieLogged(1);
                }}
              />
            </>
          )}

          {showSecondSearch && (
            <>
              <div className="question">
                What is one movie that you did not like?
              </div>
              <MovieSearch
                initialRating={2.5}
                onMovieLogged={() => {
                  handleMovieLogged(2);
                }}
              />
            </>
          )}
          {showThirdSearch && (
            <>
              <div className="question">
                What is one movie that was just ok?
              </div>

              <MovieSearch
                initialRating={5}
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
        <div className="question">New Movie to Log?</div>
        <MovieSearch />
      </div>
    </div>
  );
}

export default MovieLogger;
