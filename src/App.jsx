import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./login/login.jsx";
import HomePage from "./HomePage";
import Register from "./login/register.jsx";
import { AuthProvider } from "./contexts/authContext";
import "./App.css";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Recommendations from "./Recommendations";
import Bookmarks from "./Bookmarks";
import Friends from "./Friends";
import MyRankings from "./MyRankings.jsx";
import Profile from "./Profile.jsx";
import MovieLogger from "./MovieLogger.jsx";
import RankMovie from "./RankMovie.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="routerDiv">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/Home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myRankings"
              element={
                <ProtectedRoute>
                  <MyRankings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MovieLogger"
              element={
                <ProtectedRoute>
                  <MovieLogger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/RankMovie"
              element={
                <ProtectedRoute>
                  <RankMovie />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
