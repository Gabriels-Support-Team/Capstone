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
  const [rating, setRating] = useState(null);
  const [newUserMovie, setNewUserMovie] = useState();

  const fetchNewUserMovie = (userId, movieId) => {
    fetch(`http://localhost:3000/users/getUserMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId }),
    })
      .then((response) => response.json())
      .then((data) => setNewUserMovie(data));
  };
  fetchNewUserMovie(currentUser.uid, newMovie.movieId);

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

  function updateMovieRatings(movieId, rating) {
    const userId = currentUser.uid;
    fetch("http://localhost:3000/users/logMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId, rating }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error logging movie:", error);
      });
  }

  const handleComparison = async (prefersNewMovie) => {
    const winner = prefersNewMovie ? newUserMovie : userMovies[mid];
    const loser = prefersNewMovie ? userMovies[mid] : newUserMovie;
    console.log("Winner Rating:", winner.rating); // Check if rating is valid
    console.log("Loser Rating:", loser.rating); // Check if rating is valid
    const K = 1;
    const divisor = 100;
    const winnerExpected =
      1 / (1 + Math.pow(10, (loser.rating - winner.rating) / divisor));
    const loserExpected = 1 - winnerExpected;
    let winnerNewRating = winner.rating + K * (1 - winnerExpected);
    let loserNewRating = loser.rating - K * loserExpected;
    console.log(winnerNewRating);
    console.log(loserNewRating);
    // Clamp ratings to ensure they remain within 1-10
    winnerNewRating = Math.max(1, Math.min(10, winnerNewRating));
    loserNewRating = Math.max(1, Math.min(10, loserNewRating));
    console.log(winnerNewRating);
    console.log(loserNewRating);

    try {
      // Update winner and loser ratings sequentially
      await updateMovieRatings(winner.movieId, winnerNewRating);
      await updateMovieRatings(loser.movieId, loserNewRating);
      // Update state after both ratings have been successfully updated
      if (prefersNewMovie) {
        setLow(mid + 1);
      } else {
        setHigh(mid - 1);
      }
    } catch (error) {
      console.error("Failed to update ratings:", error);
      // Optionally handle errors, e.g., revert state changes or notify user
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
  if (!rating) {
    return (
      <>
        <FlixterHeader />
        <div className="comparisonContainer">
          <p>How was the Movie?</p>
          <div className="buttonContainer">
            <button
              onClick={() => {
                updateMovieRatings(newMovie.movieId, 7.5);
                setRating(7.5);
              }}
            >
              I Liked it!{" "}
            </button>
            <button
              onClick={() => {
                updateMovieRatings(newMovie.movieId, 5);
                setRating(5);
              }}
            >
              It was fine
            </button>
            <button
              onClick={() => {
                updateMovieRatings(newMovie.movieId, 2.5);
                setRating(2.5);
              }}
            >
              I didn't like it{" "}
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <FlixterHeader />

      <div className="comparisonContainer">
        {console.log(userMovies[mid])}
        <h2>
          Do you prefer {newMovie.title} over {userMovies[mid].title}?
        </h2>
        <div className="buttonContainer">
          <button onClick={() => handleComparison(true)}>Yes</button>
          <button onClick={() => handleComparison(false)}>No</button>
        </div>
      </div>
    </div>
  );
}

export default RankMovie;
