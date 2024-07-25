import React, { useState } from "react";
import { useAuth } from "./contexts/authContext";

function ProfilePictureUpload() {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", `${currentUser.uid}`);

    const response = await fetch(
      "http://localhost:3000/users/upload-profile-pic",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert("Profile picture uploaded successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload profile picture: <br></br>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </label>
      <button type="submit">Upload</button>
    </form>
  );
}

export default ProfilePictureUpload;
