import React, { useState } from 'react';
// Import the styling from homepage.css
import '../styles/homepage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeButton, setActiveButton] = useState('All');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleButtonClick = (category) => {
    setActiveButton(category);
  };

  return (
    <div className="home-page">
      {/* Filter buttons */}
      <div className="button-container">
        {['All', 'Hotel', 'Restaurant', 'Activity'].map((category) => (
          <button
            key={category}
            className={`filter-button ${activeButton === category ? 'active' : ''}`}
            onClick={() => handleButtonClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search bar with controlled input */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Where are you going?"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </form>

      {searchQuery && <p>You are searching for: {searchQuery}</p>}

      {/* Popular destinations section */}
      <div className="popular-destinations">
        <h2>Popular Destinations</h2>
        <p className="subtext">Most users choose these destinations</p> 
      </div>
    </div>
  );
};

export default HomePage;
