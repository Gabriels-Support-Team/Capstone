import React, { useState } from "react";
import FlixterHeader from "./FlixterHeader";
import "./MovieLogger.css";
function MovieLogger() {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState({ name: "", rating: "" });
  const [comparisonIndex, setComparisonIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

  const handleMovieInput = (e) => {
    setCurrentMovie({ ...currentMovie, name: e.target.value });
  };

  const handleRatingSelect = (e) => {
    setCurrentMovie({ ...currentMovie, rating: e.target.value });
  };

  const startComparison = () => {
    if (currentMovie.name && currentMovie.rating) {
      setIsComparing(true);
      setComparisonIndex(0);
    } else {
      alert("Please enter movie details and select a rating.");
    }
  };

  const handleComparisonResult = (isBetter) => {
    if (comparisonIndex >= movies.length || movies.length === 0) {
      setMovies([...movies, currentMovie]);
      resetLogging();
      return;
    }

    const nextIndex = isBetter ? comparisonIndex + 1 : comparisonIndex;
    if (isBetter || comparisonIndex === movies.length - 1) {
      const newMovies = [...movies];
      newMovies.splice(nextIndex, 0, currentMovie);
      setMovies(newMovies);
      resetLogging();
    } else {
      setComparisonIndex(nextIndex);
    }
  };

  const resetLogging = () => {
    setCurrentMovie({ name: "", rating: "" });
    setIsComparing(false);
    setComparisonIndex(0);
  };

  return (
    <div>
      <FlixterHeader />
      <div className="loggingContainer">
        <h1>Movie Logger</h1>
        {!isComparing ? (
          <div>
            <input
              type="text"
              placeholder="Enter movie name"
              onChange={handleMovieInput}
            />
            <select onChange={handleRatingSelect} defaultValue="">
              <option value="" disabled>
                Select rating
              </option>
              <option value="good">Good</option>
              <option value="ok">Ok</option>
              <option value="bad">Bad</option>
            </select>
            <button onClick={startComparison}>Start Comparison</button>
          </div>
        ) : (
          <div>
            {isComparing &&
              movies.length > 0 &&
              comparisonIndex < movies.length && (
                <div>
                  <p>
                    Is {currentMovie.name} better than{" "}
                    {movies[comparisonIndex].name}?
                  </p>
                  <button onClick={() => handleComparisonResult(true)}>
                    Yes
                  </button>
                  <button onClick={() => handleComparisonResult(false)}>
                    No
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieLogger;
