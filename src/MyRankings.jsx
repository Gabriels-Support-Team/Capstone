import React, { useState, useEffect } from "react";
import "./MyRankings.css";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";
import { useAuth } from "./contexts/authContext";
import CreateModal from "./Modal";

function MyRankings({ movies }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState();

  const { currentUser } = useAuth();
  function populateModal(movie) {
    setModalOpen(true);
    setModalMovie(movie);
  }
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    if (currentUser) {
      fetch(`http://localhost:3000/users/userMovies/${currentUser.uid}`)
        .then((response) => response.json())
        .then((bookmarks) => {
          const fetches = bookmarks.map((bookmark) => {
            const tmdbId = bookmark.tmdbId;
            return fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
              options
            )
              .then((response) => response.json())
              .then((movieDetails) => ({
                ...bookmark,
                movieDetails,
              }));
          });
          return Promise.all(fetches);
        })
        .then((data) => {
          console.log(data);
          setData(data.reverse());
        });
    }
  }, [currentUser]);

  function deleteRanking(movieId) {
    const userId = currentUser.uid;
    fetch("http://localhost:3000/users/userMovie", {
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
        return response.json(); // Assuming the server sends back some JSON response
      })
      .then((data) => {
        setData((prevData) =>
          prevData.filter((bookmark) => bookmark.movieId !== movieId)
        );
      });
  }
  return (
    <div className="rankingsPage">
      <FlixterHeader></FlixterHeader>

      <div className="rankingsTitle">Watched Movies</div>
      <div className="sub">Explore personal ratings for movies you've seen</div>
      <div className="exampleRating">
        <div
          style={{
            borderColor: getRatingColor(7.9),
            color: getRatingColor(7.9),
          }}
          className="score"
        >
          {7.9}
        </div>
        = This score represents your personalized rating for the movie, as
        calculated by our algorithm.
      </div>

      <div id="rankingscontainer">
        {data?.map((movie, index) => (
          <div onClick={() => populateModal(movie)} className="row">
            <button
              onClick={(event) => {
                deleteRanking(movie.movieId);
                event.stopPropagation();
              }}
            >
              X
            </button>

            <h1 className="rank">{index + 1}</h1>
            <img
              className="backdrop"
              src={`https://image.tmdb.org/t/p/w1280${movie.movieDetails?.backdrop_path}`}
            ></img>
            <div className="name">{movie.movieDetails.title}</div>
            <div
              style={{
                borderColor: getRatingColor(movie?.rating),
                color: getRatingColor(movie?.rating),
              }}
              className="score"
            >
              {movie.rating.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <CreateModal
        isOpen={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        movie={modalMovie}
      ></CreateModal>
    </div>
  );
}
export default MyRankings;
