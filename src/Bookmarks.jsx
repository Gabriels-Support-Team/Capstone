import React, { useEffect, useState } from "react";
import FlixterHeader from "./FlixterHeader";
import "./Bookmarks.css";
import MovieCard from "./MovieCard";
import { useAuth } from "./contexts/authContext";
import CreateModal from "./Modal";
import { useNavigate } from "react-router-dom";
function Bookmarks() {
  const { currentUser } = useAuth();
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  function unbookmarkMovie(movieId) {
    const userId = currentUser.uid;
    fetch(`${import.meta.env.VITE_API_URL}/users/bookmarkMovie`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the bookmark");
        }
        return response.json();
      })
      .then((data) => {
        setData((prevData) =>
          prevData.filter((bookmark) => bookmark.movieId !== movieId)
        );
      });
  }
  const movieCards = data?.map((bookmark, index) => (
    <MovieCard
      key={bookmark.movieId}
      movieRating={Number(bookmark.predictedRating)}
      movieTitle={bookmark.movie.title}
      movieId={bookmark.movieId}
      unbookmark={unbookmarkMovie}
      includeUnbookmark={true}
      tmdbId={bookmark.movie.tmdbId}
      openModal={() => {
        openModal(bookmark.movie);
      }}
    />
  ));
  useEffect(() => {
    if (currentUser) {
      fetch(
        `${import.meta.env.VITE_API_URL}/users/bookmarkedMovies/${
          currentUser.uid
        }`
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        });
    }
  }, [currentUser]);
  return (
    <div className="rankingsPage">
      <FlixterHeader></FlixterHeader>
      {selectedMovie && (
        <CreateModal
          isOpen={isModalOpen}
          close={closeModal}
          movie={selectedMovie}
        />
      )}

      <div className="rankingsTitle">Bookmarks</div>
      <div className="sub">Your Next Watch?</div>

      <div className="bookmarksContainer">{movieCards}</div>
      <div className="recsButtonContainer">
        <button
          className="recsButton"
          onClick={() => navigate("../recommendations")}
        >
          Find your Next Watch
        </button>
      </div>
    </div>
  );
}
export default Bookmarks;
