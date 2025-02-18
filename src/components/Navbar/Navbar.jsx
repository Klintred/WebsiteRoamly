import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import PrimaryButton from '../Buttons/PrimaryButton';
import logo from "../../../public/assets/images/logo.png"; // Ensure the path is correct


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    return (
      // Navbar mobile
      <nav className="navbar">
        <div className='nav-container'>
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <ul className="nav-links-desktop">
              <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/my-trips" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
              <li><Link to="/points" className='nav-link' onClick={() => setMenuOpen(false)}>My Points</Link></li>
              <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a Trip</Link></li>
            </ul>

          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={toggleMenu}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>

          <div className="login">
            <Link to="/login" className='nav-link' onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        </div>
        {/* Navigation Links */}
        <div className={`nav-links-mobile-container ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links-mobile">
            <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/points" className='nav-link' onClick={() => setMenuOpen(false)}>My Points</Link></li>
            <li><Link to="/my-trips" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
            <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a Trip</Link></li>
            <li>
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
