import React from "react";
import { useNavigate } from "react-router-dom"; // <- Add this
import "../../styles/login.css";
import PrimaryButton from "../Buttons/PrimaryButton";

const LoginCard = () => {
  const navigate = useNavigate(); // <- Hook for navigation

  const handleLoginClick = () => {
    navigate("/login-screen"); // <- Redirect to LoginScreen
  };

  const handleRegisterClick = () => {
    navigate("/register"); // <- Redirect to LoginScreen
  };

  return (
    <div className="login-box">
      <img src="/assets/images/fulllogo.png" alt="Roamly Logo" className="logo-image" />

      <div className="button-group">
        <PrimaryButton text="Login" onClick={handleLoginClick} /> {/* <- Add onClick */}
        <PrimaryButton text="Register" onClick={handleRegisterClick} variant="secondary" />
        <PrimaryButton text="Continue as a guest" variant="guest" />
      </div>
    </div>
  );
};

export default LoginCard;
