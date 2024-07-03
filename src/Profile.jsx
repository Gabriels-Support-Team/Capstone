import React from "react";
import FlixterHeader from "./FlixterHeader";
import profile from "./profile.jpg";
import "./Profile.css";
// import "./Friends.css";
function Profile() {
  return (
    <div className="rankingsPage">
      <FlixterHeader></FlixterHeader>
      <div className="profileContainer">
        <img className="profileImage" src={profile} alt="" />
        <div className="profileTitle">Profile</div>
        <div className="profileSub">Gender: Male</div>
        <div className="profileSub">Occupation: Software Engineer</div>
        <div className="profileSub">Age: 21</div>
      </div>
    </div>
  );
}
export default Profile;
