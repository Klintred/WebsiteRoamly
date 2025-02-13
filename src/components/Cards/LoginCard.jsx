import React from "react";
import "../../styles/login.css";
import PrimaryButton from "../Buttons/PrimaryButton";
import SocialIcons from "../SocialIcons";

const LoginCard = () => {
  return (
    <div className="login-box">
      <h1 className="logo">Roamly</h1>

      {/* Buttons using PrimaryButton Component */}
      <PrimaryButton text="Login" />
      <PrimaryButton text="Register" variant="secondary" />

      {/* Guest Login */}
      <p className="guest-text">Continue as a guest</p>

      {/* Footer Links */}
      <div className="footer">
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About us</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-links">
          <a href="#">User stories</a>
          <a href="#">Terms of service</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>

      {/* Social Icons Component */}
      <SocialIcons />
    </div>
  );
};

export default LoginCard;
