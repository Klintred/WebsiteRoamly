import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';

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

  useEffect(() => {
    if (location) {
      fetchCoordinates(location);
    }
  }, [location]);

  useEffect(() => {
    if (coordinates) {
      fetchAllPlaces();
    }
  }, [filter, searchQuery, coordinates]);

  const fetchCoordinates = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/coordinates?location=${encodeURIComponent(location)}`);
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
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}`);
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

  return (
    <div className="home-page">
      <h1>Ontdek Plaatsen</h1>
      <div className="search-filter">
        <input
          type="text"
          className="search-input"
          placeholder="Voer een stad of land in..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
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
        {data.map((place) => <PlaceCard key={place.id} place={place} />)}
      </div>
    </>
  );
};

const PlaceCard = ({ place }) => (
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
      <Link to={`/place-detail/${place.id}`}>
        <button className="view-details-button">Bekijk details</button>
      </Link>
    </div>
  </div>
);

export default HomePage;
