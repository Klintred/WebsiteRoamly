import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const API_BASE_URL = 'https://roamly-api.onrender.com';

const extractCityCountry = (fullAddress) => {
  if (!fullAddress) return '';
  const parts = fullAddress.split(',').map(part => part.trim());
  if (parts.length >= 2) {
    let city = parts[parts.length - 2];
    const country = parts[parts.length - 1];
    city = city.replace(/^\d{4,5}\s*/, '');
    return `${city}, ${country}`;
  }
  return fullAddress;
};

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const dummyHotel = {
      id: 'dummy-hotel-1',
      name: 'Demo Hotel Example',
      address: '123 Example Street, Amsterdam, Netherlands',
      photo: 'https://via.placeholder.com/300x200?text=Demo+Hotel',
      price: '€120 per night',
    };
    setHotels([dummyHotel]);
  }, []);

  useEffect(() => {
    if (location) {
      fetchCoordinates(location);
    }
  }, [location]);

  useEffect(() => {
    fetchAllPlaces();
  }, [filter, searchQuery, coordinates]);

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

    const delayDebounce = setTimeout(fetchSuggestions, 300);
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
        console.warn("Locatie niet gevonden, maar doorgaan met zoekopdracht.");
        setCoordinates('');
      }
    } catch (error) {
      console.warn("Fout bij locatie zoeken:", error);
      setCoordinates('');
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

      const dummyHotel = {
        id: 'dummy-hotel-1',
        name: 'Demo Hotel Example',
        address: '123 Example Street, Amsterdam, Netherlands',
        photo: 'https://via.placeholder.com/300x200?text=Demo+Hotel',
        price: '€120 per night',
      };

      setHotels([dummyHotel, ...hotelData]);
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
      const locationParam = location ? `&location=${location}` : '';
      const response = await fetch(`${API_BASE_URL}/api/places?query=${encodeURIComponent(cleanedQuery)}${locationParam}&radius=${radius}`);
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

  const handleSearchInputChange = (e) => {
    setLocation(e.target.value);
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="home-page">
      <div className='home-header'>
        <h1>Plan your accessible trip, without barriers.</h1>
        <div className="filter-buttons-container">
          {['all', 'hotel', 'restaurant', 'activity'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`filter-button ${filter === item ? 'active' : ''}`}
            >
              {item === 'all' ? 'All' :
                item === 'hotel' ? 'Hotels' :
                  item === 'restaurant' ? 'Restaurants' :
                    'Activities'}
            </button>
          ))}
        </div>
        <div className="search-filter">
          <div>
            <div className='flex-row'>
              <label htmlFor="location-input" className='search-label'>
                Where
              </label>
              <div className="search-wrapper">
                <input
                  id="location-input"
                  type="text"
                  className="search-input"
                  placeholder="Where are you going or name of place?"
                  value={location}
                  onChange={handleSearchInputChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => location && setShowSuggestions(true)}
                  autoComplete="off"
                />
              </div>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setLocation(suggestion);
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='vertical-line-search'></div>
          <div className='flex-row'>
            <label htmlFor="accessibility-input" className='search-label'>
              Accessibility filters
            </label>
            <div className="search-wrapper">
              <select
                id="accessibility-input"
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <option value="">Select accessibility filters</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ResultsSection title="Hotels" data={hotels} filter={filter} type="hotel" loading={loading} />
      <ResultsSection title="Restaurants" data={restaurants} filter={filter} type="restaurant" loading={loading} />
      <ResultsSection title="Activities" data={activities} filter={filter} type="activity" loading={loading} />
    </div>
  );
};

const ResultsSection = ({ title, data, filter, type, loading }) => {
  if ((filter !== 'all' && filter !== type)) return null;
  return (
    <>
      <div className='line'></div>
      <h2>{title}</h2>
      <div className="search-results">
        {loading
          ? [...Array(5)].map((_, i) => <SkeletonCard key={`${type}-skeleton-${i}`} />)
          : data.map((place) => <PlaceCard key={place.id || place.place_id} place={place} type={type} />)
        }
      </div>
    </>
  );
};

const PlaceCard = ({ place, type }) => {
  const placeId = place.id || place.place_id;
  const detailType = type === 'activity' ? 'activities' : `${type}s`;

  return (
    <div className="place-card">
      <div className="image-container">
        <img src={place.photo || "https://via.placeholder.com/300x200?text=No+Image"} alt={place.name} className="place-image" />
      </div>
      <div className="content">
        <h3>{place.name}</h3>
        <div className='flex-row'>
          <div className='flex-column'>
            <span className="material-symbols-outlined">location_on</span>
            <p className="location-text">{extractCityCountry(place.address)}</p>
          </div>
          <div className='flex-column'>
            <span className="material-symbols-outlined">paid</span>
            <p className="price-text">{place.price || 'Price not available'}</p>
          </div>
        </div>
      </div>
      <div className="button-container">
        {placeId ? (
          <Link to={`/${detailType}/${placeId}`}>
            <button className="view-details-button">View details</button>
          </Link>
        ) : (
          <button className="view-details-button" disabled>No details available</button>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="place-card">
    <div className="image-container">
      <Skeleton height={200} />
    </div>
    <div className="content">
      <h3><Skeleton width={`80%`} /></h3>
      <div className='flex-row'>
        <div className='flex-column'>
          <Skeleton width={100} height={20} />
        </div>
        <div className='flex-column'>
          <Skeleton width={80} height={20} />
        </div>
      </div>
    </div>
    <div className="button-container">
      <Skeleton height={40} width={`90%`} borderRadius={8} />
    </div>
  </div>
);

export default HomePage;
