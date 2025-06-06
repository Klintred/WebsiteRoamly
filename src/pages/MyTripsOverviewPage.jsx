import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/mytrips.css";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const API_BASE_URL = "https://roamly-api.onrender.com/api";

const MyTripsOverviewPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_BASE_URL}/v1/trips`, {
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
            } catch (err) {
                setError("Error fetching trips: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const handleDeleteTrip = async (tripId) => {
        if (!window.confirm("Weet je zeker dat je deze trip wilt verwijderen?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/v1/trips/${tripId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete trip");
            }

            setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
        } catch (error) {
            console.error("Error deleting trip:", error.message);
            alert("Er is een fout opgetreden bij het verwijderen van de trip.");
        }
    };

    return (
        <div className="container">
            <h1 className="text-center">All trips</h1>

            {loading && <p className="text-center text-muted">Loading trips...</p>}
            {error && <p className="text-error">{error}</p>}
            {trips.length === 0 && !loading && !error && (
                <p className="text-center text-muted">No trips found.</p>
            )}

            <div className="all-trips-container">
                {trips.map((trip) => {
                    const planData = trip.parsedPlan || {};

                    return (
                        <div key={trip._id} className="trip-card">
                            <img src="./assets/images/loginImage.png" alt="" />
                            <div className="trip-details">
                                <h2 className="trip-title">{trip.TripName}</h2>
                                <h3 className="trip-country">
                                    {trip.Place
                                        ? trip.Place.charAt(0).toUpperCase() + trip.Place.slice(1)
                                        : ""}
                                </h3>
                                <p className="trip-dates">
                                    from {new Date(trip.StartDate).toLocaleDateString()} until {new Date(trip.EndDate).toLocaleDateString()}
                                </p>
                                <div className="button-group">
                                    <PrimaryButton
                                        text="View details"
                                        onClick={() => navigate(`/trip-details/${trip._id}`)}
                                        variant="primary"
                                    />
                                    <PrimaryButton
                                        text="Delete trip"
                                        onClick={() => handleDeleteTrip(trip._id)}
                                        variant="secondary"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyTripsOverviewPage;
