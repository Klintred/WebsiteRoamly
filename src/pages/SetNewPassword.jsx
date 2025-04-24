import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/setnewpassword.css";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const email = localStorage.getItem("verifiedEmail");
    if (!email) {
      setError("Email verification missing. Please restart the reset process.");
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("https://roamly-api.onrender.com/api/v1/users/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setSuccessMessage("Password reset successful!");
      localStorage.removeItem("verifiedEmail");
      setTimeout(() => navigate("/login-screen"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="reset-page-wrapper">
      <div className="reset-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Background" />
      </div>

      <div className="reset-form-wrapper">
        <div className="reset-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>

          <h1 className="reset-heading">Set a New Password</h1>
          <p className="subheading-text">Enter and confirm your new password.</p>

          <form className="reset-form" onSubmit={handleSubmit}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="full-width-button">
              <PrimaryButton text="Reset Password" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
