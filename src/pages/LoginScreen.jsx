import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const LoginScreen = () => {
  const navigate = useNavigate();

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

          <form className="login-form">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input type="password" id="password" placeholder="Enter your password" />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            <div className="forgot-password">Forgot password?</div>

            <div className="full-width-button">
              <PrimaryButton text="Login" />
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
