import React from "react";
import "../styles/login.css"; // Import login styles
import loginImage from "../../public/assets/images/loginimage.png"; // Ensure the path is correct
import LoginCard from "../components/Cards/LoginCard";

const LoginPage = () => {
  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="login-image">
        <img src={loginImage} alt="Login Background" />
      </div>

      {/* Login Card Component */}
      <LoginCard />
    </div>
  );
};

export default LoginPage;
