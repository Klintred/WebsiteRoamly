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
        setError("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch user");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("User fetch failed:", err.message);
      setError("Failed to load profile. Please try again.");
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

  return (
    <div className="profile-container">
      {error ? (
        <>
          <h1>Error loading profile</h1>
          <p>{error}</p>
        </>
      ) : (
        <>
          <h1>Welcome, {user?.email || "User"}</h1>
        </>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default Profile;
