import React, { useEffect, useState } from "react";

function MyTripsPage() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch("https://roamly-api.onrender.com/api/v1/trips");
                if (!response.ok) {
                    throw new Error(`Failed to fetch trips: ${response.statusText}`);
                }

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

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "16px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>My Trips</h1>

            {loading && <p>Loading trips...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && trips.length === 0 && <p>No trips found.</p>}

            <div style={{ marginTop: "20px" }}>
                {trips.map((trip) => (
                    <div
                        key={trip._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "16px",
                            backgroundColor: "#f9f9f9"
                        }}
                    >
                        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{trip.TripName}</h2>
                        <p><strong>Destination:</strong> {trip.Place}</p>
                        <p><strong>Start Date:</strong> {new Date(trip.StartDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(trip.EndDate).toLocaleDateString()}</p>

                        {/* Check of er een Plan (de AI response) aanwezig is */}
                        {trip.Plan && (
                            <div style={{ marginTop: "10px" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Plan Details:</h3>
                                <pre
                                    style={{
                                        backgroundColor: "#eee",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        overflow: "auto",
                                        maxHeight: "300px"
                                    }}
                                >
                                    {trip.Plan}
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyTripsPage;
