//https://api.themoviedb.org/3/discover/movie?language=en-US&page=
import React, { useState, useEffect } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import CreateModal from "./Modal";
import IncludeGenre from "./IncludeGenre";
import { useNavigate } from "react-router-dom";
function MovieList({
  sortSelection,
  setFetchURL,
  fetchURL,
  genreSelection,
  page,
  setPage,
  toggleLiked,
  likedMovies,
  toggleWatched,
  watchedMovies,
}) {
  const navigate = useNavigate();
  const [data, setData] = useState({ results: [] });

  const [searchQuery, setSearchQuery] = useState();
  const [showSearch, setSearchActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState();
  if (!import.meta.env.VITE_API_KEY) {
    console.error("API key is undefined. Check your environment variables.");
  }
  //fetch api data
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    fetch(
      `${fetchURL}${page}&sort_by=${sortSelection}${genreSelection}`,
      options
    )
      .then((response) => response.json())
      .then((newData) => {
        setData((data) => ({
          ...newData,
          results:
            page != 1
              ? [...data.results, ...newData.results]
              : [...newData.results],
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [page, fetchURL, sortSelection, genreSelection]);
  //load API data into movieCard containers
  const divs = data?.results?.slice(0, 6).map((movie, index) => (
    <MovieCard
      key={movie.id}
      movieImage={`https://image.tmdb.org/t/p/w342${movie?.poster_path}`}
      movieRating={movie.vote_average}
      movieTitle={movie.original_title}
      openModal={() => {
        populateModal(movie);
      }}
      toggleLiked={toggleLiked}
      likedMovies={likedMovies}
      toggleWatched={toggleWatched}
      watchedMovies={watchedMovies}
    />
  ));
  // Search functionality
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  function submitSearch(searchQuery) {
    setFetchURL(
      `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=`
    );
    setPage(1);
    setSearchActive(!showSearch);
  }
  function submitNowPlaying() {
    setFetchURL(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page="
    );
    setPage(1);
    setSearchActive(false);
  }
  function populateModal(movie) {
    setModalOpen(true);
    setModalMovie(movie);
  }
  //return list of new MovieCard containers
  return (
    <div className="movieList">
      <CreateModal
        isOpen={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        movie={modalMovie}
      ></CreateModal>

      <div className="toggleButtons">
        <button
          onClick={() => {
            setSearchActive(!showSearch);
          }}
        >
          Search
        </button>
        <button
          onClick={() => {
            submitNowPlaying();
          }}
        >
          Now Playing
        </button>
      </div>
      <div className={showSearch ? "searchActive" : "searchInactive"}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search"
          className="searchBar"
        />
        <button
          onClick={() => submitSearch(searchQuery)}
          className="submitSearchButton"
        >
          Search🔍
        </button>
      </div>
      <div className="reccomendations">
        <div className="recommendationsBanner">
          <h1>Personalized Recommendations</h1>
          <button onClick={() => navigate("../recommendations")}>
            Show all
          </button>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {divs}
        </div>
      </div>
      <div className="My dynamic rankings">
        <div className="recommendationsBanner">
          <h1>My Rankings</h1>
          <button onClick={() => navigate("../myRankings")}>Show all</button>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {divs}
        </div>
      </div>
      <div className="bookmarks">
        <div className="recommendationsBanner">
          <h1>Bookmarked Movies</h1>
          <button onClick={() => navigate("../Bookmarks")}>Show all</button>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {divs}
        </div>
      </div>
      <div className="Friends">
        <div className="recommendationsBanner">
          <h1>Friends' Movies</h1>
          <button onClick={() => navigate("../Friends")}>Show all</button>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {divs}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
