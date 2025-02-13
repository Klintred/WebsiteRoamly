import React from "react";
import "../styles/login.css"; // Import styles
import loginImage from "../assets/images/loginimage.png"; // Ensure correct path
import LoginCard from "../components/Cards/LoginCard";

const LoginPage = () => {
  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="login-background">
        <img src={loginImage} alt="Login Background" />
      </div>

      {/* Centered Login Box */}
      <div className="login-content">
        <LoginCard />
      </div>
    </div>
  );
};

export default LoginPage;
