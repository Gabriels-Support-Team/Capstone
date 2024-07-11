import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/authContext";
import { useLocation } from "react-router-dom";
import "./RankMovie.css";
import FlixterHeader from "./FlixterHeader";
function RankMovie() {
  const [userMovies, setUserMovies] = useState([]);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [mid, setMid] = useState(0);
  const [isRanked, setIsRanked] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const { movie: newMovie } = location.state || {};

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/userMovies/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
          setUserMovies(data);
          setHigh(data.length - 1);
          setMid(Math.floor((data.length - 1) / 2));
        })
        .catch((error) =>
          console.error("Error fetching ranked movies:", error)
        );
    }
  }, [currentUser]);

  useEffect(() => {
    if (low > high) {
      console.log(`Insert ${newMovie.title} at position ${low}`);
      setIsRanked(true);
      // Call to backend to update rankings
    } else {
      setMid(Math.floor((low + high) / 2));
    }
  }, [low, high, newMovie]);

  const handleComparison = (prefersNewMovie) => {
    if (prefersNewMovie) {
      setLow(mid + 1);
    } else {
      setHigh(mid - 1);
    }
  };

  if (isRanked) {
    return (
      <div>
        <FlixterHeader />
        <div className="comparisonContainer">
          {newMovie.title} has been ranked at position {low}!
        </div>
      </div>
    );
  }
  if (!newMovie || userMovies.length === 0) {
    return <p>Loading movies or no movies found...</p>;
  }
  return (
    <div>
      <FlixterHeader />

      <div className="comparisonContainer">
        {console.log(userMovies[mid])}
        <h2>
          Do you prefer {newMovie.title} over {userMovies[mid].title}?
        </h2>
        <button onClick={() => handleComparison(true)}>Yes</button>
        <button onClick={() => handleComparison(false)}>No</button>
      </div>
    </div>
  );
}

export default RankMovie;
