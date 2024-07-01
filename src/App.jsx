import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./login/login.jsx";
import HomePage from "./HomePage";
import Register from "./login/register.jsx";
import { AuthProvider } from "./contexts/authContext";
import "./App.css";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="routerDiv">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Home" element={<HomePage />} />
            {/* <Route component={NotFound} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
