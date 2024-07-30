import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "./login/signupLogin.css";
import logo from "./logo.png";
import { NavLink } from "react-router-dom";

const SignUpFlow = () => {
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
          <>
            <h1>Next Step</h1>
          </>
          <p className="signupLink">
            <h3>
              Before we can provide you with amazing recommendations, we have to
              learn all about your taste in movies. <br />
              <br />
              Start organizing your favorite & not so favorite movies!
            </h3>
            <Link to={"/MovieLogger"}>Let's Rank!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpFlow;
