import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/mytrips.css";

const API_BASE_URL = "https://roamly-api.onrender.com/api";

const fetchPlaceDetails = async (placeName, location = "", radius = 50000) => {
    const params = new URLSearchParams({ query: placeName, radius });
    if (location) params.append("location", location);

    const url = `${API_BASE_URL}/places?${params.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch place details");
        const data = await response.json();
        return data || [];
    } catch (err) {
        console.error("Roamly API failed:", err.message);
        throw err;
    }
};

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(null);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [places, setPlaces] = useState({});
    const [suggestedPlacesCache, setSuggestedPlacesCache] = useState({});
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const preselectTripId = params.get("tripId");


    useEffect(() => {

        const fetchTrips = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token"); // 🔐 Get the JWT token

                const response = await fetch(`${API_BASE_URL}/v1/trips`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch trips");
                const data = await response.json();

                const parsedTrips = (data.data.trips || []).map((trip) => {
                    let parsedPlan = {};
                    try {
                        parsedPlan = typeof trip.Plan === "string" ? JSON.parse(trip.Plan) : trip.Plan;
                    } catch (e) {
                        console.warn("Plan JSON invalid for trip:", trip.TripName);
                    }
                    return { ...trip, parsedPlan };
                });

                setTrips(parsedTrips.reverse()); 
                if (preselectTripId) {
                    const matchedTrip = parsedTrips.find((trip) => trip._id === preselectTripId);
                    if (matchedTrip && matchedTrip.Plan) {
                        try {
                            setSelectedTripId(preselectTripId);
                            if (matchedTrip.parsedPlan.itinerary?.length > 0) {
                                setSelectedDay(0); 
                            }
                        } catch (e) {
                            console.warn("Failed to parse Plan JSON");
                        }
                    }
                }

            } catch (err) {
                setError("Error fetching trips: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    useEffect(() => {
        if (selectedTripId && selectedDay !== null) {
            const trip = trips.find((t) => t._id === selectedTripId);
            if (trip) {
                fetchSuggestedActivities(trip.Country || trip.TripName.split(" ").pop());
            }
        }
    }, [filterType, selectedTripId, selectedDay]);

    const handleDragStart = (tripId, dayIndex, activity) => {
        setDragging({ tripId, dayIndex, activity });
    };

    const handleDropOnDay = (tripId, dayIndex) => {
        if (!dragging) return;

        setTrips((prevTrips) =>
            prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    const itinerary = [...(trip.parsedPlan?.itinerary || [])];
                    const sourceDay = itinerary[dragging.dayIndex];
                    sourceDay.activities = sourceDay.activities.filter((a) => a !== dragging.activity);

                    if (!itinerary[dayIndex].activities.includes(dragging.activity)) {
                        itinerary[dayIndex].activities.push(dragging.activity);
                    }

                    const newPlan = { ...trip.parsedPlan, itinerary };
                    return {
                        ...trip,
                        parsedPlan: newPlan,
                        Plan: JSON.stringify(newPlan),
                    };
                }
                return trip;
            })
        );
        setDragging(null);
    };

    const fetchSuggestedActivities = async (country, location = "") => {
        let query = "";
        switch (filterType) {
            case "places":
                query = `tourist attractions in ${country}`;
                break;
            case "restaurants":
                query = `restaurants in ${country}`;
                break;
            default:
                query = `things to do in ${country}`;
        }

        const cacheKey = `${query}|${location}`;
        if (suggestedPlacesCache[cacheKey]) {
            setSuggestedPlaces(suggestedPlacesCache[cacheKey]);
            return;
        }

        try {
            const suggestions = await fetchPlaceDetails(query, location);
            const limitedSuggestions = suggestions.slice(0, 3);
            setSuggestedPlaces(limitedSuggestions);
            setSuggestedPlacesCache((prev) => ({ ...prev, [cacheKey]: limitedSuggestions }));
        } catch (e) {
            console.error("Failed to fetch suggestions", e);
        }
    };

    const renderPlaceCard = (placeName) => {
        const place = places[placeName];
        if (!place) {
            getPlaceDetails(placeName);
            return <p className="text-sm text-gray-500">Loading {placeName}...</p>;
        }

        return (
            <div className="activity-item">
                {place.photo && (
                    <img src={place.photo} alt={place.name} className="w-24 h-24 object-cover rounded-lg" />
                )}
                <div>
                    <h4>{place.name}</h4>
                    <p>{place.address}</p>
                    <p>⭐ {place.rating || "N/A"}</p>
                </div>
            </div>
        );
    };

    const getPlaceDetails = async (placeName) => {
        if (!places[placeName]) {
            try {
                const placeDetails = await fetchPlaceDetails(placeName);
                setPlaces((prev) => ({ ...prev, [placeName]: placeDetails[0] }));
            } catch (e) {
                console.error("Place fetch failed", e);
            }
        }
    };

    const handleAddActivity = (tripId, dayIndex, activity) => {
        setTrips((prevTrips) =>
            prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    const itinerary = [...(trip.parsedPlan?.itinerary || [])];
                    if (!itinerary[dayIndex].activities.includes(activity)) {
                        itinerary[dayIndex].activities.push(activity);
                    }

                    const newPlan = { ...trip.parsedPlan, itinerary };
                    return {
                        ...trip,
                        parsedPlan: newPlan,
                        Plan: JSON.stringify(newPlan),
                    };
                }
                return trip;
            })
        );
    };

    const handleRemoveActivity = (tripId, dayIndex, activity) => {
        setTrips((prevTrips) =>
            prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    const itinerary = [...(trip.parsedPlan?.itinerary || [])];
                    itinerary[dayIndex].activities = itinerary[dayIndex].activities.filter((a) => a !== activity);

                    const newPlan = { ...trip.parsedPlan, itinerary };
                    return {
                        ...trip,
                        parsedPlan: newPlan,
                        Plan: JSON.stringify(newPlan),
                    };
                }
                return trip;
            })
        );
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6">
            <h1 className="text-4xl font-bold text-center mb-8">My trips</h1>

            {loading && <p className="text-center text-muted">Loading trips...</p>}
            {error && <p className="text-error">{error}</p>}
            {trips.length === 0 && !loading && !error && (
                <p className="text-center text-muted">No trips found.</p>
            )}

            <div className="space-y-6">
                {trips.map((trip) => {
                    const planData = trip.parsedPlan || {};
                    const itinerary = planData.itinerary || [];

                    return (
                        <div key={trip._id} className="trip-card">
                            <h3 className="trip-title">{trip.TripName}</h3>

                            {Array.isArray(itinerary) && itinerary.length > 0 && (
                                <>
                                    <div className="day-buttons">
                                        {itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                className={selectedDay === index && selectedTripId === trip._id ? "active" : ""}
                                                onClick={() => {
                                                    const isSelected = selectedDay === index && selectedTripId === trip._id;
                                                    setSelectedTripId(trip._id);
                                                    setSelectedDay(isSelected ? null : index);
                                                }}
                                                onDragOver={() => {
                                                    setSelectedTripId(trip._id);
                                                    setSelectedDay(index);
                                                }}
                                            >
                                                {day?.day || `Day ${index + 1}`}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedTripId === trip._id && selectedDay !== null && itinerary[selectedDay] && (
                                        <div
                                            className="day-panel"
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setSelectedTripId(trip._id);
                                                setSelectedDay(selectedDay);
                                            }}
                                            onDrop={() => handleDropOnDay(trip._id, selectedDay)}
                                        >
                                            <h4 className="day-title">{itinerary[selectedDay]?.day}</h4>
                                            <ul className="activity-list">
                                                {itinerary[selectedDay].activities?.map((activity, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="activity-item"
                                                        draggable
                                                        onDragStart={() => handleDragStart(trip._id, selectedDay, activity)}
                                                    >
                                                        <FaMapMarkerAlt />
                                                        {renderPlaceCard(activity)}
                                                        <button onClick={() => handleRemoveActivity(trip._id, selectedDay, activity)}>
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
                                                    {suggestedPlaces.map((place, idx) => (
                                                        <div key={idx} className="activity-item suggestion">
                                                            {place.photo && (
                                                                <img
                                                                    src={place.photo}
                                                                    alt={place.name}
                                                                    className="w-24 h-24 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div>
                                                                <h4>{place.name}</h4>
                                                                <p>{place.address}</p>
                                                                <p>⭐ {place.rating || "N/A"}</p>
                                                                <button
                                                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                                    onClick={() => handleAddActivity(trip._id, selectedDay, place.name)}
                                                                >
                                                                    Toevoegen
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyTripsPage;
