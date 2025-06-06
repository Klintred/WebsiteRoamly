import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Popup from '../components/Cards/Popup'; 

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
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [accessibilityFilter, setAccessibilityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Modal state management
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

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
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/v1/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserTrips(data.data.trips || []);
      } catch (error) {
        console.error("Error fetching user trips:", error);
      }
    };

    fetchUserTrips();
  }, []);

  const getOverallAccessibilityScore = (placeName) => {
    const placeReviews = reviews.filter(review => review.placeName === placeName);
    if (placeReviews.length === 0) return "No score";

    const scoreCounts = { "Fully accessible": 0, "Adjustments needed": 0, "Not accessible": 0 };

    placeReviews.forEach(review => {
      const sections = ['general', 'parking', 'entrance', 'internalNavigation', 'sanitary'];
      sections.forEach(sectionKey => {
        const section = review[sectionKey];
        if (section) {
          Object.values(section).forEach(answer => {
            if (!answer) return;
            let mappedAnswer;
            if (answer.toLowerCase() === "yes") {
              mappedAnswer = "Fully accessible";
            } else if (["partial", "sometimes"].includes(answer.toLowerCase())) {
              mappedAnswer = "Adjustments needed";
            } else if (answer.toLowerCase() === "no") {
              mappedAnswer = "Not accessible";
            } else {
              mappedAnswer = "Not accessible";
            }
            scoreCounts[mappedAnswer]++;
          });
        }
      });
    });

    let highestScore = "No score";
    let maxCount = 0;
    Object.entries(scoreCounts).forEach(([label, count]) => {
      if (count > maxCount) {
        maxCount = count;
        highestScore = label;
      }
    });

    return highestScore;
  };

  const getLabelColor = (score) => {
    switch (score) {
      case "Fully accessible":
        return "green";
      case "Adjustments needed":
        return "orange";
      case "Not accessible":
        return "red";
      default:
        return "gray";
    }
  };

  const fetchCoordinates = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinates?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data.lat && data.lng) {
        setCoordinates(`${data.lat},${data.lng}`);
      } else {
        setCoordinates('');
      }
    } catch (error) {
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
      const data = await response.json();
      return data;
    } catch (error) {
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
          <div className='search-filter-content'>
            <div className='flex-row search-input-container'>
              <label htmlFor="location-input" className='search-label'>Where</label>
              <input
                id="location-input"
                type="text"
                className="location-input"
                placeholder="Where are you going or name of place?"
                value={location}
                onChange={handleSearchInputChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => location && setShowSuggestions(true)}
                autoComplete="off"
              />
            </div>
            <div className='flex-row search-input-container'>
              <label htmlFor="accessibility-filter" className='search-label'>Accessibility</label>
              <select
                id="accessibility-filter"
                className="search-input"
                value={accessibilityFilter}
                onChange={(e) => setAccessibilityFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Fully accessible">Fully accessible</option>
                <option value="Adjustments needed">Adjustments needed</option>
                <option value="Not accessible">Not accessible</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ResultsSection
        title="Hotels"
        data={hotels}
        filter={filter}
        accessibilityFilter={accessibilityFilter}
        type="hotel"
        loading={loading}
        getOverallAccessibilityScore={getOverallAccessibilityScore}
        getLabelColor={getLabelColor}
        setSelectedPlace={setSelectedPlace}
        setShowModal={setShowModal}
      />
      <ResultsSection
        title="Restaurants"
        data={restaurants}
        filter={filter}
        accessibilityFilter={accessibilityFilter}
        type="restaurant"
        loading={loading}
        getOverallAccessibilityScore={getOverallAccessibilityScore}
        getLabelColor={getLabelColor}
        setSelectedPlace={setSelectedPlace}
        setShowModal={setShowModal}
      />
      <ResultsSection
        title="Activities"
        data={activities}
        filter={filter}
        accessibilityFilter={accessibilityFilter}
        type="activity"
        loading={loading}
        getOverallAccessibilityScore={getOverallAccessibilityScore}
        getLabelColor={getLabelColor}
        setSelectedPlace={setSelectedPlace}
        setShowModal={setShowModal}
      />

      {/* Popup Component */}
      <Popup
        showModal={showModal}
        selectedPlace={selectedPlace}
        userTrips={userTrips}
        selectedTripId={selectedTripId}
        setSelectedTripId={setSelectedTripId}
        selectedDayIndex={selectedDayIndex}
        setSelectedDayIndex={setSelectedDayIndex}
        handleAddActivityToTrip={async () => {
          try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE_URL}/api/v1/trips/add-activity`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                tripId: selectedTripId,
                dayIndex: selectedDayIndex,
                activity: selectedPlace.name
              })
            });
            alert(`Added "${selectedPlace.name}" to the trip!`);
            setShowModal(false);
          } catch (error) {
            alert("Failed to add activity. Please try again.");
          }
        }}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

const ResultsSection = ({ title, data, filter, accessibilityFilter, type, loading, getOverallAccessibilityScore, getLabelColor, setSelectedPlace, setShowModal }) => {
  if ((filter !== 'all' && filter !== type)) return null;

  const filteredData = data.filter(place => {
    const score = getOverallAccessibilityScore(place.name);
    if (accessibilityFilter === 'all') return true;
    return score === accessibilityFilter;
  });

  return (
    <>
      <div className='line'></div>
      <h2>{title}</h2>
     <div className={`search-results-wrapper ${filter === 'all' ? 'wide' : ''}`}>

      <div className={`search-results ${filter !== 'all' ? 'wrapped' : 'scrollable'}`}>

        {loading
          ? [...Array(5)].map((_, i) => <SkeletonCard key={`${type}-skeleton-${i}`} />)
          : filteredData.map((place) => (
            <PlaceCard
              key={place.id || place.place_id}
              place={place}
              type={type}
              getOverallAccessibilityScore={getOverallAccessibilityScore}
              getLabelColor={getLabelColor}
              setSelectedPlace={setSelectedPlace}
              setShowModal={setShowModal}
            />
          ))
        }
      </div>
      </div>
    </>
  );
};

const PlaceCard = ({ place, type, getOverallAccessibilityScore, getLabelColor, setSelectedPlace, setShowModal }) => {
  const placeId = place.id || place.place_id;
  const detailType = type === 'activity' ? 'activities' : `${type}s`;
  const accessibilityScore = getOverallAccessibilityScore(place.name);
  const labelColor = getLabelColor(accessibilityScore);

  return (
    <div className="place-card">
      <div className={`image-container border-${labelColor}`}>
        <div className={`accessibility-label ${labelColor}`}>
          {accessibilityScore}
        </div>
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
        <button
          className="add-to-trip-button"
          onClick={() => {
            setSelectedPlace(place);
            setShowModal(true);
          }}
        >
          Add to Trip
        </button>
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
