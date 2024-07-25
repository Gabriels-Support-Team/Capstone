import React, { useEffect, useState } from "react";
import FlixterHeader from "./FlixterHeader";
import profile from "./profile.jpg";
import "./Profile.css";
import { useAuth } from "./contexts/authContext";
import ProfilePictureUpload from "./ProfilePicture";
function Profile() {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3000/users/${currentUser.uid}`)
        .then((response) => response.json())
        .then((data) => {
          setUserInfo(data);
        });
    }
  }, [currentUser]);

  return (
    <div>
      {userInfo && (
        <div className="rankingsPage">
          <FlixterHeader></FlixterHeader>
          <div className="profileContainer">
            <img
              className="profileImage"
              src={`http://localhost:3000/${userInfo?.data.profilePic}`}
              alt=""
            />
            <div className="profileTitle">{userInfo.data.email}</div>
            <div className="profileSub">Gender: {userInfo.data.gender}</div>
            <div className="profileSub">
              Occupation: {userInfo.data.occupation}
            </div>
            <div className="profileSub">Age: {userInfo.data.age}</div>
            <ProfilePictureUpload />
          </div>
        </div>
      )}
    </div>
  );
}
export default Profile;
