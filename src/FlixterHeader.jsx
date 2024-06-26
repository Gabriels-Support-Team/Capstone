import React, { useState } from "react";
import Sidebar from "./Sidebar";

import "./FlixterHeader.css";
function FlixterHeader({ likedMovies, watchedMovies }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <header className="App-header">
      <h1 className="title">🎥 Flixter 🎬</h1>
      <button className="toggleSidebar" onClick={toggleSidebar}>
        ≡
      </button>
      <Sidebar
        likedMovies={likedMovies}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        watchedMovies={watchedMovies}
      />
    </header>
  );
}
export default FlixterHeader;
