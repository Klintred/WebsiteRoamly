import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPen,
  FaLock,
  FaLockOpen,
  FaTimes,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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

      if (!response.ok) throw new Error("Failed to fetch user data.");
      const data = await response.json();
      setUser(data.data.user || data.user || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-screen");
  };

  const handleEditProfile = async () => {
    if (!editMode) {
      setEditMode(true); // Enter edit mode
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No auth token found. Please log in again.");
      }
  
      const response = await fetch("https://roamly-api.onrender.com/api/v1/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }),
      });
  
      // Clone and log full response for debugging
      const debugJson = await response.clone().json();
      console.log("🔍 Update API Response:", debugJson);
  
      if (!response.ok) {
        // Show clear error message in UI
        throw new Error(debugJson.message || "Update mislukt (server gaf fout).");
      }
  
      // Update UI
      setUser(debugJson.data.user);
      setEditMode(false);
      setError(""); // clear any previous error
    } catch (err) {
      console.error("🚨 Profile update error:", err);
      setError("Profiel update mislukt: " + err.message);
    }
  };
    

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://roamly-api.onrender.com/api/v1/users/update-password",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password update failed.");
      setPasswordSuccess("Password updated successfully.");

      setTimeout(() => {
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
          <FaSignOutAlt /> Log in again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-top-box">
        <div className="profile-left">
          <div className="profile-image-wrapper">
            <img
              src="/assets/images/default-profile.png"
              alt=""
              className="profile-image"
            />
            <div
              className="edit-photo-icon"
              onClick={() => alert("Open upload modal here!")}
            >
              <FaPen />
            </div>
          </div>
        </div>

        <div className="profile-middle">
          <div className="info-grid">
            {["firstName", "lastName", "email"].map((field) => (
              <div key={field} className="info-item">
                <label>
                  {field === "email" ? "Email" : field.replace("Name", " Name")}
                </label>
                {editMode ? (
                  <input
                    className="info-input editable"
                    value={user?.[field] || ""}
                    onChange={(e) =>
                      setUser({ ...user, [field]: e.target.value })
                    }
                  />
                ) : (
                  <div className="info-input locked">
                    <FaLock className="lock-icon" />
                    {user?.[field]}
                  </div>
                )}
              </div>
            ))}

            <div className="info-item">
              <label>Password</label>
              <div className="info-input locked">
                <FaLock className="lock-icon" />
                ***************
                <button
                  className="change-password-button"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <FaPen style={{ marginRight: "4px" }} /> Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="info-item">
            <label>Language</label>
            <div className="info-value-bold">English</div>
          </div>
          <button className="edit-profile-button" onClick={handleEditProfile}>
            {editMode ? (
              <>
                <FaLockOpen /> Save
              </>
            ) : (
              <>
                <FaLock /> Change Profile
              </>
            )}
          </button>
        </div>
      </div>

      <h2 className="section-heading">Available Packages</h2>
      <div className="packages-grid">
        {[
          { title: "Day Pass (7x)", price: "€14" },
          { title: "Day Pass (14x)", price: "€20" },
          { title: "Unlimited Plan", price: "€125" },
        ].map((pkg) => (
          <div key={pkg.title} className="package-card">
            <h3>{pkg.title}</h3>
            <p className="package-price">{pkg.price}</p>
            <p className="package-description">
              Activates every time you plan a trip automatically. Never expires.
            </p>
            <button className="package-button">
              <FaShoppingCart /> Buy Now
            </button>
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> Log out
      </button>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="password-modal">
            <button
              className="close-modal"
              onClick={() => setShowPasswordModal(false)}
            >
              <FaTimes />
            </button>
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="success-message">{passwordSuccess}</div>
              )}
              <button type="submit" className="edit-profile-button">
                <FaLockOpen /> Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
