import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("https://roamly-api.onrender.com/api/v1/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please log in again.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch user data.");
      }

      const data = await response.json();
      setUser(data.data.user || data.user || data);
    } catch (err) {
      console.error("User fetch failed:", err.message);
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-screen");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleEditPhoto = () => {
    alert("Open upload modal here!");
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-wrapper">
        <h1>Error</h1>
        <p>{error}</p>
        <button className="logout-button" onClick={handleLogout}>
          Log in again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      {/* === Profile Header Section === */}
      <div className="profile-top-box">
        <div className="profile-left">
          <div className="profile-image-wrapper">
            <img src="/assets/images/default-profile.png" alt="" className="profile-image" />
            <div className="edit-photo-icon" onClick={handleEditPhoto}>
              <FaPen />
            </div>
          </div>
        </div>

        <div className="profile-middle">
          <div className="info-grid">
            <div className="info-item">
              <label>First Name</label>
              <div className="info-value">{user?.firstName}</div>
            </div>

            <div className="info-item">
              <label>Last Name</label>
              <div className="info-value">{user?.lastName}</div>
            </div>

            <div className="info-item">
              <label>Email</label>
              <div className="info-value">{user?.email}</div>
            </div>

            <div className="info-item">
              <label>Password</label>
              <div className="info-value">***************</div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="info-item">
            <label>Language</label>
            <div className="info-value-bold">English</div>
          </div>

          <button className="edit-profile-button" onClick={handleEditProfile}>
            Change Profile
          </button>
        </div>
      </div>

      {/* === Packages Section === */}
      <h2 className="section-heading">Available Packages</h2>

      <div className="packages-grid">
        <div className="package-card">
          <h3>Day Pass (7x)</h3>
          <p className="package-price">€14</p>
          <p className="package-description">
            Activates every time you plan a trip automatically. Never expires.
          </p>
          <button className="package-button">Buy Now</button>
        </div>

        <div className="package-card">
          <h3>Day Pass (14x)</h3>
          <p className="package-price">€20</p>
          <p className="package-description">
            Activates every time you plan a trip automatically. Never expires.
          </p>
          <button className="package-button">Buy Now</button>
        </div>

        <div className="package-card">
          <h3>Unlimited Plan</h3>
          <p className="package-price">€125</p>
          <p className="package-description">
            Activates every time you plan a trip automatically. Never expires.
          </p>
          <button className="package-button">Buy Now</button>
        </div>
      </div>

      {/* === Logout Button === */}
      <button className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Profile;
