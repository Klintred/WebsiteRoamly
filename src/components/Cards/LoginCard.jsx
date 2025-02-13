import React from "react";
import "../../styles/login.css";
import PrimaryButton from "../Buttons/PrimaryButton";

const LoginCard = () => {
  return (
    <div className="login-box">
      <h1 className="logo">Roamly</h1>

      {/* Buttons */}
      <div className="button-group">
        <PrimaryButton text="Login" />
        <PrimaryButton text="Register" variant="secondary" />
      </div>

      {/* Guest Login */}
      <p className="guest-text">Continue as a guest</p>
    </div>
  );
};

export default LoginCard;
