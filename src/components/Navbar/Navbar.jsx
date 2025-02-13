import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Roamly</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/my-trips">My Trips</Link></li>
        <li><Link to="/points">My points</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/trip-planner">Create a trip</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
