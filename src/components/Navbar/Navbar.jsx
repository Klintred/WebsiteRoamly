import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import PrimaryButton from '../Buttons/PrimaryButton';
import mobileLogo from "../../../public/assets/images/logo.png";
import fullLogo from "../../../public/assets/images/fulllogo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logo, setLogo] = useState(mobileLogo);

  useEffect(() => {
    const updateLogo = () => {
      if (window.innerWidth >= 1024) {
        setLogo(fullLogo);
        setLogo(mobileLogo);
      }
    };

    updateLogo();
    window.addEventListener("resize", updateLogo);

    return () => window.removeEventListener("resize", updateLogo);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className='nav-container'>
        <Link to="/">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="35" viewBox="0 0 159 40" fill="none">
              <path d="M18.1212 18.4V0H30.4212C36.3212 0 40.5212 2.9 40.5212 8.5C40.5212 12.8 38.3212 14.8 35.7212 15.8C38.8212 17 39.9212 19.5 39.9212 23.4V24.2C39.9212 27 40.1212 29.6 40.3212 31.4H34.2212C33.8212 30.1 33.6212 28 33.6212 24.1V23.2C33.6212 19.6 32.3212 18.3 28.2212 18.3H24.0212M24.0212 13.3H28.7212C31.7212 13.3 34.2212 12.5 34.2212 9C34.2212 6.1 32.1212 5 29.6212 5H24.0212V13.3Z" fill="#134097" />
              <path d="M11.9212 31.3C10.4212 31.3 8.82124 31 7.32124 30.4C2.62124 28.5 -0.27876 23.6 0.0212402 18.6C0.42124 11.7 6.52124 6.59999 13.3212 7.29999V13.1C9.92124 12.7 6.22124 15.2 5.82124 18.6C5.62124 20.3 6.12124 21.9 7.12124 23.2C8.12124 24.5 9.62124 25.3 11.3212 25.5C12.9212 25.7 14.6212 25.2 15.9212 24.2C16.9212 23.4 17.6212 22.4 17.9212 21.2C18.1212 20.6 18.1212 20.1 18.1212 19.5V17.7H23.9212V19.7C23.9212 20.6 23.8212 21.4 23.6212 22.3C23.0212 24.9 21.5212 27.1 19.5212 28.8C17.3212 30.4 14.6212 31.3 11.9212 31.3Z" fill="#134097" />
              <path d="M14.7212 16.8L13.3212 20.3L9.82123 21.7L11.3212 18.1L14.7212 16.8Z" fill="#134097" />
              <path d="M11.9212 31.3C10.4212 31.3 8.82124 31 7.32124 30.4C2.62124 28.5 -0.27876 23.6 0.0212402 18.6C0.42124 11.7 6.52124 6.59999 13.3212 7.29999V13.1C9.92124 12.7 6.22124 15.2 5.82124 18.6C5.62124 20.3 6.12124 21.9 7.12124 23.2C8.12124 24.5 9.62124 25.3 11.3212 25.5C12.9212 25.7 14.6212 25.2 15.9212 24.2C16.9212 23.4 17.6212 22.4 17.9212 21.2C18.1212 20.6 18.1212 20.1 18.1212 19.5V17.7H23.9212V19.7C23.9212 20.6 23.8212 21.4 23.6212 22.3C23.0212 24.9 21.5212 27.1 19.5212 28.8C17.3212 30.4 14.6212 31.3 11.9212 31.3Z" fill="#134097" />
              <path d="M14.7212 16.8L13.3212 20.3L9.82123 21.7L11.3212 18.1L14.7212 16.8Z" fill="#134097" />
              <path d="M54.8212 8.69995C61.7212 8.69995 65.7212 13.3 65.7212 20C65.6212 27.4 60.8212 31.2999 54.5212 31.2999C48.1212 31.2999 43.6212 26.9 43.6212 20.1C43.7212 13.1 48.1212 8.69995 54.8212 8.69995ZM54.7212 13.2C51.7212 13.2 49.8212 15.6 49.8212 20C49.8212 24 51.6212 26.7999 54.7212 26.7999C57.9212 26.7999 59.7212 24.6 59.7212 19.9C59.5212 15.8 58.0212 13.2 54.7212 13.2Z" fill="#134097" />
              <path d="M87.0212 16.4V25.5C87.0212 27 87.0212 29.5 87.1212 30.9L81.3212 31C81.2212 30.2 81.2212 29.2 81.1212 28.5C79.7212 30.5 77.6212 31.4 74.8212 31.4C70.0212 31.4 67.3212 28.5 67.3212 24.6C67.3212 19.6 71.1212 17.4 77.5212 17.4H80.9212V16.1C80.9212 14.6 80.4212 12.8 77.5212 12.8C75.0212 12.8 74.3212 14 74.1212 15.7H68.3212C68.6212 12.6 70.6212 8.79997 77.8212 8.79997C85.5212 8.69997 87.0212 12.9 87.0212 16.4ZM81.1212 21.7V21H78.1212C75.1212 21 73.4212 21.8 73.4212 23.9C73.4212 25.4 74.3212 26.7 76.6212 26.7C79.5212 26.7 81.1212 24.9 81.1212 21.7Z" fill="#134097" />
              <path d="M123.221 31.2999H117.521V18.6C117.521 16.4 116.821 14.2 113.921 14.2C111.221 14.2 109.821 15.9 109.821 19.5V31.2999H103.821V18.3C103.821 16.2 103.121 14.2 100.421 14.2C97.6212 14.2 96.3213 16.3 96.3213 19.8V31.2999H90.3213V16.5C90.3213 12.2 90.3213 11.2 90.2213 9.69995H96.1213C96.2213 9.99995 96.2213 11.6 96.2213 12.6C97.2213 10.8 99.4213 9.19995 102.721 9.19995C105.921 9.19995 107.921 10.7 108.821 12.9C109.921 11.3 112.121 9.19995 115.921 9.19995C120.021 9.19995 123.321 11.5 123.321 17.7V31.2999H123.221Z" fill="#134097" />
              <path d="M132.321 31.3H126.321V0.400024H132.321V15.9V31.3Z" fill="#134097" />
              <path d="M135.521 9H142.321C145.421 17.9 146.821 22.7 147.221 24.7H147.321C147.921 22.2 149.521 16.8 152.021 9H158.221L150.321 30.9C147.821 38.1 145.421 39.7 140.821 39.7C139.821 39.7 138.821 39.6 137.821 39.5V34.2C138.621 34.3 139.521 34.3 139.821 34.3C141.921 34.3 143.121 33.3 144.221 30.6L135.521 9Z" fill="#134097" />
            </svg>
          </div>
        </Link>

        <ul className="nav-links-desktop">
          <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a trip</Link></li>
          <li><Link to="/my-trips-overview" className='nav-link' onClick={() => setMenuOpen(false)}>My trips</Link></li>
        </ul>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>

        <div className="login">
          <Link to="/profile" className='nav-link login-icon' onClick={() => setMenuOpen(false)}>
            <span className="material-symbols-outlined">person</span>
            <p>Profile</p>
          </Link>
        </div>
      </div>

      <div className={`nav-links-mobile-container ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links-mobile">
          <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/my-trips-overview" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
          <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a Trip</Link></li>
          <li className="profile-link">
            <PrimaryButton
              text="Profile"
              to="/profile"
              variant="primary"
              onClick={() => setMenuOpen(false)}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
