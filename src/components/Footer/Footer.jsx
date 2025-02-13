import React from "react";
import "./Footer.css"; // Import footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Roamly Logo */}
        <img src="/assets/images/fulllogoWhite.png" alt="Roamly Logo" className="footer-logo-image" />
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About us</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer-content">
        {/* Move Social Icons ABOVE the Links */}
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
        </div>
        <div className="footer-links">
          <a href="#">User stories</a>
          <a href="#">Terms of service</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
