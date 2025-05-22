import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://roamly-api.onrender.com';

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Paris, France');
  const [coordinates, setCoordinates] = useState('48.8566,2.3522');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Haal coordinaten op als locatie verandert
  useEffect(() => {
    if (location) {
      fetchCoordinates(location);
    }
  }, [location]);

  // Fetch plaatsen als filter, searchQuery of coordinates veranderen
  useEffect(() => {
    if (coordinates) {
      fetchAllPlaces();
    }
  }, [filter, searchQuery, coordinates]);

  // Debounced suggesties ophalen
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 2) return setSuggestions([]);

      try {
        const response = await fetch(`${API_BASE_URL}/api/autocomplete?query=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Suggesties ophalen mislukt:", error);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [location]);

  const fetchCoordinates = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinates?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data.lat && data.lng) {
        setCoordinates(`${data.lat},${data.lng}`);
      } else {
        throw new Error("Locatie niet gevonden.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlaces = async () => {
    setError(null);
    setLoading(true);
    try {
      const radius = 50000;
      let hotelData = [], restaurantData = [], activityData = [];

      const fetchHotelPromise = (filter === 'all' || filter === 'hotel')
        ? fetchPlaces(`hotels ${searchQuery}`, coordinates, radius)
        : Promise.resolve([]);

      const fetchRestaurantPromise = (filter === 'all' || filter === 'restaurant')
        ? fetchPlaces(`restaurants ${searchQuery}`, coordinates, radius)
        : Promise.resolve([]);

      const fetchActivityPromise = (filter === 'all' || filter === 'activity')
        ? fetchPlaces(`tourist attractions ${searchQuery}`, coordinates, radius)
        : Promise.resolve([]);

      [hotelData, restaurantData, activityData] = await Promise.all([
        fetchHotelPromise,
        fetchRestaurantPromise,
        fetchActivityPromise
      ]);

      setHotels(hotelData);
      setRestaurants(restaurantData);
      setActivities(activityData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async (query, location, radius) => {
    try {
      const cleanedQuery = query.trim();
      const response = await fetch(`${API_BASE_URL}/api/places?query=${encodeURIComponent(cleanedQuery)}&location=${location}&radius=${radius}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server gaf geen geldige JSON terug.");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error(`Fout bij ophalen van gegevens:`, error);
      return [];
    }
  };

  // Wanneer gebruiker iets typt in de zoekbalk, updaten we location en zoeken we ook direct op naam
  const handleSearchInputChange = (e) => {
    setLocation(e.target.value);
    setSearchQuery(e.target.value); // zodat zoekresultaten mee filteren op naam
    setShowSuggestions(true);
  };

  return (
    <div className="home-page">
      <h1>Ontdek Plaatsen</h1>

      <div className="search-filter">
        <div className="search-wrapper" style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Voer een stad, plaats of naam in..."
            value={location}
            onChange={handleSearchInputChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => location && setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderTop: 'none',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 10,
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setLocation(suggestion);
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  style={{ padding: '10px', cursor: 'pointer' }}
                  onMouseDown={e => e.preventDefault()} // voorkomt dat blur afbreekt click
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="all">Alle</option>
          <option value="hotel">Hotels</option>
          <option value="restaurant">Restaurants</option>
          <option value="activity">Activiteiten</option>
        </select>
      </div>

      {loading && <p>Zoeken...</p>}
      {error && <p className="error-message">{error}</p>}

      <ResultsSection title="Hotels" data={hotels} filter={filter} type="hotel" />
      <ResultsSection title="Restaurants" data={restaurants} filter={filter} type="restaurant" />
      <ResultsSection title="Activiteiten" data={activities} filter={filter} type="activity" />
    </div>
  );
};

const ResultsSection = ({ title, data, filter, type }) => {
  if ((filter !== 'all' && filter !== type) || data.length === 0) return null;
  return (
    <>
      <h2>{title}</h2>
      <div className="search-results">
        {data.map((place) => <PlaceCard key={place.id} place={place} type={type} />)}
      </div>
    </>
  );
};

const PlaceCard = ({ place, type }) => (
  <div className="place-card">
    <div className="image-container">
      <img src={place.photo} alt={place.name} className="place-image" />
    </div>
    <div className="content">
      <h3>{place.name}</h3>
      <p className="location-text">{place.address}</p>
      {place.rating && <p className="review-rating">⭐ {place.rating}</p>}
    </div>
    <div className="button-container">
      <Link to={`/${type}s/${place.id}`}>
        <button className="view-details-button">Bekijk details</button>
      </Link>
    </div>
  </div>
);

export default HomePage;
