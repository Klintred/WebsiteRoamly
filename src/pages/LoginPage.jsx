import React from "react";
import "../styles/login.css"; // Import login styles
import loginImage from "../../public/assets/images/loginimage.png"; // Ensure the path is correct
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
