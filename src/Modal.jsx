import React, { useState, useEffect } from "react";
import "./Modal.css";

function CreateModal({ isOpen, close, movie }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (!isOpen || !movie) return;

    const tmdbId = movie.id ? movie.id : movie.tmdbId;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    // Fetch video details
    fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        const videoKey = response.results?.[0]?.key;
        if (videoKey) {
          setVideoSrc(
            `https://www.youtube.com/embed/${videoKey}?si=m_gdkGRG2IUGLWpC`
          );
        }
      });

    // Fetch movie details
    fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then(setMovieDetails);
  }, [movie, isOpen]);

  if (!isOpen) return null;
  if (!movieDetails) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modalClose" onClick={close}>
          X
        </button>
        <h1>{movieDetails.original_title}</h1>
        <img
          src={`https://image.tmdb.org/t/p/w342${movieDetails.backdrop_path}`}
          alt={movieDetails.original_title}
        />
        <p>Release Date: {movieDetails.release_date}</p>
        <p>Overview: {movieDetails.overview}</p>
        <p>
          Genres: {movieDetails.genres?.map((genre) => genre.name).join(", ")}
        </p>
        <p>Runtime: {movieDetails.runtime} minutes</p>
        {videoSrc && (
          <iframe
            width="560"
            height="315"
            src={videoSrc}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

export default CreateModal;
