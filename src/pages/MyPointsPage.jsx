import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaPen,
  FaLock,
  FaLockOpen,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/profile.css";

const MyPointsPage = () => {
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
  const [packageType, setPackageType] = useState(null);

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


  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-action-container desktop">
          <h1>Profile</h1>
          <div className="profile-action-subcontainer">
            <span className="material-symbols-outlined">person</span>
            <Link className="profile-action-link" to="/profile">
              About me
            </Link>
          </div>
          <div className="profile-action-subcontainer">
            <span className="material-symbols-outlined">reviews</span>
            <Link className="profile-action-link" to="/my-reviews">
              My reviews
            </Link>
          </div>
          <div className="profile-action-subcontainer">
            <span className="material-symbols-outlined">star_rate</span>
            <Link className="profile-action-link" to="/my-points">
              My points
            </Link>
          </div>
        </div>
        <div className="vertical-line"></div>

        <div className="profile-wrapper">
          <div className="profile-header-container">
            <div className="profile-header">
              <h2>My Points</h2>
              <p className="profile-subtitle">Manage your points and rewards</p>
            </div>

            <div className="points-container">
              <div className="points-header">
                <div className="points-header-text">
                  <p className="points-header-text-score">200</p>
                  <p>points</p>
                </div>
              </div>
            </div>

          </div>
          <div className="line"></div>
          <div className="points-container">
            <h2>Rewards</h2>
            <div className="points-content">
              <div className="points-reward">
                <p className="points-reward-header">20 points</p>
                <p>Enjoy exclusive newsletters and be the first to access new features.</p>
                <button className="points-reward-button">Redeem</button>
              </div>

              <div className="points-reward">
                <p className="points-reward-header">60 points</p>
                <p>1 month of free access to AI-trip planning.</p>
                <button className="points-reward-button">Redeem</button>
              </div>

               <div className="points-reward">
                <p className="points-reward-header">100 points</p>
                <p>Goodie bag.</p>
                <button className="points-reward-button">Redeem</button>
              </div>

               <div className="points-reward">
                <p className="points-reward-header">140 points</p>
                <p>Chance of winning a weekend-city trip for one person.</p>
                <button className="points-reward-button">Redeem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPointsPage;
