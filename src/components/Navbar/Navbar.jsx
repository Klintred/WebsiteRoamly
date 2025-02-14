import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from "../../../public/assets/images/logo.png"; // Ensure the path is correct

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };
  
    return (
      <nav className="navbar-mobile">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>
  
        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
  
        {/* Navigation Links */}
<<<<<<< HEAD
        {menuOpen && ( // Menu alleen tonen als menuOpen true is
          <ul className="nav-links">
            <li><Link to="/home" className='nav-link' onClick={() => setMenuOpen(false)}>Home</Link></li>
=======
        <div className={`nav-links-container ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
>>>>>>> 9473250 (nav mobile)
            <li><Link to="/my-trips" className='nav-link' onClick={() => setMenuOpen(false)}>My Trips</Link></li>
            <li><Link to="/points" className='nav-link' onClick={() => setMenuOpen(false)}>My Points</Link></li>
            <li><Link to="/profile" className='nav-link' onClick={() => setMenuOpen(false)}>Profile</Link></li>
            <li><Link to="/trip-planner" className='nav-link' onClick={() => setMenuOpen(false)}>Create a Trip</Link></li>
          </ul>
<<<<<<< HEAD
        )}
=======
        </div>
>>>>>>> 9473250 (nav mobile)
      </nav>
    );
};

export default Navbar;
