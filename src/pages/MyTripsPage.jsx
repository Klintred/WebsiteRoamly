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
                    
                    // Remove from source day
                    const sourceDay = newItinerary[dragging.dayIndex];
                    sourceDay.activities = sourceDay.activities.filter(a => a !== dragging.activity);

                    // Add to target day if it's not already there
                    if (!newItinerary[dayIndex].activities.includes(dragging.activity)) {
                        newItinerary[dayIndex].activities = [...newItinerary[dayIndex].activities, dragging.activity];
                    }

                    return { ...trip, Plan: JSON.stringify({ ...planData, itinerary: newItinerary }) };
                }
                return trip;
            });
        });

        setDragging(null);
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-xl">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">My Trips</h1>

            {loading && <p className="text-center text-gray-500">Loading trips...</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {trips.length === 0 && !loading && !error && (
                <p className="text-center text-gray-500">No trips found.</p>
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
                        <div key={trip._id} className="border border-gray-300 rounded-xl shadow-md p-6">
                            <h3 className="text-2xl font-semibold mt-4">{trip.TripName}</h3>

                            {planData.itinerary && (
                                <>
                                    <div className="mt-4 flex space-x-4 mb-4">
                                        {planData.itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-2 rounded-lg ${selectedDay === index ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
                                                onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                                                onDragOver={() => setSelectedDay(index)}
                                            >
                                                {day.day}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedDay !== null && (
                                        <div
                                            className="mt-4 p-4 bg-gray-100 rounded-lg"
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setSelectedDay(selectedDay);
                                            }}
                                            onDrop={() => handleDropOnDay(trip._id, selectedDay)}
                                        >
                                            <div className="p-4 bg-white rounded-md shadow-lg mb-4">
                                                <h4 className="text-lg font-bold text-indigo-700">{planData.itinerary[selectedDay].day}</h4>
                                                <ul className="mt-2 space-y-2">
                                                    {planData.itinerary[selectedDay].activities?.map((activity, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="bg-white p-3 rounded-lg shadow cursor-move"
                                                            draggable
                                                            onDragStart={() => handleDragStart(trip._id, selectedDay, activity)}
                                                        >
                                                            <FaMapMarkerAlt className="inline-block text-indigo-600 mr-2" />
                                                            {activity}
                                                        </li>
                                                    ))}
                                                </ul>
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
