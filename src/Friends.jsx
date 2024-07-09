import React from "react";
import FlixterHeader from "./FlixterHeader";
import FriendCard from "./FriendCard";
import "./Friends.css";
function Friends() {
  return (
    <div className="rankingsPage">
      <FlixterHeader></FlixterHeader>
      <div className="rankingsTitle">Friends</div>
      <div className="sub">Movie night? Get joint Recommendations</div>
      <div className="friendsContainer">
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
        <FriendCard></FriendCard>
      </div>
    </div>
  );
}
export default Friends;
