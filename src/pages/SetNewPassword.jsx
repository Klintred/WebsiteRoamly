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
    const resetPasswordCode = localStorage.getItem("verifiedCode");

    if (!email || !resetPasswordCode) {
      setError("Verification missing. Please restart the reset process.");
      return;
    }

    try {
      const response = await fetch("https://roamly-api.onrender.com/api/v1/users/reset-password", {
        method: "POST", // This is a POST, per your backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          resetPasswordCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      setSuccessMessage("Password reset successful!");
      localStorage.removeItem("verifiedEmail");
      localStorage.removeItem("verifiedCode");

      setTimeout(() => navigate("/login-screen"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-image-wrapper">
        <img src="/assets/images/loginImage.png" alt="Background" />
      </div>

      <div className="login-form-wrapper">
        <div className="login-screen-container">
          <div className="login-screen-subcontainer">

            <button className="back-button" onClick={() => navigate(-1)}>
              Go back
            </button>

            <h1 className="reset-heading">Set a new Password</h1>
            <p className="subheading-text">Enter and confirm your new password.</p>

            <form className="reset-form" onSubmit={handleSubmit}>
              <div className="flex-row">
                <label htmlFor="newPassword">New password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex-row">

                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <div className="full-width-button">
                <PrimaryButton text="Reset password" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
