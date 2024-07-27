import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function FriendModal({ isOpen, onRequestClose, friend, movies }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Friend's Movies"
    >
      <div className="modalsContent">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.movieId}>
              <p>
                {movie.title}: {movie.rating}
              </p>
            </div>
          ))
        ) : (
          <p>User has not rated any movies</p>
        )}
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default FriendModal;
