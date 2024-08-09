import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "./contexts/authContext";
import MovieCard from "./MovieCard";
import { ThreeCircles } from "react-loader-spinner";
import "./FriendModal.css";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function FriendModal({ isOpen, onRequestClose, friend, movies }) {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState();
  const [loading, setLoading] = useState();
  const [movieCards2, setMovieCards2] = useState();
  function fetchRecommendations() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/ml/fetchRecs?userId=${friend}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (recommendations) {
      const fetchAllMovieDetails = async () => {
        const movieCards = await Promise.all(
          recommendations.slice(0, 2).map(async (movie) => {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/movies/${movie.itemID}`
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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Friend's Movies"
    >
      <div className="modalsContent">
        <h1 className="jointTitle"> The Perfect Movie For the Two of you!</h1>
        <div className="buttonContain">
          <button
            onClick={() => {
              fetchRecommendations();
            }}
          >
            Find
          </button>
        </div>
      </div>
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
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default FriendModal;
