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
  const [low, setLow] = useState(0); // Lower bound for binary search starts at 0
  const [high, setHigh] = useState(0); // Upper bound for binary search
  const [mid, setMid] = useState(0); // Middle index for binary search
  const [isRanked, setIsRanked] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const { movie: newMovie } = location.state || {};
  const [rating, setRating] = useState(null);
  const [newUserMovie, setNewUserMovie] = useState();
  const [totalMovies, setTotalMovies] = useState();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  // Fetch user's movies excluding the new movie to be ranked
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
          setTotalMovies(filteredMovies.length);
        });
    }
  }, [currentUser, newMovie]);
  // Determine the closest movie rating to the new movie's rating for initial comparison
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
  // Binary search logic to find the correct position for the new movie
  useEffect(() => {
    if (low > high) {
      setIsRanked(true);
      // Call to backend to update rankings
    } else {
      setMid(Math.floor((low + high) / 2));
      setLoadingPercentage(
        Math.max((1 - (high - low) / totalMovies) * 100 - 10, 0)
      );
    }
  }, [low, high, newMovie]);
  // Function to update movie ratings in the backend
  function updateMovieRatings(movieId, rating) {
    const userId = currentUser.uid;
    fetch("http://localhost:3000/users/logMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, movieId, rating }),
    }).then((response) => response.json());
  }
  // Adjust K-factor based on the number of comparisons,
  // ensuring it decreases logarithmically. Comparison count increments in the backend each time a comparison is made
  // This way ratings can diverge to a true rating instead of fluctuating constantly. This was a unique an innovative design choice
  function adjustKFactor(comparisonCount) {
    const initialK = 1;
    const minK = 0.1; // Minimum K-factor to prevent it from becoming too small
    const K = Math.max(minK, initialK / (1 + Math.log(1 + comparisonCount)));
    return K;
  }
  // Handle user's preference input and adjust ratings accordingly
  const handleComparison = async (prefersNewMovie) => {
    //get newly logged movie, initial
    if (!currentUser || !newMovie || mid === undefined) {
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
    // Update search bounds based on user preference
    if (prefersNewMovie) {
      newLow = mid + 1;
    } else {
      newHigh = mid - 1;
    }
    // Ensure bounds do not exceed the limits
    newLow = Math.max(0, newLow);
    newHigh = Math.min(userMovies.length - 1, newHigh);

    /**
     *  The decision was made to apply the Elo rating system only to movies that have already been logged.
     *  The traditional Elo system did not suit our specific requirements, prompting the creation of a custom approach.
     *  In this design, the rating for a new movie is recalculated using the average of the two bounding comparison values.
     *  Meanwhile, only previously logged movies have their ratings updated based on a predictive Elo model.
     * This method allows movies to be appropriately rewarded or penalized based on their matchup outcomes, enabling their ratings
     * to adjust dynamically.
     */
    let newDynamicRating;
    if (prefersNewMovie) {
      if (mid === userMovies.length - 1) {
        // New movie is better than the best movie
        newDynamicRating = 10;
      } else if (low === high) {
        // If low equals high,the movie has made it to the end of the comparisons and should be placed between two movies
        const nextIndex = mid + 1;
        newDynamicRating =
          (userMovies[mid].rating + userMovies[nextIndex].rating) / 2;
      } else {
        //Average of the upperbound and lower bound that get smaller as comparisons are made
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
    // Calculate the expected scores and new ratings using the Elo rating system
    //Dyanamic K factor uniquely designed so that Ratings Converge to their true value
    //In traditional Elo systems, ratings never converge, a chess player can go from being the best to the worst or vice versa
    //This design combats that issue: we dont wan't all movies to converge to 1 or 10 we went them to converge to their own unique ratings
    const K = adjustKFactor(userMovies[mid].comparisons);
    const divisor = 100;
    const winnerExpected =
      1 / (1 + Math.pow(10, (loser.rating - winner.rating) / divisor));
    const loserExpected = 1 - winnerExpected;
    let winnerNewRating = winner.rating + K * (1 - winnerExpected);
    let loserNewRating = loser.rating - K * loserExpected;
    // Ensure ratings stay within the bounds of 1 to 10
    winnerNewRating = Math.max(1, Math.min(10, winnerNewRating));
    loserNewRating = Math.max(1, Math.min(10, loserNewRating));
    // Update the search bounds for the next iteration

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
          <div className="loadingBar">
            <div
              style={{
                height: "24px",
                width: `100%`,
                backgroundColor: "green",
                borderRadius: "10px",
              }}
            />
          </div>
          <div className="loggedMessage">{newMovie.title} has been ranked!</div>
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
          <div className="loadingBar">
            <div
              style={{
                height: "24px",
                width: `${loadingPercentage}%`,
                backgroundColor: "green",
                borderRadius: "10px",
              }}
            />
          </div>
          <p>How was the Movie?</p>
          <div className="buttonContainer">
            <button
              onClick={() => {
                updateMovieRatings(newMovie.movieId, 7.5);
                setRating(7.5);
              }}
            >
              I Liked it!
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
        <div className="loadingBar">
          <div
            style={{
              height: "24px",
              width: `${loadingPercentage}%`,
              backgroundColor: "green",
              borderRadius: "10px",
            }}
          />
        </div>
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
