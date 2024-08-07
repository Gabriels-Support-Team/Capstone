import React, { useState } from "react";
import profile from "./profile.jpg";
import "./FriendCard.css";
function FriendCard({
  email,
  userId,
  friendId,
  profilePic,
  addFriend,
  onClick,
}) {
  const [addedFriend, setAddedFriend] = useState(false);
  return (
    <div className="Card" onClick={() => onClick()}>
      <img
        className="profileImage"
        src={`${import.meta.env.VITE_API_URL}/${profilePic}`}
        alt={profile}
      />
      <div className="friendName">{email}</div>
      {!addedFriend && addFriend && (
        <button
          onClick={() => {
            addFriend();
            setAddedFriend(true);
          }}
        >
          Add
        </button>
      )}
    </div>
  );
}
export default FriendCard;
