import React from "react";
import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar, likedMovies, watchedMovies }) {
  const likedMovieTitles = Object.entries(likedMovies)
    .filter(([movieName, isLiked]) => isLiked)
    .map(([movieName]) => movieName);
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar}>≡</button>
      <h3>Liked Movies</h3>

      {likedMovieTitles.length > 0 ? (
        <ul>
          {likedMovieTitles.map((movieName) => (
            <li key={movieName}>{movieName}</li>
          ))}
        </ul>
      ) : (
        <p>No movies liked yet.</p>
      )}
      <h3>Watched Movies</h3>
      <ul>
        {watchedMovies.map((movieName) => (
          <li>{movieName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
