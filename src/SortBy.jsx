import React, { useState } from "react";
import "./SortBy.css";
function DropDown({ sortSelection, setSortSelection, setFetchURL, setPage }) {
  //function to toggle sort
  const setSortInternal = (event) => {
    setPage(1);
    setSortSelection(event.target.value);
    setFetchURL(
      "https://api.themoviedb.org/3/discover/movie?language=en-US&page="
    );
  };

  return (
    <div className="select-container">
      <select value={sortSelection} onChange={setSortInternal}>
        <option value="">Sort By</option>
        <option value="original_title.asc"> alphabetical-Low to High</option>
        <option value="original_title.desc"> alphabetical-High to Low</option>

        <option value="primary_release_date.asc">
          Release Date-Low to High
        </option>
        <option value="primary_release_date.desc">
          Release Date-High to Low
        </option>
        <option value="vote_average.asc">Rating-Low to High</option>
        <option value="vote_average.desc">Rating-High to Low</option>
      </select>
    </div>
  );
}
export default DropDown;
