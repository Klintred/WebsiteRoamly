import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/mytrips.css";
import PrimaryButton from "../components/Buttons/PrimaryButton";

const API_BASE_URL = "https://roamly-api.onrender.com/api";

// Array met de bestandsnamen van jouw vakantie-foto's
const LOCAL_VACATION_IMAGES = [
    "ethan-robertson-SYx3UCHZJlo-unsplash.jpg",
    "haseeb-jamil-zbg2-gyo_hM-unsplash.jpg",
    "link-hoang-UoqAR2pOxMo-unsplash.jpg",
    "marissa-grootes-TVllFyGaLEA-unsplash.jpg",
    "natalya-zaritskaya-SIOdjcYotms-unsplash.jpg",
    "tron-le-JsuBKjHGDMM-unsplash.jpg",
    "upgraded-points-KVym2PAn1gA-unsplash.jpg",
];

const MyTripsOverviewPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

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

    const confirmDeleteTrip = (tripId) => {
        setTripToDelete(tripId);
        setShowModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!tripToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/v1/trips/${tripToDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete trip");
            }

            setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripToDelete));
        } catch (error) {
            console.error("Error deleting trip:", error.message);
            alert("Er is een fout opgetreden bij het verwijderen van de trip.");
        } finally {
            setShowModal(false);
            setTripToDelete(null);
        }
    };

    // Hulpfunctie voor een random afbeelding
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * LOCAL_VACATION_IMAGES.length);
        return `/assets/images/vacation_pictures/${LOCAL_VACATION_IMAGES[randomIndex]}`;
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
                    const randomImage = getRandomImage();

                    return (
                        <div key={trip._id} className="trip-card">
                            <img
                                src={randomImage}
                                alt="Vacation"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://via.placeholder.com/400x300?text=No+Image";
                                }}
                            />
                            <div className="trip-details">
                                <h2 className="trip-title">{trip.TripName}</h2>
                                <h3 className="trip-country">
                                    {trip.Place
                                        ? trip.Place.charAt(0).toUpperCase() + trip.Place.slice(1)
                                        : ""}
                                </h3>
                                <p className="trip-dates">
                                    from {new Date(trip.StartDate).toLocaleDateString()} until{" "}
                                    {new Date(trip.EndDate).toLocaleDateString()}
                                </p>
                                <div className="button-group">
                                    <PrimaryButton
                                        text="View details"
                                        onClick={() => navigate(`/trip-details/${trip._id}`)}
                                        variant="primary"
                                    />
                                    <PrimaryButton
                                        text="Delete trip"
                                        onClick={() => confirmDeleteTrip(trip._id)}
                                        variant="secondary"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="modal-container">
                    <div className="modal-content">
                        <h1>Are you sure you want to delete this trip?</h1>
                        <div className="modal-container-buttons">
                            <PrimaryButton text="Yes, delete" onClick={handleDeleteConfirmed} />
                            <PrimaryButton
                                text="Cancel"
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTripsOverviewPage;
