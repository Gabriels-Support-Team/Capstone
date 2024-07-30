import React, { useState, useEffect } from "react";
import "./Modal.css";

function CreateModal({ isOpen, close, movie }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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
    <section className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={close}>
          &times;
        </button>
        <div className="modal-image-wrapper">
          <img
            src={
              !movieDetails?.backdrop_path
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1f4C-cWV03_czRXhL1THkOdS9RDnAtPxRnA&s"
                : "https://image.tmdb.org/t/p/w1280" +
                  movieDetails.backdrop_path
            }
            alt="Movie Poster"
            className="modal-image"
          />
        </div>

        <div className="modal-details">
          <h1>{movieDetails.title}</h1>
          <div className="movieInfo">
            <p>{movieDetails.release_date}</p>
            <p id="age">{movieDetails.adult ? "PG-13" : "R"}</p>
            <p id="time"> {movieDetails.runtime} minutes</p>
            <p id="quality"> HD</p>
          </div>
          <strong className="movieSub">Overview: </strong>
          <p id="overview" className="movieText">
            {movieDetails.overview}
          </p>
          <strong className="movieSub">Genres: </strong>
          <p id="genre" className="movieText">
            {movieDetails.genres?.length > 0
              ? movieDetails.genres.map((genre) => genre.name).join(", ")
              : "Loading..."}
          </p>
          <div className="expand-section">
            <h2 className="movieSub">Movie Trailer</h2>
            <button
              className="expand-button"
              onClick={() => setIsExpanded((prevState) => !prevState)}
            >
              {isExpanded ? "⌃" : "⌄"}
            </button>
            {isExpanded && (
              <iframe
                src={videoSrc}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Movie Trailer"
                className="modal-movie-trailer"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateModal;
