import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import PrimaryButton from '../Buttons/PrimaryButton';
import mobileLogo from "../../../public/assets/images/logo.png"; // Mobile logo
import fullLogo from "../../../public/assets/images/fulllogo.png"; // Desktop logo

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logo, setLogo] = useState(mobileLogo); // Default to mobile logo

    // Function to update logo based on screen size
    useEffect(() => {
      const updateLogo = () => {
        if (window.innerWidth >= 1024) {
          setLogo(fullLogo); // Use full logo on desktop
        } else {
          setLogo(mobileLogo); // Use mobile logo on smaller screens
        }
      };

      updateLogo(); // Run on initial render
      window.addEventListener("resize", updateLogo); // Listen for window resizes

      return () => window.removeEventListener("resize", updateLogo); // Cleanup event listener
    }, []);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    return (
      <nav className="navbar">
        <div className='nav-container'>
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop">
            <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a Trip</Link></li>
            <li><Link to="/my-trips" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
            <li><Link to="/points" className='nav-link' onClick={() => setMenuOpen(false)}>My Points</Link></li>
            <li><Link to="/pricing" className='nav-link' onClick={() => setMenuOpen(false)}>Pricing</Link></li>
          </ul>

          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={toggleMenu}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>

          {/* Profile Icon */}
          <div className="login">
            <Link to="/profile" className='nav-link login-icon' onClick={() => setMenuOpen(false)}>
              <span className="material-symbols-outlined">person</span>
              <p>Profile</p>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className={`nav-links-mobile-container ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links-mobile">
            <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/points" className='nav-link' onClick={() => setMenuOpen(false)}>My Points</Link></li>
            <li><Link to="/my-trips" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
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
