import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../styles/mytrips.css";

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

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

    const handleDragStart = (tripId, dayIndex, activity) => {
        setDragging({ tripId, dayIndex, activity });
    };

    const handleDropOnDay = (tripId, dayIndex) => {
        if (!dragging) return;

        setTrips((prevTrips) =>
            prevTrips.map((trip) => {
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

                    return { ...trip, Plan: JSON.stringify({ ...planData, itinerary: newItinerary }) };
                }
                return trip;
            })
        );

        setDragging(null);
    };

    return (
        <div className="max-w-4xl">
            <h1>My Trips</h1>

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
                                                onClick={() => setSelectedDay(selectedDay === index ? null : index)}
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
                                                        {activity}
                                                    </li>
                                                ))}
                                            </ul>
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
