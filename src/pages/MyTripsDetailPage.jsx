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
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState("activity");
  const confirmDelete = (item, type = "activity") => {
    setItemToDelete(item);
    setItemType(type);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (itemType === "activity") {
      handleRemoveActivity(itemToDelete);
    } else if (itemType === "restaurant") {
      handleRemoveRestaurant(itemToDelete);
    } else if (itemType === "hotel") {
      handleRemoveHotel();
    }
    setShowModal(false);
    setItemToDelete(null);
    setItemType("activity");
    setActivityToDelete(null);
  };
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
        console.log("Parsed travel plan:", matchedTrip.parsedPlan);

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

      // Update local state (just in case)
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

      alert("Activity added successfully!");
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
      updatedItinerary[selectedDay].activities = updatedItinerary[selectedDay].activities.filter(
        (a) => a !== activity
      );

      setTrip((prev) => ({
        ...prev,
        parsedPlan: { ...prev.parsedPlan, itinerary: updatedItinerary },
      }));
    } catch (err) {
      console.error("Failed to remove activity:", err.message);
      alert("Failed to remove activity. Please try again.");
    }
  };
  const handleRemoveRestaurant = async (restaurant) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/v1/trips/remove-restaurant`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip._id,
          dayIndex: selectedDay,
          restaurant,
        }),
      });

      if (!response.ok) throw new Error("Failed to remove restaurant");

      const updatedItinerary = [...trip.parsedPlan.itinerary];
      updatedItinerary[selectedDay].restaurants = updatedItinerary[selectedDay].restaurants.filter(
        (r) => r !== restaurant
      );

      setTrip((prev) => ({
        ...prev,
        parsedPlan: { ...prev.parsedPlan, itinerary: updatedItinerary },
      }));
    } catch (err) {
      console.error("Failed to remove restaurant:", err.message);
      alert("Failed to remove restaurant.");
    }
  };

  const handleRemoveHotel = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/v1/trips/remove-hotel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId: trip._id }),
      });

      if (!response.ok) throw new Error("Failed to remove hotel");

      const updatedPlan = { ...trip.parsedPlan, hotel: null };
      setTrip((prev) => ({
        ...prev,
        parsedPlan: updatedPlan,
      }));
    } catch (err) {
      console.error("Failed to remove hotel:", err.message);
      alert("Failed to remove hotel.");
    }
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
      return `https://maps.googleapis.com/maps/api/hotels/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=${apiKey}`;
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
          className="svg-icon"
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
    <div className="container">
      <div className="trip-card">
        <img src="../assets/images/loginImage.png" alt="" />
        <div className="trip-details">

          <h1>{trip.TripName}</h1>
          <h2>{trip.Place},</h2>
          <div className="dates-container">
            <p className="trip-dates">
              from {new Date(trip.StartDate).toLocaleDateString()} until{" "}
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
                {`Day ${index + 1} - ${getDateForDay(index) || "No date"}`}
              </button>
            ))}
          </div>

          <div className="line"></div>
          <h2>Your travel plan</h2>

          <div className="day-panel">
            {selectedDay === 0 && trip.parsedPlan?.hotel && (
              <div className="section-block">
                <h3 className="section-title">🏨 Hotel</h3>
                <div className="activity-item">
                  <div className="activity-content">
                    <p>{trip.parsedPlan.hotel}</p>
                  </div>
                  <button onClick={() => confirmDelete(trip.parsedPlan.hotel, "hotel")} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            )}

            <div className="section-block">
              <h3 className="section-title">🎯 Activities</h3>
              {itinerary[selectedDay]?.activities?.length > 0 ? (
                <ul className="activity-list">
                  {itinerary[selectedDay].activities.map((activity, idx) => {
                    const isDescriptive =
                      /^[A-Z][^.?!]+[.?!]$/.test(activity) || activity.length > 40;

                    return (
                      <li key={idx} className="activity-item">
                        <div className="activity-content">
                          {isDescriptive ? (
                            <div className="text-activity-block">
                              {activity.split('.').map((sentence, i) =>
                                sentence.trim() ? (
                                  <p key={i} className="mb-2">{sentence.trim()}.</p>
                                ) : null
                              )}
                            </div>
                          ) : (
                            renderPlaceCard(activity)
                          )}
                        </div>
                        <button
                          onClick={() => confirmDelete(activity, "activity")}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No activities planned for this day.</p>
              )}
            </div>

            {itinerary[selectedDay]?.restaurants?.length > 0 && (
              <div className="section-block">
                <h3 className="section-title">🍽 Restaurants</h3>
                <ul className="activity-list">
                  {itinerary[selectedDay].restaurants.map((r, i) => (
                    <li key={i} className="activity-item">
                      <div className="activity-content">{r}</div>
                      <button onClick={() => confirmDelete(r, "restaurant")} className="delete-button">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          <div className="line"></div>
          <h2>Add suggested activities</h2>

          <div className="filter-buttons">
            <div className="day-buttons">
              {[
                { label: "All", value: "all" },
                { label: "Places", value: "places" },
                { label: "Restaurants", value: "restaurants" },
              ].map((option) => (
                <button
                  key={option.value}
                  className={filterType === option.value ? "active" : ""}
                  onClick={() => setFilterType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

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
        {showModal && (
          <div className="modal-container">
            <div className="modal-content">
              <h3>Are you sure you want to delete this activity?</h3>
              <div className="modal-container-buttons">
                <PrimaryButton
                  text="Yes, continue"
                  onClick={() => handleDeleteConfirmed()}
                />
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
