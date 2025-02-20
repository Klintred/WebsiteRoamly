import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

const API_KEY = 'AIzaSyBO0gm7S42KuQqgWTO63H-LCWix5488bMU'; // Vervang met je API Key
const PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const PLACE_DETAILS_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const PROXY_URL = 'https://api.allorigins.win/raw?url='; // Proxy om CORS te omzeilen

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('hotels in Europe');
  const [activeButton, setActiveButton] = useState('Hotel');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    fetchPlaces(searchQuery, activeButton);
  }, [searchQuery, activeButton]);

  const fetchPlaces = async (query, type, pageToken = null) => {
    setError(null);
    setLoading(true);
    if (!pageToken) setPlaces([]);

    const typeParam = type !== 'All' ? `&type=${type.toLowerCase().replace('activity', 'tourist_attraction')}` : '';
    const pageTokenParam = pageToken ? `&pagetoken=${pageToken}` : '';

    const apiUrl = `${PLACES_API_BASE_URL}?query=${encodeURIComponent(query)}${typeParam}&key=${API_KEY}${pageTokenParam}`;
    const proxiedUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

    try {
      const response = await fetch(proxiedUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(data.error_message || "Geen resultaten gevonden.");
      }

      // Filter hotels op rolstoeltoegankelijkheid
      const filteredHotels = await filterAccessibleHotels(data.results);

      setPlaces((prevPlaces) => [...prevPlaces, ...filteredHotels]);

      if (data.next_page_token) {
        setNextPageToken(data.next_page_token);
      } else {
        setNextPageToken(null);
      }

    } catch (error) {
      console.error("Fout bij ophalen van plaatsen:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAccessibleHotels = async (hotels) => {
    const filteredHotels = [];

    for (const hotel of hotels) {
      const detailsUrl = `${PLACE_DETAILS_API_BASE_URL}?place_id=${hotel.place_id}&fields=wheelchair_accessible_entrance,name,formatted_address,rating,photos&key=${API_KEY}`;
      const proxiedDetailsUrl = `${PROXY_URL}${encodeURIComponent(detailsUrl)}`;

      try {
        const response = await fetch(proxiedDetailsUrl);
        const data = await response.json();

        if (data.status === "OK" && data.result.wheelchair_accessible_entrance) {
          filteredHotels.push({
            id: hotel.place_id,
            name: hotel.name,
            address: hotel.formatted_address,
            rating: hotel.rating,
            photo: hotel.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photos[0].photo_reference}&key=${API_KEY}`
              : 'https://via.placeholder.com/150',
          });
        }
      } catch (error) {
        console.error("Fout bij ophalen van hotel details:", error);
      }
    }

    return filteredHotels;
  };

  return (
    <div className="home-page">
      <div className="button-container">
        {['Hotel', 'Restaurant', 'Activity'].map((category) => (
          <button
            key={category}
            className={`filter-button ${activeButton === category ? 'active' : ''}`}
            onClick={() => setActiveButton(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchPlaces(searchQuery, activeButton); }} className="search-form">
        <input
          type="text"
          placeholder="Waar wil je heen?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </form>

      {loading && <p>Zoeken...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="search-results">
        {places.length > 0 ? (
          places.map((place, index) => (
            <div key={index} className="place-card">
              <img src={place.photo} alt={place.name} className="place-image" />
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              {place.rating && <p>⭐ {place.rating}</p>}
              <Link to={`/hotel-detail/${place.id}`}>
                <button className="view-details-button">Bekijk details</button>
              </Link>
            </div>
          ))
        ) : (
          !loading && !error && <p>Geen rolstoeltoegankelijke hotels gevonden.</p>
        )}
      </div>

    </div>
  );
};

export default HomePage;
