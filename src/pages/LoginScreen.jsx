import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("https://roamly-api.onrender.com/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Store session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage("Login successful!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Login background" />
      </div>

      <div className="login-form-wrapper">
        <div className="login-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>

          <h1 className="welcome-heading">Welcome back!</h1>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper margin-bottom-lg">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="forgot-password">Forgot password?</div>

            <div className="full-width-button">
              <PrimaryButton text="Login" type="submit" />
            </div>
          </form>

          <div className="divider">
            <span>Or login with</span>
          </div>

          <button className="google-login-button">
            <img src="/assets/icons/googleIcon.svg" alt="Google login" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
