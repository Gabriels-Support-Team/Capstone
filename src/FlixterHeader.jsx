import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { doSignOut } from "./firebase/auth";
import "./FlixterHeader.css";
import { NavLink } from "react-router-dom";
import logo from "./logo.png"; // Adjust the path to where your image is stored

function FlixterHeader({ likedMovies, watchedMovies }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <header className="App-header">
      <NavLink className="title" to={"/home"}>
        <img className="logo" src={logo} alt="" />
      </NavLink>

      <div className="logOutdiv">
        {/* <button className="toggleSidebar" onClick={toggleSidebar}>
          ≡
        </button>

        <Sidebar
          likedMovies={likedMovies}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          watchedMovies={watchedMovies}
        /> */}
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
