import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const saveToken = (token, expiresInMs = 3600000) => {
  const expiry = Date.now() + expiresInMs;
  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiry.toString());
};

const getToken = () => {
  const token = localStorage.getItem("token");
  const expiry = parseInt(localStorage.getItem("token_expiry"), 10);

  if (!token || !expiry || Date.now() > expiry) {
    clearToken();
    return null;
  }

  return token;
};

const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
};

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("https://roamly-api.onrender.com/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      const token = data?.data?.token;
      if (!token) {
        throw new Error("No token received from server.");
      }

      saveToken(token);
      setSuccessMessage("Login successful!");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-image-wrapper">
        <img src="/assets/images/loginImage.png" alt="Login background" />
      </div>

      <div className="login-form-wrapper">
        <div className="login-screen-container">
          <div className="login-screen-subcontainer">
            <button className="back-button" onClick={() => navigate(-1)}>
              Go back
            </button>
            <h1 className="welcome-heading">Welcome back!</h1>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="flex-row">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="flex-row">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
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
                  <div
                    className="forgot-password"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>

              <PrimaryButton text="Login" type="submit" />
            </form>


          </div>

          <div className="register-redirect">
            Don’t have an account?{" "}
            <span className="register-link" onClick={() => navigate("/register")}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
