import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/authContext";
import { useLocation } from "react-router-dom";
import "./RankMovie.css";
import FlixterHeader from "./FlixterHeader";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function RankMovie() {
  const navigate = useNavigate();

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
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/userMovies/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
          const filteredMovies = data.filter(
            (movie) => movie.movieId !== newMovie.movieId
          );
          setUserMovies(filteredMovies);
          setHigh(filteredMovies.length - 1);
        })
        .catch((error) =>
          console.error("Error fetching ranked movies:", error)
        );
    }
  }, [currentUser, newMovie]);
  useEffect(() => {
    if (rating !== null && userMovies.length > 0) {
      const closest = userMovies.reduce((prev, curr) => {
        return Math.abs(curr.rating - rating) < Math.abs(prev.rating - rating)
          ? curr
          : prev;
      });
      setMid(userMovies.indexOf(closest));
    }
  }, [rating, userMovies]);
  useEffect(() => {
    if (low > high) {
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
  function adjustKFactor(comparisonCount) {
    const initialK = 1;
    const minK = 0.1; // Minimum K-factor to prevent it from becoming too small
    const K = Math.max(minK, initialK / (1 + Math.log(1 + comparisonCount)));
    return K;
  }
  const handleComparison = async (prefersNewMovie) => {
    //get newly logged movie, initial
    if (!currentUser || !newMovie || mid === undefined) {
      console.error("Current user or new movie data is not available.");
      return;
    }

    const response = await fetch(`http://localhost:3000/users/getUserMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.uid,
        movieId: newMovie.movieId,
      }),
    });
    const data = await response.json();
    setNewUserMovie(data);

    let newLow = low;
    let newHigh = high;

    if (prefersNewMovie) {
      newLow = mid + 1;
    } else {
      newHigh = mid - 1;
    }
    // Clamp Bounds
    newLow = Math.max(0, newLow);
    newHigh = Math.min(userMovies.length - 1, newHigh);

    let newDynamicRating;
    if (prefersNewMovie) {
      if (mid === userMovies.length - 1) {
        // New movie is better than the best movie
        newDynamicRating = 10;
      } else if (low === high) {
        const nextIndex = mid + 1;
        newDynamicRating =
          (userMovies[mid].rating + userMovies[nextIndex].rating) / 2;
      } else {
        newDynamicRating =
          (userMovies[newLow].rating + userMovies[newHigh].rating) / 2;
      }
    } else {
      if (mid === 0) {
        // New movie is worse than the worst movie
        newDynamicRating = 1;
      } else if (low === high) {
        const prevIndex = mid - 1;
        newDynamicRating =
          (userMovies[mid].rating + userMovies[prevIndex].rating) / 2;
      } else {
        newDynamicRating =
          (userMovies[newLow].rating + userMovies[newHigh].rating) / 2;
      }
    }

    let winner, loser;
    if (prefersNewMovie) {
      winner = data;
      loser = userMovies[mid];
    } else {
      winner = userMovies[mid];
      loser = data;
    }
    const K = adjustKFactor(userMovies[mid].comparisons);
    const divisor = 100;
    const winnerExpected =
      1 / (1 + Math.pow(10, (loser.rating - winner.rating) / divisor));
    const loserExpected = 1 - winnerExpected;
    let winnerNewRating = winner.rating + K * (1 - winnerExpected);
    let loserNewRating = loser.rating - K * loserExpected;

    winnerNewRating = Math.max(1, Math.min(10, winnerNewRating));
    loserNewRating = Math.max(1, Math.min(10, loserNewRating));
    setLow(newLow);
    setHigh(newHigh);

    // Update ratings for both winner and loser
    if (prefersNewMovie) {
      await updateMovieRatings(winner.movieId, newDynamicRating);
      await updateMovieRatings(loser.movieId, loserNewRating);
    } else {
      await updateMovieRatings(winner.movieId, winnerNewRating);
      await updateMovieRatings(loser.movieId, newDynamicRating);
    }
  };

  if (isRanked) {
    return (
      <div>
        <FlixterHeader />
        <div className="comparisonContainer">
          {newMovie.title} has been ranked!
          <button onClick={() => navigate("../myRankings")}>
            See Rankings
          </button>
          <button onClick={() => navigate("../movieLogger")}>
            Log another
          </button>
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
              I didn't like it
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
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>
            Do you prefer {newMovie.title} over {userMovies[mid].title}?
          </h2>
        </motion.div>
        <div className="buttonContainer">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleComparison(true)}
          >
            Yes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleComparison(false)}
          >
            No
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default RankMovie;
