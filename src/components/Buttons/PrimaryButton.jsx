import React from "react";
import "./Buttons.css"; // Import button styles

const PrimaryButton = ({ text, onClick, variant = "primary" }) => {
  return (
    <button
      className={`btn ${
        variant === "secondary"
          ? "register-btn"
          : variant === "guest"
          ? "guest-btn"
          : "login-btn"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
