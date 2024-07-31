import React, { useState, useEffect } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import CreateModal from "./Modal";
import IncludeGenre from "./IncludeGenre";
import { useNavigate } from "react-router-dom";
import FriendCard from "./FriendCard";
import { useAuth } from "./contexts/authContext";
import { AMOUNT_MOVIES } from "./config";
import { AMOUNT_USERS } from "./config";
import recs from "./recs.png";

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
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const [ranks, setRanks] = useState();
  const [data, setData] = useState({ results: [] });
  const [bookmarksData, setBookmarksData] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [showSearch, setSearchActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState();
  const [friends, setFriends] = useState();
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
      });
  }, [page, fetchURL, sortSelection, genreSelection]);
  //load API data into movieCard containers
  const Cards = data?.results?.slice(0, AMOUNT_MOVIES).map((movie, index) => (
    <MovieCard
      key={movie.id}
      movieImage={`https://image.tmdb.org/t/p/w780${movie?.poster_path}`}
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

  const bookmarks = bookmarksData
    ?.slice(0, AMOUNT_MOVIES)
    .map((bookmark, index) => {
      return (
        <MovieCard
          key={bookmark.movieId}
          movieImage={`https://image.tmdb.org/t/p/w780${bookmark.movieDetails?.poster_path}`}
          movieRating={Number(bookmark.predictedRating)}
          movieTitle={bookmark.movie.title}
          movieId={bookmark.movieId}
          openModal={() => {
            populateModal(bookmark.movie);
          }}
        />
      );
    });

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    if (currentUser) {
      fetch(
        `${import.meta.env.VITE_API_URL}/users/bookmarkedMovies/${
          currentUser.uid
        }`
      )
        .then((response) => response.json())
        .then((bookmarks) => {
          const fetches = bookmarks.map((bookmark) => {
            const tmdbId = bookmark.movie.tmdbId;
            return fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
              options
            )
              .then((response) => response.json())
              .then((movieDetails) => ({
                ...bookmark,
                movieDetails,
              }));
          });
          return Promise.all(fetches);
        })
        .then((data) => {
          setBookmarksData(data);
        });
    }
  }, [currentUser]);
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    if (currentUser) {
      fetch(
        `${import.meta.env.VITE_API_URL}/users/userMovies/${currentUser.uid}`
      )
        .then((response) => response.json())
        .then((bookmarks) => {
          const fetches = bookmarks.map((bookmark) => {
            const tmdbId = bookmark.tmdbId;
            return fetch(
              `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
              options
            )
              .then((response) => response.json())
              .then((movieDetails) => ({
                ...bookmark,
                movieDetails,
              }));
          });
          return Promise.all(fetches);
        })
        .then((data) => {
          setRanks(data.reverse());
        });
    }
  }, [currentUser]);
  const rankings = ranks?.slice(0, AMOUNT_MOVIES).map((movie, index) => {
    return (
      <MovieCard
        key={movie.movieId}
        movieRating={movie.rating}
        movieImage={`https://image.tmdb.org/t/p/w780${movie.movieDetails?.poster_path}`}
        movieTitle={movie.title}
        openModal={() => {
          populateModal(movie);
        }}
      />
    );
  });
  useEffect(() => {
    if (currentUser && ranks) {
      const encodedQuery = encodeURIComponent(currentUser.uid);

      fetch(
        `${
          import.meta.env.VITE_API_URL
        }/users/getFriends?userId=${encodedQuery}`
      )
        .then((response) => response.json())
        .then((data) => setFriends(data));
    }
  }, [currentUser, ranks]);
  return (
    <div className="movieList">
      <CreateModal
        isOpen={modalOpen}
        close={() => {
          setModalOpen(false);
        }}
        movie={modalMovie}
      ></CreateModal>

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
        <div className="recommendationsBanners">
          <h1 className="mainTitle">Movie Night!</h1>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          <div className="recText">
            Discover movies tailored just for you!
            <br />
            <br /> Our advanced machine learning algorithm analyzes your viewing
            history to recommend films you'll love and even predicts your
            ratings.
            <br />
            <br />
            <button
              className="noneFound"
              onClick={() =>
                navigate("../recommendations", { state: { data } })
              }
            >
              Generate
            </button>
          </div>
          <img className="recs" src={recs} alt="" />
        </div>
      </div>
      <div className="My dynamic rankings">
        <div className="recommendationsBanner">
          <h1>My Rankings</h1>
          <p className="showAll" onClick={() => navigate("../myRankings")}>
            Show all
          </p>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {rankings}
        </div>
      </div>
      <div className="bookmarks">
        <div className="recommendationsBanner">
          <h1>Bookmarked Recommendations</h1>
          <p className="showAll" onClick={() => navigate("../Bookmarks")}>
            Show all
          </p>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {bookmarks}
        </div>
        {bookmarksData?.length === 0 && (
          <div className="buttonContainer">
            <button
              className="noneFound"
              onClick={() => navigate("../recommendations")}
            >
              Find Recs
            </button>
          </div>
        )}
      </div>
      <div className="Friends">
        <div className="recommendationsBanner">
          <h1>Friends</h1>
          <p className="showAll" onClick={() => navigate("../Friends")}>
            Show all
          </p>
        </div>
        <div
          className={
            showSearch
              ? "movieListContainerInactive"
              : "movieListContainerActive"
          }
        >
          {friends?.initiatedFriends?.slice(0, AMOUNT_USERS).map((friend) => (
            <FriendCard email={friend.email} profilePic={friend.profilePic} />
          ))}
          {friends?.initiatedFriends < 1 && (
            <div className="buttonContainer">
              <button
                className="noneFound"
                onClick={() => navigate("../Friends")}
              >
                Find Friends
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
