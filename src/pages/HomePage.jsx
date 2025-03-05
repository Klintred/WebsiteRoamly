import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';
import '../components/Buttons/buttons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar} from '@fortawesome/free-solid-svg-icons';


const API_KEY = 'AIzaSyBO0gm7S42KuQqgWTO63H-LCWix5488bMU'; // Vervang met je eigen API-key
const PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const PLACE_DETAILS_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  const fetchAllPlaces = async () => {
    setError(null);
    setLoading(true);

    try {
      const [hotelData, restaurantData, activityData] = await Promise.all([
        fetchPlaces('hotels in Europe', 'Hotel'),
        fetchPlaces('restaurants in Europe', 'Restaurant'),
        fetchPlaces('things to do in Europe', 'Activity'),
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

  const fetchPlaces = async (query, type) => {
    const apiUrl = `${PLACES_API_BASE_URL}?query=${encodeURIComponent(query)}&key=${API_KEY}`;
    const proxiedUrl = `${PROXY_URL}${encodeURIComponent(apiUrl)}`;

    try {
      const response = await fetch(proxiedUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(data.error_message || `Geen resultaten gevonden voor ${type}.`);
      }

      return await filterAccessiblePlaces(data.results, type);
    } catch (error) {
      console.error(`Fout bij ophalen van ${type}:`, error);
      return [];
    }
  };

  const filterAccessiblePlaces = async (places, type) => {
    if (type === 'Hotel') {
      return filterAccessibleHotels(places);
    } else {
      return places.map((place) => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        photo: place.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
          : 'https://via.placeholder.com/150',
      }));
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
        console.error("Fout bij ophalen van details:", error);
      }
    }
    return filteredHotels;
  };

  return (
    <div className="home-page">
      <h1>Ontdek Europa</h1>

      {loading && <p>Zoeken...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Hotels Sectie */}
      <h2>Hotels</h2>
      <div className="search-results">
        {hotels.length > 0 ? hotels.map((place) => <PlaceCard key={place.id} place={place} />) : <p>Geen hotels gevonden.</p>}
      </div>

      {/* Restaurants Sectie */}
      <h2>Restaurants</h2>
      <div className="search-results">
        {restaurants.length > 0 ? restaurants.map((place) => <PlaceCard key={place.id} place={place} />) : <p>Geen restaurants gevonden.</p>}
      </div>

      {/* Activiteiten Sectie */}
      <h2>Activiteiten</h2>
      <div className="search-results">
        {activities.length > 0 ? activities.map((place) => <PlaceCard key={place.id} place={place} />) : <p>Geen activiteiten gevonden.</p>}
      </div>
    </div>
  );
};



const PlaceCard = ({ place }) => (
  <div className="place-card">
    {/* Image now spans full width and touches the top */}
    <div className="image-container">
      <img src={place.photo} alt={place.name} className="place-image" />
      {<span className="accessibility-label">Fully accessible</span>}
    </div>

    {/* Content below image */}
    <div className="content">
      <h3>{place.name}</h3>
      
      {/* Location is properly aligned */}
      <div className="location-container">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
        <span className="location-text">{place.address}</span>
      </div>

      {/* Star Rating */}
      {place.rating && (
        <div className="review-rating">
          <FontAwesomeIcon icon={faStar} className="star-icon" />
          <span>{place.rating}</span>
        </div>
      )}
    </div>

    {/* Button stays inside the card */}
    <div className="button-container">
      <Link to={`/place-detail/${place.id}`}>
        <button className="view-details-button">Bekijk details</button>
      </Link>
    </div>
  </div>
);




export default HomePage;
