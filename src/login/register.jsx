import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/index";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import "./signupLogin.css";
import logo from "../logo.png";
import { NavLink } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");

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
          body: JSON.stringify({
            email: email,
            id: user.uid,
            age: age,
            gender: gender,
            occupation: occupation,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create user in Prisma");
        }
        navigate("/home");
      } catch (error) {
        setIsRegistering(false);
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

            <div className="txtField">
              <input
                type="number"
                autoComplete="off"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <span></span>
              <label>Age</label>
            </div>
            <select
              className="select-container"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            >
              <option value="">Occupation</option>
              <option value="1">Academic/Educator</option>
              <option value="2">Artist</option>
              <option value="3">Clerical/Admin</option>
              <option value="4">College/Grad Student</option>
              <option value="5">Customer Service</option>
              <option value="6">Doctor/Health Care</option>
              <option value="7">Executive/Managerial</option>
              <option value="8">Farmer</option>
              <option value="9">Homemaker</option>
              <option value="10">K-12 Student</option>
              <option value="11">Lawyer</option>
              <option value="12">Programmer</option>
              <option value="13">Retired</option>
              <option value="14">Sales/Marketing</option>
              <option value="15">Scientist</option>
              <option value="16">Self-Employed</option>
              <option value="17">Technician/Engineer</option>
              <option value="18">Tradesman/Craftsman</option>
              <option value="19">Unemployed</option>
              <option value="20">Writer</option>
              <option value="0">Other</option>
            </select>
            <select
              className="select-container"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <button
              className="loginButton"
              type="submit"
              disabled={isRegistering}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="signupLink">
              Already have an account?
              <Link to={"/"}>Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
