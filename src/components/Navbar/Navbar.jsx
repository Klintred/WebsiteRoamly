import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from "../../../public/assets/images/logo.png"; // Ensure the path is correct

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">        <img src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/my-trips">My Trips</Link></li>
        <li><Link to="/points">My points</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/trip-planner">Create a trip</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
