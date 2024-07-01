import React, { useState, useEffect } from "react";
import "./MyRankings.css";
import FlixterHeader from "./FlixterHeader";
import { getRatingColor } from "./utils";

function MyRankings({ movies }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=`,
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
  }, [page]);

  return (
    <div>
      <FlixterHeader></FlixterHeader>
      <div id="container">
        {data?.results?.slice(0, 20).map((movie, index) => (
          <div className="row">
            <img
              className="leaderboardImage"
              src={`https://image.tmdb.org/t/p/w342${movie?.poster_path}`}
            ></img>
            <div className="name">{movie.original_title}</div>
            <div
              style={{
                borderColor: getRatingColor(movie?.vote_average),
                color: getRatingColor(movie?.vote_average),
              }}
              className="score"
            >
              {movie.vote_average.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyRankings;
