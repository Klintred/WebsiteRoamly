import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "../styles/profile.css"; // Optional: for styling the button

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login-screen");
  };

  return (
    <>
    

      <div className="profile-container">
        <h1>Welcome, {user?.email || "User"}</h1>

        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>

      
    </>
  );
};

export default Profile;
