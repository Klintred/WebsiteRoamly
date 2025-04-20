import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/mytrips.css";

const PROXY_URLS = [
    "https://api.allorigins.win/raw?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://thingproxy.freeboard.io/fetch/",
    "https://api.allorigins.win/raw?url=",
    'https://api.allorigins.win/raw?url=',
];

const PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const fetchPlaceDetails = async (placeName, location = '', radius = 50000) => {
    let url = `${PLACES_API_BASE_URL}?query=${encodeURIComponent(placeName)}&key=${API_KEY}`;
    
    if (location) {
        url += `&location=${location}&radius=${radius}`;
    }

    for (const proxy of PROXY_URLS) {
        try {
            const response = await fetch(proxy + encodeURIComponent(url));
            if (response.ok) {
                const data = await response.json();
                return data.results || [];
            }
        } catch (err) {
            console.warn(`Proxy failed: ${err.message}`);
        }
    }
    throw new Error("All proxy requests failed");
};

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [places, setPlaces] = useState({});
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch("https://roamly-api.onrender.com/api/v1/trips");
                if (!response.ok) throw new Error("Failed to fetch trips");
                const data = await response.json();
                setTrips(data.data.trips || []);
            } catch (err) {
                setError("Error fetching trips: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    useEffect(() => {
        if (selectedDay !== null && trips.length > 0) {
            const trip = trips.find((t) => {
                let planData = {};
                try {
                    planData = JSON.parse(t.Plan);
                    return planData.itinerary[selectedDay];
                } catch {
                    return false;
                }
            });

            if (trip) {
                fetchSuggestedActivities(trip.Country || trip.TripName.split(" ").pop());
            }
        }
    }, [filterType, selectedDay, trips]);

    const handleDragStart = (tripId, dayIndex, activity) => {
        setDragging({ tripId, dayIndex, activity });
    };

    const handleDropOnDay = (tripId, dayIndex) => {
        if (!dragging) return;

        setTrips((prevTrips) => {
            return prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    let planData = {};
                    try {
                        planData = JSON.parse(trip.Plan);
                    } catch (e) {
                        console.warn("Invalid Plan JSON", e);
                        return trip;
                    }

                    const newItinerary = [...planData.itinerary];
                    const sourceDay = newItinerary[dragging.dayIndex];
                    sourceDay.activities = sourceDay.activities.filter(a => a !== dragging.activity);

                    if (!newItinerary[dayIndex].activities.includes(dragging.activity)) {
                        newItinerary[dayIndex].activities.push(dragging.activity);
                    }

                    return {
                        ...trip,
                        Plan: JSON.stringify({ ...planData, itinerary: newItinerary })
                    };
                }
                return trip;
            });
        });
    };

    const fetchSuggestedActivities = async (country, location = '') => {
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

        try {
            const suggestions = await fetchPlaceDetails(query, location);
            setSuggestedPlaces(suggestions.slice(0, 3));
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
                {place.photos?.[0] && (
                    <img
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`}
                        alt={place.name}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                )}
                <div>
                    <h4>{place.name}</h4>
                    <p>{place.formatted_address}</p>
                    <p>⭐ {place.rating || "N/A"}</p>
                </div>
            </div>
        );
    };

    const getPlaceDetails = async (placeName) => {
        if (!places[placeName]) {
            try {
                const placeDetails = await fetchPlaceDetails(placeName);
                setPlaces((prev) => ({
                    ...prev,
                    [placeName]: placeDetails[0]
                }));
            } catch (e) {
                console.error("Place fetch failed", e);
            }
        }
    };

    const handleAddActivity = (tripId, dayIndex, activity) => {
        setTrips((prevTrips) => {
            return prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    let planData = {};
                    try {
                        planData = JSON.parse(trip.Plan);
                    } catch (e) {
                        console.warn("Invalid Plan JSON", e);
                        return trip;
                    }

                    const newItinerary = [...planData.itinerary];
                    if (!newItinerary[dayIndex].activities.includes(activity)) {
                        newItinerary[dayIndex].activities.push(activity);
                    }

                    return {
                        ...trip,
                        Plan: JSON.stringify({ ...planData, itinerary: newItinerary })
                    };
                }
                return trip;
            });
        });
    };

    const handleRemoveActivity = (tripId, dayIndex, activity) => {
        setTrips((prevTrips) => {
            return prevTrips.map((trip) => {
                if (trip._id === tripId) {
                    let planData = {};
                    try {
                        planData = JSON.parse(trip.Plan);
                    } catch (e) {
                        console.warn("Invalid Plan JSON", e);
                        return trip;
                    }

                    const newItinerary = [...planData.itinerary];
                    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter(a => a !== activity);

                    return {
                        ...trip,
                        Plan: JSON.stringify({ ...planData, itinerary: newItinerary })
                    };
                }
                return trip;
            });
        });
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6">
            <h1 className="text-4xl font-bold text-center mb-8">My Trips</h1>

            {loading && <p className="text-center text-muted">Loading trips...</p>}
            {error && <p className="text-error">{error}</p>}
            {trips.length === 0 && !loading && !error && (
                <p className="text-center text-muted">No trips found.</p>
            )}

            <div className="space-y-6">
                {trips.map((trip) => {
                    let planData = {};
                    try {
                        planData = JSON.parse(trip.Plan);
                    } catch (e) {
                        console.warn("Invalid Plan JSON", e);
                    }

                    return (
                        <div key={trip._id} className="trip-card">
                            <h3 className="trip-title">{trip.TripName}</h3>

                            {planData.itinerary && (
                                <>
                                    <div className="day-buttons">
                                        {planData.itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                className={selectedDay === index ? "active" : ""}
                                                onClick={() => {
                                                    setSelectedDay(selectedDay === index ? null : index);
                                                    fetchSuggestedActivities(trip.Country || trip.TripName.split(" ").pop());
                                                }}
                                                onDragOver={() => setSelectedDay(index)}
                                            >
                                                {day.day}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedDay !== null && (
                                        <div
                                            className="day-panel"
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setSelectedDay(selectedDay);
                                            }}
                                            onDrop={() => handleDropOnDay(trip._id, selectedDay)}
                                        >
                                            <h4 className="day-title">{planData.itinerary[selectedDay].day}</h4>
                                            <ul className="activity-list">
                                                {planData.itinerary[selectedDay].activities?.map((activity, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="activity-item"
                                                        draggable
                                                        onDragStart={() => handleDragStart(trip._id, selectedDay, activity)}
                                                    >
                                                        <FaMapMarkerAlt />
                                                        {renderPlaceCard(activity)}
                                                        <button onClick={() => handleRemoveActivity(trip._id, selectedDay, activity)}>Verwijderen</button>
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
                                                            {place.photos?.[0] && (
                                                                <img
                                                                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`}
                                                                    alt={place.name}
                                                                    className="w-24 h-24 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div>
                                                                <h4>{place.name}</h4>
                                                                <p>{place.formatted_address}</p>
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
