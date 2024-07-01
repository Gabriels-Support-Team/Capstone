import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { doSignOut } from "./firebase/auth";

import "./FlixterHeader.css";
function FlixterHeader({ likedMovies, watchedMovies }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <header className="App-header">
      <h1 className="title">🎥 Flixter 🎬</h1>
      <div>
        <button className="toggleSidebar" onClick={toggleSidebar}>
          ≡
        </button>

        <Sidebar
          likedMovies={likedMovies}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          watchedMovies={watchedMovies}
        />
        <button
          className="logOut"
          onClick={() => {
            doSignOut().then(() => {
              navigate("/");
            });
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
export default FlixterHeader;
