import React from "react";
import "../../styles/login.css";
import PrimaryButton from "../Buttons/PrimaryButton";

const LoginCard = () => {
  return (
    <div className="login-box">
      {/* Roamly Logo Image */}
      <img src="/assets/images/fulllogo.png" alt="Roamly Logo" className="logo-image" />

      {/* Buttons */}
      <div className="button-group">
        <PrimaryButton text="Login" />
        <PrimaryButton text="Register" variant="secondary" />
        <PrimaryButton text="Continue as a guest" variant="guest" />
      </div>
    </div>
  );
};

export default LoginCard;
