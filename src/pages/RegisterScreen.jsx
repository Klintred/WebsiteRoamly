import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setEmailError(false);
    setPasswordError(false);

    if (password.length < 6) {
      setPasswordError(true);
      setError("Password must have more than 5 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("https://roamly-api.onrender.com/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes("e-mail is al geregistreerd")) {
          setEmailError(true);
          setError("E-mail is already taken.");
        } else {
          setError(data.message || "Registration failed.");
        }
        return;
      }

      setSuccessMessage("Registration successful!");
      setTimeout(() => navigate("/login-screen"), 1500);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Register background" />
      </div>

      <div className="register-form-wrapper">
        <div className="register-screen-container">
        <button className="back-button" onClick={() => window.location.href = 'https://landingspagina-roamly.vercel.app/'}>
        ←
        </button>
          <h1 className="register-heading">Create your account</h1>

          <form className="register-form" onSubmit={handleRegister}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={emailError ? "input-error" : ""}
            />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={passwordError ? "input-error" : ""}
              />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-wrapper margin-bottom-lg">
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={passwordError ? "input-error" : ""}
              />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="full-width-button">
              <PrimaryButton text="Register" type="submit" />
            </div>
          </form>

          <p className="bottom-prompt">
            Already have an account?{" "}
            <span className="redirect-link" onClick={() => navigate("/login-screen")}>
              Login now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
