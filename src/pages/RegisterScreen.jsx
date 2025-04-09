import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const RegisterScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="register-page-wrapper">
      <div className="register-image-wrapper">
        <img src="/assets/images/loginimage.png" alt="Register background" />
      </div>

      <div className="register-form-wrapper">
        <div className="register-screen-container">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>

          <h1 className="register-heading">Create your account</h1>

          <form className="register-form">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input type="password" id="password" placeholder="Enter your password" />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-wrapper margin-bottom-lg">
              <input type="password" id="confirm-password" placeholder="Confirm your password" />
              <FontAwesomeIcon icon={faEye} className="toggle-password" />
            </div>

            <div className="full-width-button">
              <PrimaryButton text="Register" />
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
