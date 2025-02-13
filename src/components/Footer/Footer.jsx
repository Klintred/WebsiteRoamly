import React from "react";
import "./Footer.css"; // Import footer-specific styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">Roamly</h2>
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About us</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">User stories</a>
          <a href="#">Terms of service</a>
          <a href="#">Privacy policy</a>
        </div>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
