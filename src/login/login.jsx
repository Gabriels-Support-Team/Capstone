import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import "./signupLogin.css";
import logo from "../logo.png";
import { NavLink } from "react-router-dom";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const user = await doSignInWithEmailAndPassword(email, password);
        login(user);
      } catch (error) {
        setErrorMessage("incorrect username or password");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div>
      <header className="App-header">
        <NavLink className="title" to={"/home"}>
          <img className="logo" src={logo} alt="" />
        </NavLink>
      </header>

      <div className="loginContainer">
        <div className="center">
          {userLoggedIn && <Navigate to={"/home"} replace={true} />}
          <>
            <h1>Welcome Back</h1>
          </>
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
