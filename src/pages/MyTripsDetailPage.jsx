import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/mytrips.css";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const API_BASE_URL = "https://roamly-api.onrender.com/api";

const fetchPlaceDetails = async (placeName, location = "", radius = 50000) => {
  const params = new URLSearchParams({ query: placeName, radius });
  if (location) params.append("location", location);
  const url = `${API_BASE_URL}/places?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch place details");
  const data = await response.json();
  return data || [];
};

const MyTripsDetailPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [places, setPlaces] = useState({});
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [apiKey, setApiKey] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/google-api-key`);
        const data = await res.json();
        if (data && data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          throw new Error("API key niet gevonden");
        }
      } catch (err) {
        console.error("API key ophalen mislukt:", err);
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/v1/trips`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch trip");
        const data = await res.json();
        const matchedTrip = data.data.trips.find((t) => t._id === tripId);
        if (matchedTrip) {
          matchedTrip.parsedPlan =
            typeof matchedTrip.Plan === "string"
              ? JSON.parse(matchedTrip.Plan)
              : matchedTrip.Plan;
          setTrip(matchedTrip);
        } else {
          setError("Trip not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    if (trip?.parsedPlan?.itinerary?.length > 0) {
      const country = trip.Country || trip.TripName.split(" ").pop();
      fetchSuggestedActivities(country);
    }
  }, [filterType, trip]);

  const fetchSuggestedActivities = async (country) => {
    let query =
      filterType === "places"
        ? `tourist attractions in ${country}`
        : filterType === "restaurants"
          ? `restaurants in ${country}`
          : `things to do in ${country}`;
    try {
      const results = await fetchPlaceDetails(query);
      setSuggestedPlaces(results.slice(0, 3));
    } catch (e) {
      console.error("Suggestion fetch failed", e);
    }
  };

  const handleAddActivity = async (activity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/v1/trips/add-activity`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip._id,
          dayIndex: selectedDay,
          activity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add activity");
      }

      // Update itinerary
      const updatedItinerary = [...trip.parsedPlan.itinerary];
      const activities = updatedItinerary[selectedDay].activities || [];
      if (!activities.includes(activity)) {
        activities.push(activity);
        updatedItinerary[selectedDay].activities = activities;
        setTrip((prev) => ({
          ...prev,
          parsedPlan: { ...prev.parsedPlan, itinerary: updatedItinerary },
        }));
      }

      // Remove the added suggestion from suggestedPlaces
      setSuggestedPlaces((prev) =>
        prev.filter((place) => place.name !== activity)
      );

    } catch (err) {
      console.error("Failed to add activity:", err.message);
      alert("Failed to add activity. Please try again.");
    }
  };

  const handleRemoveActivity = async (activity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/v1/trips/remove-activity`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip._id,
          dayIndex: selectedDay,
          activity,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove activity");
      }
      const updatedItinerary = [...trip.parsedPlan.itinerary];
      updatedItinerary[selectedDay].activities = updatedItinerary[
        selectedDay
      ].activities.filter((a) => a !== activity);
      setTrip((prev) => ({
        ...prev,
        parsedPlan: { ...prev.parsedPlan, itinerary: updatedItinerary },
      }));
    } catch (err) {
      console.error("Failed to remove activity:", err.message);
      alert("Failed to remove activity. Please try again.");
    }
  };

  const confirmDelete = (activity) => {
    setActivityToDelete(activity);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    handleRemoveActivity(activityToDelete);
    setShowModal(false);
    setActivityToDelete(null);
  };

  const getPlaceDetails = async (placeName) => {
    if (!places[placeName]) {
      try {
        const details = await fetchPlaceDetails(placeName);
        setPlaces((prev) => ({ ...prev, [placeName]: details[0] }));
      } catch (e) {
        console.error("Place fetch failed", e);
      }
    }
  };

  const getPhotoUrl = (place) => {
    if (place?.photo) return place.photo;
    if (place?.photos?.length > 0 && apiKey) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
    }
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  const getMapsUrl = (place) => {
    const query = encodeURIComponent(`${place.name} ${place.address || ""}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const renderPlaceCard = (name) => {
    const place = places[name];
    if (!place) {
      getPlaceDetails(name);
      return <p >Loading {name}...</p>;
    }
    return (
      <div className="activity-item-content">
        <img src={getPhotoUrl(place)} alt={place.name} />
        <div className="flex-row">
          <h4>{place.name}</h4>
          <p>{place.address}</p>
          <p>⭐ {place.rating || "N/A"}</p>
          <a
            href={getMapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="view-maps-link"
          >
            View on maps
          </a>
        </div>
      </div>
    );
  };
  const renderPlaceCardFromObject = (place) => {
    return (
      <div className="activity-item-content">
        <img src={getPhotoUrl(place)} alt={place.name} />
        <div className="flex-row">
          <h4>{place.name}</h4>
          <p>{place.address}</p>
          <p>⭐ {place.rating || "N/A"}</p>
          <a
            href={getMapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="view-maps-link"
          >
            View on maps
          </a>
        </div>
      </div>
    );
  };


  if (loading) return <p >Loading...</p>;
  if (error) return <p >{error}</p>;
  if (!trip) return null;

  const itinerary = trip.parsedPlan?.itinerary || [];
  const startDate = trip.StartDate ? new Date(trip.StartDate) : null;

  const getDateForDay = (index) => {
    if (!startDate) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString();
  };

  return (
    <div className="container">
      <div className="trip-card">
        <div className="trip-card-header">
          <div className="trip-details">
            <h1>{trip.TripName}</h1>
            <h2>{trip.Place}</h2>
            <p>
              From {new Date(trip.StartDate).toLocaleDateString()} until{" "}
              {new Date(trip.EndDate).toLocaleDateString()}
            </p>
          </div>
          <div className="day-buttons">
            {itinerary.map((day, index) => (
              <button
                key={index}
                className={selectedDay === index ? "active" : ""}
                onClick={() => setSelectedDay(index)}
              >
                Day {index + 1} - {getDateForDay(index) || "No date"}
              </button>
            ))}
          </div>
        </div>

        <div className="line"></div>
        <h2>Your travel plan</h2>

        <div className="day-panel">
          {selectedDay === 0 && trip.parsedPlan?.hotel && (
            <div className="section-block">
              <h3 className="section-title">Hotel</h3>
              <div className="activity-item">
                {renderPlaceCard(trip.parsedPlan.hotel)}
                <button
                  onClick={() => confirmDelete(trip.parsedPlan.hotel)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="section-block">
            <h3 className="section-title">Activities</h3>
            {itinerary[selectedDay]?.activities?.length > 0 ? (
              <ul className="activity-list">
                {itinerary[selectedDay].activities.map((activity, idx) => (
                  <li key={idx} className="activity-item">
                    {renderPlaceCard(activity)}
                    <button
                      onClick={() => confirmDelete(activity)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activities planned for this day.</p>
            )}

            {itinerary[selectedDay]?.restaurants?.length > 0 && (
              <div className="section-block">
                <h3 className="section-title">Restaurants</h3>
                <ul className="activity-list">
                  {itinerary[selectedDay].restaurants.map((r, i) => (
                    <li key={i} className="activity-item">
                      {renderPlaceCard(r)}
                      <button
                        onClick={() => confirmDelete(r)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>          </div>


        <div className="line"></div>
        <div className="flex-row">
          <h2>Add suggested activities</h2>

          <div className="day-buttons">
            {["all", "places", "restaurants"].map((type) => (
              <button
                key={type}
                className={filterType === type ? "active" : ""}
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="suggestions ">
          {suggestedPlaces.length === 0 ? (
            <p className="no-suggestions">No suggestions available.</p>
          ) : (
            suggestedPlaces.map((place, idx) => (
              <div key={idx} className="activity-item suggestion">
                {renderPlaceCardFromObject(place)}
                <button
                  onClick={() => handleAddActivity(place.name)}
                  className="add-button"
                >
                  Add to Trip
                </button>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-container">
            <div className="modal-content">
              <h3>Are you sure you want to delete this activity?</h3>
              <div className="modal-container-buttons">
                <PrimaryButton text="Yes, continue" onClick={handleDeleteConfirmed} />
                <PrimaryButton
                  text="No, I'm done"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTripsDetailPage;
