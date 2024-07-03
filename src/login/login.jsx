import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import "./signupLogin.css";
const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage("incorrect username or password");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1 className="title">🎥 Moveas 🎬</h1>
      </header>

      <div className="loginContainer">
        <div className="center">
          {userLoggedIn && <Navigate to={"/home"} replace={true} />}
          <div>
            <h1>Welcome Back</h1>
          </div>
          <form onSubmit={onSubmit}>
            <div className="txtField">
              <input
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <span></span>
              <label>Email</label>
            </div>

            <div className="txtField">
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span></span>
              <label>Password</label>
            </div>

            <button
              className="loginButton"
              type="submit"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
            {errorMessage && <span className="error">{errorMessage}</span>}
          </form>
          <p className="signupLink">
            <Link to={"/register"}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
