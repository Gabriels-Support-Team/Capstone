import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/authContext";
import "./Recommendations.css";
import { useLocation } from "react-router-dom";
import MovieCard from "./MovieCard";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";
import { ThreeCircles } from "/node_modules/.vite/deps/react-loader-spinner.js";

function Recommendations() {
  const location = useLocation();
  const { data } = location.state || { data: null };
  const highlightedMovie = data?.results?.[0];
  const ratingColor = getRatingColor(highlightedMovie.vote_average);
  const [recommendations, setRecommendations] = useState();
  const { currentUser } = useAuth();
  const [movieCards2, setMovieCards2] = useState();
  const [age, setAge] = useState();
  const [loading, setLoading] = useState(false);
  const movieCards = data?.results
    ?.slice(0, 20)
    .map((movie, index) => (
      <MovieCard
        key={movie.id}
        movieImage={`https://image.tmdb.org/t/p/w342${movie?.poster_path}`}
        movieRating={movie.vote_average}
        movieTitle={movie.original_title}
      />
    ));
  function fetchRecommendations() {
    setLoading(true);
    fetch(`http://localhost:3000/ml/fetchRecs?userId=${currentUser.uid}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
      });
  }
  function bookmarkMovie(movieId, predictedRating) {
    const userId = currentUser.uid;
    fetch("http://localhost:3000/users/bookmarkMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId, predictedRating }),
    });
  }

  useEffect(() => {
    if (recommendations) {
      const fetchAllMovieDetails = async () => {
        const movieCards = await Promise.all(
          recommendations.map(async (movie) => {
            const response = await fetch(
              `http://localhost:3000/movies/${movie.itemID}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch movie details");
            }
            const details = await response.json();
            return (
              <MovieCard
                key={movie.itemID}
                movieRating={movie.rating * 2}
                movieTitle={details.title}
                bookmarkMovie={bookmarkMovie}
                includeBookmark={true}
                movieId={movie.itemID}
              />
            );
          })
        );
        setMovieCards2(movieCards.filter((card) => card !== null));
      };
      fetchAllMovieDetails();
    }
  }, [recommendations]);

  return (
    <>
      <FlixterHeader></FlixterHeader>
      <div className="pageContainer">
        <h1 className="recTitle">Personalized Recommendations</h1>
        <div className="buttonContain">
          <button
            onClick={() => {
              fetchRecommendations();
            }}
          >
            FETCH RECOMMENDATIONS
          </button>
        </div>
        {movieCards2 && !loading && (
          <h1 className="personalRecs">
            Movies Recommended Just for You, Based on Your Viewing History
          </h1>
        )}
        {!loading && (
          <div className="recommendationsContainer">{movieCards2}</div>
        )}
        {highlightedMovie && !loading ? (
          <>
            <h1 className="newMovieTitle">New Movies in Theaters</h1>

            <div className="highlightedMovie">
              <img
                className="highlightedMoviePic"
                src={`https://image.tmdb.org/t/p/w342${highlightedMovie.backdrop_path}`}
                alt={highlightedMovie.original_title}
              />
              <div className="highlightedMovieText">
                Top Pick: <br></br>
                {highlightedMovie.original_title}
                <div className="releaseDate">
                  {highlightedMovie.release_date}
                </div>
                <div className="overview">{highlightedMovie.overview}</div>
                <div className="releaseDate">Audience rating:</div>
                <div
                  style={{ borderColor: ratingColor, color: ratingColor }}
                  className="vote-average"
                >
                  {highlightedMovie.vote_average}
                </div>
              </div>
            </div>
            <div className="recommendationsContainer">{movieCards}</div>
          </>
        ) : (
          <div className="loadingContainer">
            <ThreeCircles
              visible={true}
              height="250"
              width="250"
              color="#f8c873"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Recommendations;
