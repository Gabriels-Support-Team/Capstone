import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { doSignOut } from "./firebase/auth";
import "./FlixterHeader.css";
import { NavLink } from "react-router-dom";
import logo from "./logo.png";

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
      <div className="links">
        <NavLink className="navLink" to={"/myRankings"}>
          Watched Movies
        </NavLink>
        <NavLink className="navLink" to={"/recommendations"}>
          Recommendations
        </NavLink>
        <NavLink className="navLink" to={"/Friends"}>
          Friends
        </NavLink>
        <NavLink className="navLink" to={"/profile"}>
          Profile
        </NavLink>
      </div>

      <div
        className="logOut"
        onClick={() => {
          doSignOut().then(() => {
            navigate("/");
          });
        }}
      >
        Logout
      </div>
    </header>
  );
}
export default FlixterHeader;
