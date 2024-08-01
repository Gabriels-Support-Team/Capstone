import React, { useEffect, useState } from "react";
import "./App.css";
import MovieList from "./MovieList";
import SortBy from "./SortBy";
import IncludeGenre from "./IncludeGenre";
import FlixterHeader from "./FlixterHeader";
import FlixterFooter from "./FlixterFooter";
import { useAuth } from "./contexts/authContext";
import { Navigate, Link } from "react-router-dom";

const HomePage = () => {
  const { currentUser } = useAuth();

  const [sortSelection, setSortSelection] = useState("");
  const [fetchURL, setFetchURL] = useState(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page="
  );
  const [genreSelection, setGenreSelection] = useState("");
  const [genres, setGenres] = useState();
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState();
  const [likedMovies, setLikedMovies] = useState(() => {
    const savedLikes = localStorage.getItem("likedMovies");
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [watchedMovies, setWatchedMovies] = useState([]);
  //function to like movies
  function toggleLiked(movieTitle) {
    setLikedMovies((prevLikes) => {
      const updatedLikes = {
        ...prevLikes,
        [movieTitle]: !prevLikes[movieTitle],
      };
      localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  }
  //function to check movie as watched
  function toggleWatched(movieName) {
    setWatchedMovies((prevWatched) => {
      const isWatched = prevWatched.includes(movieName);
      if (isWatched) {
        return prevWatched.filter((name) => name !== movieName);
      } else {
        return [...prevWatched, movieName];
      }
    });
  }
  //fetching movies
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4M2Y0ZGE0MjI0M2IxNDljZmRjM2E2YmM4MWI1OGVkNSIsInN1YiI6IjY2Njc2NGRlMDdmNzg5ZGYzMTk5ZmI2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TpNQ6V0IuyirQEQTh3f7XMeE7SOItQeymtCD1oCUy8Y",
    },
  };
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
      .then((response) => response.json())
      .then((response) => setGenres(response));
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch(
        `${import.meta.env.VITE_API_URL}/users/userMovies/${currentUser.uid}`
      )
        .then((response) => response.json())
        .then((data) => {
          setTotalMovies(data.length);
        });
    }
  }, [currentUser]);
  return (
    <div className="App">
      <FlixterHeader likedMovies={likedMovies} watchedMovies={watchedMovies} />
      {totalMovies < 3 && <Navigate to={"/SignUpFlow"} replace={true} />}
      <div style={{ paddingTop: "100px" }}>
        <MovieList
          sortSelection={sortSelection}
          fetchURL={fetchURL}
          setFetchURL={setFetchURL}
          genreSelection={genreSelection}
          page={page}
          setPage={setPage}
          likedMovies={likedMovies}
          toggleLiked={toggleLiked}
          toggleWatched={toggleWatched}
          watchedMovies={watchedMovies}
        />
        <FlixterFooter />
      </div>
    </div>
  );
};

export default HomePage;
