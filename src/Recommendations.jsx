import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/authContext";
import "./Recommendations.css";
import { useLocation } from "react-router-dom";
import MovieCard from "./MovieCard";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";

function Recommendations() {
  const location = useLocation();
  const { data } = location.state || { data: null };
  const highlightedMovie = data?.results?.[0];
  const ratingColor = getRatingColor(highlightedMovie.vote_average);
  const [recommendations, setRecommendations] = useState();
  const { currentUser } = useAuth();
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
    fetch(`http://localhost:3000/ml/fetchRecs?userId=${currentUser.uid}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
      });
  }
  return (
    <>
      <FlixterHeader></FlixterHeader>
      <h1 className="recTitle">Personalized Recommendations</h1>;
      <button
        onClick={() => {
          fetchRecommendations();
        }}
      >
        FETCH RECS
      </button>
      {highlightedMovie ? (
        <>
          <div className="highlightedMovie">
            <img
              className="highlightedMoviePic"
              src={`https://image.tmdb.org/t/p/w342${highlightedMovie.backdrop_path}`}
              alt={highlightedMovie.original_title}
            />
            <div className="highlightedMovieText">
              Top Pick: <br></br>
              {highlightedMovie.original_title}
              <div className="releaseDate">{highlightedMovie.release_date}</div>
              <div className="overview">{highlightedMovie.overview}</div>
              <div className="releaseDate">Our Algorithm's curated rating:</div>
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
        <></>
      )}
    </>
  );
}
export default Recommendations;
