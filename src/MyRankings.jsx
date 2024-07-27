import React, { useState, useEffect } from "react";
import "./MyRankings.css";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";
import { useAuth } from "./contexts/authContext";
function MyRankings({ movies }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState();
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/userMovies/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
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

      <div id="rankingscontainer">
        {data?.map((movie, index) => (
          <div className="row">
            <button onClick={() => deleteRanking(movie.movieId)}>X</button>

            <h1 className="rank">{index + 1}</h1>

            <div className="name">{movie.title}</div>
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
    </div>
  );
}
export default MyRankings;
