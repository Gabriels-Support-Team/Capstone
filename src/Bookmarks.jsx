import React, { useEffect, useState } from "react";
import FlixterHeader from "./FlixterHeader";
import "./Bookmarks.css";
import MovieCard from "./MovieCard";
import { useAuth } from "./contexts/authContext";

function Bookmarks() {
  const { currentUser } = useAuth();
  const [data, setData] = useState();
  function unbookmarkMovie(movieId) {
    const userId = currentUser.uid; // Assuming uid is directly accessible and not a promise
    fetch("http://localhost:3000/users/bookmarkMovie", {
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
        console.log("Bookmark deleted", data);
        // Optionally update local state to reflect the change
        setData((prevData) =>
          prevData.filter((bookmark) => bookmark.movieId !== movieId)
        );
      })
      .catch((error) => {
        console.error("Error deleting bookmark:", error);
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
    />
  ));
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/bookmarkedMovies/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
        });
    }
  }, [currentUser]);
  return (
    <div className="rankingsPage">
      <FlixterHeader></FlixterHeader>
      <div className="rankingsTitle">Bookmarks</div>
      <div className="sub">Your Next Watch?</div>
      <div className="bookmarksContainer">{movieCards}</div>
    </div>
  );
}
export default Bookmarks;
