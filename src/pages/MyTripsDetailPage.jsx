import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "../styles/mytrips.css";

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

  // 1️⃣ Haal API key op bij mount
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

  const handleAddActivity = (activity) => {
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
  };

  const handleRemoveActivity = (activity) => {
    const updatedItinerary = [...trip.parsedPlan.itinerary];
    updatedItinerary[selectedDay].activities = updatedItinerary[selectedDay].activities.filter(
      (a) => a !== activity
    );
    setTrip((prev) => ({
      ...prev,
      parsedPlan: { ...prev.parsedPlan, itinerary: updatedItinerary },
    }));
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
    if (place.photo) return place.photo;
    if (place.photo_reference && apiKey) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=${apiKey}`;
    }
    return "https://via.placeholder.com/100x100?text=No+Image";
  };

  const renderPlaceCard = (name) => {
    const place = places[name];
    if (!place) {
      getPlaceDetails(name);
      return <p className="text-sm text-gray-500">Loading {name}...</p>;
    }

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name + " " + (place.address || "")
    )}`;

    return (
      <div className="activity-item">
        <img
          src={getPhotoUrl(place)}
          alt={place.name}
          className="w-24 h-24 object-cover rounded-lg"
          loading="lazy"
        />
        <div>
          <h4>{place.name}</h4>
          <p>{place.address}</p>
          <p>⭐ {place.rating || "N/A"}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Bekijk op Maps
          </a>
        </div>
      </div>
    );
  };

  if (loading) return <p className="text-center mt-12">Loading...</p>;
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;
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
    <div className="max-w-4xl mx-auto">
      <div className="mt-12 trip-card">
        <img src="../assets/images/loginimage.png" alt="" />
        <div className="trip-details">
          <h1>{trip.TripName}</h1>
          <h2>{trip.Place},</h2>
          <div className="dates-container">
            <p className="trip-dates">
              from {new Date(trip.StartDate).toLocaleDateString()} until{" "}
              {new Date(trip.EndDate).toLocaleDateString()}
            </p>
          </div>
          <div className="day-buttons mb-6">
            {itinerary.map((day, index) => (
              <button
                key={index}
                className={selectedDay === index ? "active" : ""}
                onClick={() => setSelectedDay(index)}
              >
                {`Day ${index + 1} - ${getDateForDay(index) || "No date"}`}
              </button>
            ))}
          </div>

          <div className="line"></div>

          <div className="day-panel">
            <ul className="activity-list">
              {itinerary[selectedDay]?.activities?.map((activity, idx) => (
                <li key={idx} className="activity-item">
                  <FaMapMarkerAlt />
                  {renderPlaceCard(activity)}
                  <button onClick={() => handleRemoveActivity(activity)}>
                    Verwijderen
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <label>Filter:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="ml-2"
              >
                <option value="all">Alles</option>
                <option value="places">Bezienswaardigheden</option>
                <option value="restaurants">Restaurants</option>
              </select>

              <h5 className="mt-4">Voorgestelde activiteiten:</h5>
              <div className="suggestions grid gap-4">
                {suggestedPlaces.map((place, idx) => {
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    place.name + " " + (place.address || "")
                  )}`;
                  return (
                    <div key={idx} className="activity-item suggestion">
                      <img
                        src={getPhotoUrl(place)}
                        alt={place.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div>
                        <h4>{place.name}</h4>
                        <p>{place.address}</p>
                        <p>⭐ {place.rating || "N/A"}</p>
                        <button
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => handleAddActivity(place.name)}
                        >
                          Toevoegen
                        </button>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Bekijk op Maps
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTripsDetailPage;
