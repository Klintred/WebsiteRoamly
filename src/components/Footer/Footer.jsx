import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../../public/assets/images/fulllogoWhite.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          {/* Logo */}
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="footer-socials">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        {/* Footer Links */}
        <div className='footer-links'>
          <ul className="footer-links-mobile">
            <h4 className="footer-links-header">Links</h4>
            <li><Link to="/home" className='footer-link'>Home</Link></li>
            <li><Link to="/my-trips" className='footer-link'>My Trips</Link></li>
            <li><Link to="/points" className='footer-link'>My Points</Link></li>
            <li><Link to="/trip-planner" className='footer-link'>Create a Trip</Link></li>
            <li><Link to="/profile" className='footer-link'>Profile</Link></li>
          </ul>
          <ul className="footer-links-desktop">
            <h4 className="footer-links-header">Links</h4>
            <li><Link to="/home" className='footer-link'>Home</Link></li>
            <li><Link to="/my-trips" className='footer-link'>My Trips</Link></li>
            <li><Link to="/points" className='footer-link'>My Points</Link></li>
            <li><Link to="/trip-planner" className='footer-link'>Create a Trip</Link></li>
            <li><Link to="/profile" className='footer-link'>Profile</Link></li>
          </ul>
          <ul className="footer-links-mobile">
            <h4 className="footer-links-header">Legal</h4>
            <li><Link to="/terms-of-service" className='footer-link'>Terms of service</Link></li>
            <li><Link to="/privacy-policy" className='footer-link'>Privacy policy</Link></li>
          </ul>
          <ul className="footer-links-desktop">
            <h4 className="footer-links-header">Legal</h4>
            <li><Link to="/terms-of-service" className='footer-link'>Terms of service</Link></li>
            <li><Link to="/privacy-policy" className='footer-link'>Privacy policy</Link></li>
          </ul>
          

        </div>

        {/* Footer Copyright */}
        <div className="footer-copyright">
          <p className='descriptions'>&copy; {new Date().getFullYear()} Roamly. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
