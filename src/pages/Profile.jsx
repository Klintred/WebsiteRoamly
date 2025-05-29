import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

      const debugJson = await response.clone().json();
      console.log("🔍 Update API Response:", debugJson);

      if (!response.ok) {
        throw new Error(debugJson.message || "Update mislukt (server gaf fout).");
      }

      setUser(debugJson.data.user);
      setEditMode(false);
      setError("");
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
          <div className="profile-action-container mobile">
            <h1>Profile</h1>
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">person</span>
              <Link className="profile-action-link" to="/profile">
                About me
              </Link>
            </div>
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">reviews</span>
              <Link className="profile-action-link" to="/profile">
                My reviews
              </Link>
            </div>
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">star_rate</span>
              <Link className="profile-action-link" to="/profile">
                My points
              </Link>
            </div>
          </div>
          <h2>About me</h2>
          <div className="profile-top-container">
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

              <div className="info-grid">
                {["firstName", "lastName", "email"].map((field) => (
                  <div key={field} className="info-item">
                    <label>
                      {field === "email" ? "Email" : field.replace("Name", " name")}
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
                        {user?.[field]}
                      </div>
                    )}
                  </div>
                ))}

                <div className="info-item">
                  <label>Password</label>
                  <div className="info-input locked">
                    ***************
                    <a
                      className="change-password-button"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FaPen style={{ marginRight: "4px" }} /> Change
                    </a>
                  </div>
                </div>
              </div>

              <div className="profile-buttons">
                <button className="edit-profile-button" onClick={handleEditProfile}>
                  {editMode ? (
                    <>
                      <FaLockOpen /> Save
                    </>
                  ) : (
                    <>
                      <FaLock /> Change profile
                    </>
                  )}
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt /> Log out
                </button>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div>
            <h2>Current subscription</h2>
            <Link>
              Change subscription
            </Link>
          </div>
          <div className="line"></div>
          <h2>Available packages</h2>
          {!packageType && (

            <div className="packages-grid options-grid">
              <div className="package-card">
                <div>
                  <h3>Personal</h3>
                  <p className="package-description">
                    For individual use.
                  </p>
                </div>
                <button className="package-button" onClick={() => setPackageType("personal")}>
                  Choose
                </button>
              </div>
              <div className="package-card">
                <div>
                  <h3>Company</h3>
                  <p className="package-description">
                    For business or team use.
                  </p>
                </div>
                <button className="package-button" onClick={() => setPackageType("company")}>
                  Choose
                </button>
              </div>
            </div>
          )}
          {packageType === "personal" && (

            <div className="packages-grid ">
              {[
                { title: "Pay-per-use", price: "€1.49 per trip", description: "Ideal for occasional users who want AI-powered trip planning without a subscription." },
                { title: "Trip Bundle", price: "€9.99 for 10 trips", description: "Great for frequent users who want affordable access to AI trip planning." },
                { title: "Trip Bundle", price: "€19.99 for 25 trips", description: "Great for frequent users who want affordable access to AI trip planning." },

              ].map((pkg) => (
                <div key={pkg.title} className="package-card">
                  <p className="package-price">{pkg.price}</p>
                  <div>
                    <h3>{pkg.title}</h3>
                    <p className="package-description">
                      {pkg.description}
                    </p>
                  </div>
                  <button className="package-button">
                    Upgrade
                  </button>
                </div>
              ))}
            </div>
          )}
          {packageType === "company" && (

            <div className="packages-grid business-package">

              <div className="package-card ">
                <p className="package-price">€129,99 per month</p>
                <div>
                  <h3>Subscription</h3>
                  <p className="package-description">
                    Roamly offers a B2B subscription for €149.99/month, giving businesses unlimited access to the AI trip planner. Ideal for care providers, mobility services, and travel agencies.
                  </p>
                </div>
                <button className="package-button">
                  Upgrade
                </button>
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div className="modal-overlay">
              <div className="password-modal">
                <a
                  className="close-modal"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <FaTimes />
                </a>
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
      </div>
    </div>
  );
};

export default Profile;
