import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      setUser(data.data.user || data.user || data); // Adjust based on API structure
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

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button className="logout-button" onClick={handleLogout}>
          Log in again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>

      <div className="profile-details">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>First Name:</strong> {user?.firstName}</p>
        <p><strong>Last Name:</strong> {user?.lastName}</p>
        <p><strong>Country:</strong> {user?.country}</p>
        <p><strong>City:</strong> {user?.city}</p>
        <p><strong>Street:</strong> {user?.street} {user?.houseNumber}</p>
        <p><strong>Postcode:</strong> {user?.postcode}</p>
        <p><strong>Phone Number:</strong> {user?.phoneNumber}</p>
        <p><strong>Gender:</strong> {user?.gender}</p>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Profile;
