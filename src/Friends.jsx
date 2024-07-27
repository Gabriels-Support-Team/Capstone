import FlixterHeader from "./FlixterHeader";
import FriendCard from "./FriendCard";
import "./Friends.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/authContext";
import { motion } from "framer-motion";
import FriendModal from "./FriendModal";

function Friends() {
  const [users, setUsers] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [rotate, setRotate] = useState(false);
  const [userSelectedFlag, setUserSelectedFlag] = useState(false);
  const [friends, setFriends] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState();
  const [friendMovies, setFriendMovies] = useState();
  const { currentUser } = useAuth();
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const submitSearch = (query) => {
    const encodedQuery = encodeURIComponent(query);
    fetch(
      `http://localhost:3000/users/friendSearch?query=${encodedQuery}&userId=${currentUser.uid}`
    )
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };
  useEffect(() => {
    if (currentUser) {
      const encodedQuery = encodeURIComponent(currentUser.uid);

      fetch(`http://localhost:3000/users/getFriends?userId=${encodedQuery}`)
        .then((response) => response.json())
        .then((data) => setFriends(data));
    }
  }, [currentUser, userSelectedFlag]);

  function logFriend(friendId) {
    const userId = currentUser ? currentUser.uid : null;
    fetch("http://localhost:3000/users/addFriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, friendId }),
    });
  }
  const handleFriendClick = (friendId) => {
    fetch(`http://localhost:3000/users/userMovies/${friendId}`)
      .then((response) => response.json())
      .then((data) => {
        setFriendMovies(data);
        setSelectedFriend(friendId);
        setModalIsOpen(true);
      });
  };
  return (
    <div className="rankingsPage">
      <FlixterHeader />

      <div className="rankingsTitle">Friends</div>
      <div className="sub">Movie night? Get joint Recommendations</div>
      <div className="friendsContainer">
        {friends?.initiatedFriends.map((friend) => (
          <FriendCard
            onClick={() => {
              handleFriendClick(friend.id);
            }}
            email={friend.email}
            profilePic={friend.profilePic}
          />
        ))}
      </div>
      <div className="sub">Find Friends</div>

      <div className="searchContainer">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search"
          className="searchBar"
        />
        <motion.button
          animate={{ x: 0, scale: 1, rotate: rotate ? 360 : 0 }}
          initial={{ scale: 0 }}
          onClick={() => {
            setRotate(!rotate);
            submitSearch(searchQuery);
          }}
          className="submitSearchButton"
        >
          Search🔍
        </motion.button>
      </div>
      <div className="friendsContainer">
        {users && users.length > 0 ? (
          users.map((user) => (
            <FriendCard
              addFriend={() => {
                logFriend(user.id);
                setUserSelectedFlag(!userSelectedFlag);
              }}
              key={user.id}
              email={user.email}
              profilePic={user.profilePic}
            />
          ))
        ) : (
          <div>No Users Found</div>
        )}
      </div>
      {selectedFriend && (
        <FriendModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          friend={selectedFriend}
          movies={friendMovies}
        />
      )}
    </div>
  );
}
export default Friends;
