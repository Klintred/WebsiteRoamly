import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css"; // Reuse styles
import PrimaryButton from "../components/Buttons/PrimaryButton";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("https://roamly-api.onrender.com/api/v1/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage("Recovery code sent! Please check your email.");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Forgot password background" />
      </div>

      <div className="login-form-wrapper">
        <div className="login-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>

          <h1 className="welcome-heading">Forgot password?</h1>
          <p className="subheading-text">Please enter your email to recover your account.</p>

          <form className="login-form" onSubmit={handleSendCode}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="full-width-button">
              <PrimaryButton text="Send code" type="submit" />
            </div>
          </form>

          <div className="bottom-login-redirect">
            Remember password?{" "}
            <span className="login-link" onClick={() => navigate("/login-screen")}>
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
