import React from "react";
import "../styles/login.css"; // Import login styles
import LoginCard from "../components/Cards/LoginCard";
import Footer from "../components/Footer/Footer"; // Import Footer

const LoginPage = () => {
  const loginImage = "/assets/images/loginimage.png"; // Correct way to use image in public/

  return (
    <div className="login-container">
      {/* Wrapper for Image & Login Box */}
      <div className="login-wrapper">
        {/* Background Image */}
        <div className="login-background">
          <img src={loginImage} alt="Login Background" />
        </div>

        {/* Login Box */}
        <div className="login-content">
          <LoginCard />
        </div>
      </div>

      {/* Footer (always stays below everything) */}
      <Footer />
      {/* Centered Login Box */}
      <div className="login-content">
        <LoginCard />
      </div>
    </div>
  );
};

export default LoginPage;
