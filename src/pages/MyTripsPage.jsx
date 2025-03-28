import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../styles/mytrips.css";

const MyTripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(null); // Track the dragged item
    const [selectedDay, setSelectedDay] = useState(0); // By default show Day 1
    const [hoveredDay, setHoveredDay] = useState(null); // Track hovered day
    const [tempActivity, setTempActivity] = useState(null); // Temporary storage for dragged activity

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
        setTempActivity(activity); // Temporarily store the dragged activity
    };

    const handleDropTempZone = () => {
        setTempActivity(null); // Clear temporary activity when dropped in the neutral zone
    };

    const handleDropOnDay = (tripId, dayIndex) => {
        if (!tempActivity) return; // Don't drop if there's no activity in tempActivity

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

                    // Find the correct day where the activity needs to be dropped
                    const targetDay = newItinerary[dayIndex];
                    targetDay.activities = [...targetDay.activities, tempActivity];

                    // After adding to the target day, we remove the activity from its source day (if necessary)
                    const sourceDayIndex = newItinerary.findIndex(day => day.activities.includes(tempActivity));
                    if (sourceDayIndex !== -1) {
                        const sourceDay = newItinerary[sourceDayIndex];
                        sourceDay.activities = sourceDay.activities.filter(a => a !== tempActivity);
                    }

                    return { ...trip, Plan: JSON.stringify({ ...planData, itinerary: newItinerary }) };
                }
                return trip;
            });
        });

        // Clear the temporary activity after it's placed
        setTempActivity(null);
        setDragging(null); // Reset dragging state after drop
    };

    const handleDaySelection = (dayIndex) => {
        setSelectedDay(dayIndex); // Update the selected day
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
                            {planData.hotel && (
                                <div className="bg-indigo-500 text-white p-5 rounded-md">
                                    <h2 className="text-3xl font-bold">{planData.hotel}</h2>
                                </div>
                            )}

                            <h3 className="text-2xl font-semibold mt-4">{trip.TripName}</h3>

                            {planData.itinerary && (
                                <>
                                    {/* Day navigation buttons */}
                                    <div className="mt-4 flex space-x-4 mb-4">
                                        {planData.itinerary.map((day, index) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-2 rounded-lg ${selectedDay === index ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}
                                                onClick={() => handleDaySelection(index)}
                                            >
                                                {day.day}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Neutral Drop Zone for activity */}
                                    {tempActivity && (
                                        <div
                                            className="p-4 mb-4 bg-gray-200 rounded-lg text-center"
                                            onDrop={handleDropTempZone} // When activity is dropped in the neutral zone, clear it
                                            onDragOver={(e) => e.preventDefault()}
                                            style={{ border: "2px dashed #ccc" }}
                                        >
                                            <p className="text-gray-500">Drop the activity here before placing it on a day</p>
                                            <div className="mt-2">
                                                <FaMapMarkerAlt className="inline-block text-indigo-600 mr-2" />
                                                {tempActivity}
                                            </div>
                                        </div>
                                    )}

                                    {/* Display selected day */}
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <div
                                            className="p-4 bg-white rounded-md shadow-lg mb-4"
                                            onDragOver={(e) => e.preventDefault()} // Allow the drop
                                            onDrop={() => handleDropOnDay(trip._id, selectedDay)} // Handle drop event for selected day
                                            onDragEnter={() => setHoveredDay(selectedDay)} // Set hovered day
                                            onDragLeave={() => setHoveredDay(null)} // Reset hovered day when dragging leaves
                                            style={{
                                                backgroundColor: hoveredDay === selectedDay ? "#d1d5db" : "white", // Change background color when hovered
                                                transition: "background-color 0.2s ease"
                                            }}
                                        >
                                            <h4 className="text-lg font-bold text-indigo-700">{planData.itinerary[selectedDay]?.day}</h4>
                                            <ul className="mt-2 space-y-2">
                                                {planData.itinerary[selectedDay]?.activities?.map((activity, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="bg-white p-3 rounded-lg shadow cursor-move"
                                                        draggable
                                                        onDragStart={() => handleDragStart(trip._id, selectedDay, activity)} // Start dragging the activity
                                                    >
                                                        <FaMapMarkerAlt className="inline-block text-indigo-600 mr-2" />
                                                        {activity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
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
