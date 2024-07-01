import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/index";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import "./signupLogin.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering && password === confirmPassword) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          throw new Error("Failed to create user in Prisma");
        }
        navigate("/home");
      } catch (error) {
        console.error("Registration error:", error);
        setIsRegistering(false);
      }
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1 className="title">🎥 Flixter 🎬</h1>
      </header>

      <div className="loginContainer">
        {userLoggedIn && <Navigate to={"/home"} replace={true} />}
        <div className="center">
          <div>
            <h1>Create a New Account</h1>
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
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span></span>
              <label>Password</label>
            </div>

            <div className="txtField">
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
              />
              <span></span>
              <label>Confirm Password</label>
            </div>

            <button
              className="loginButton"
              type="submit"
              disabled={isRegistering}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="signupLink">
              Already have an account? {"   "}
              <Link to={"/"}>Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
