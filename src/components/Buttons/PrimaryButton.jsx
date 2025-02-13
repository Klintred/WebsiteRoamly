import React from "react";
import "../../styles/global.css"; // Ensure global styles are available

const PrimaryButton = ({ text, onClick, variant = "primary" }) => {
  return (
    <button
      className={`btn ${variant === "secondary" ? "register-btn" : "login-btn"}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
