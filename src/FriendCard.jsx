import React from "react";
import profile from "./profile.jpg";
import "./FriendCard.css";
function FriendCard() {
  return (
    <div className="Card">
      <img className="profilePic" src={profile} alt="" />
      <div className="friendName">Friend Name</div>
      <div className="profile">profile</div>
    </div>
  );
}
export default FriendCard;
