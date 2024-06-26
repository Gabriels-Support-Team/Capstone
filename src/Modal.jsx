import React, { useState, useEffect } from "react";
import "./Modal.css";

function CreateModal({ isOpen, close, movie }) {
  const [movieDetails, setMovieDetails] = useState();
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    // Fetch video details
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setVideoSrc(response.results?.[0]?.key);
      })
      .catch((error) => console.error("Failed to fetch video details:", error));

    // Fetch movie details
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => setMovieDetails(response))
      .catch((error) => console.error("Failed to fetch movie details:", error));
  }, [movie, isOpen]); // Include isOpen in the dependency array

  if (!isOpen) return null;
  if (!movieDetails) return <div>Loading...</div>; // Handle loading state

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modalCloseContainer">
          <button className="modalClose" onClick={close}>
            X
          </button>
        </div>
        <h1>{movie.original_title}</h1>
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.backdrop_path}`}
          alt={movie.original_title}
        />
        <p>Release Date: {movie.release_date}</p>
        <p>Overview: {movie.overview}</p>
        <p>
          Genres: {movieDetails.genres.map((genre) => genre.name).join(", ")}
        </p>
        <p>Runtime: {movieDetails.runtime} minutes</p>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoSrc}?si=m_gdkGRG2IUGLWpC`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>{" "}
      </div>
    </div>
  );
}

export default CreateModal;
