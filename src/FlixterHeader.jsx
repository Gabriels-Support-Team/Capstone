import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { doSignOut } from "./firebase/auth";
import "./FlixterHeader.css";
import { NavLink } from "react-router-dom";
import logo from "./logo.png";
import { useAuth } from "./contexts/authContext";

function FlixterHeader({ likedMovies, watchedMovies }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
          setUserInfo(data);
        });
    }
  }, [currentUser]);
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

        <NavLink className="navLink" to={"/Friends"}>
          Friends
        </NavLink>
        <NavLink className="navLink" to={"/profile"}>
          Profile
        </NavLink>
        <NavLink className="navLink" to={"/movieLogger"}>
          Log new Movie
        </NavLink>
      </div>

      <div
        className="logOut"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        onClick={() => {
          doSignOut().then(() => {
            navigate("/");
          });
        }}
      >
        Logout
      </div>
      {showPopup && (
        <div className="emailPopup">
          <img
            className="profileImg"
            src={`http://localhost:3000/${userInfo?.data?.profilePic}`}
            alt={`${userInfo?.data.email}`}
          />
        </div>
      )}
    </header>
  );
}
export default FlixterHeader;
