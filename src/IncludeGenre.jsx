import React, { useState, useEffect } from "react";
import "./IncludeGenre.css";
function IncludeGenre({
  genreSelection,
  setGenreSelection,
  setFetchURL,
  genres,
  setPage,
}) {
  //functino to set genre selection
  const handleChange = (event) => {
    setPage(1);
    setGenreSelection(`&with_genres=${event.target.value}`);
    setFetchURL(
      "https://api.themoviedb.org/3/discover/movie?language=en-US&page="
    );
  };

  return (
    <div className="select-container">
      <select value={genreSelection} onChange={handleChange}>
        <option value="">Filter</option>
        {genres?.genres?.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
export default IncludeGenre;
