import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/authContext";
import "./Recommendations.css";
import { useLocation } from "react-router-dom";
import MovieCard from "./MovieCard";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";
import { ThreeCircles } from "react-loader-spinner";
import { AMOUNT_RECS } from "./config";
import CreateModal from "./Modal";

function Recommendations() {
  const location = useLocation();
  const { data } = location.state || { data: null };
  const highlightedMovie = data?.results?.[0];
  const [recommendations, setRecommendations] = useState();
  const { currentUser } = useAuth();
  const [movieCards2, setMovieCards2] = useState();
  const [age, setAge] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
            console.log(details);

            return (
              <MovieCard
                key={movie.itemID}
                movieRating={movie.rating * 2}
                movieTitle={details.title}
                bookmarkMovie={bookmarkMovie}
                includeBookmark={true}
                movieId={movie.itemID}
                openModal={() => openModal(details)}
              />
            );
          })
        );
        setMovieCards2(movieCards.filter((card) => card !== null));
      };
      fetchAllMovieDetails();
    }
  }, [recommendations]);
  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  return (
    <>
      <FlixterHeader></FlixterHeader>
      {selectedMovie && (
        <CreateModal
          isOpen={isModalOpen}
          close={closeModal}
          movie={selectedMovie}
        />
      )}
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
        {!loading ? (
          <></>
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
