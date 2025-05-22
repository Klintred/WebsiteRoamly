import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "https://roamly-api.onrender.com"; // of jouw lokale API

const PlaceDetailPage = () => {
  const { type, id } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/place/${id}`);
        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server gaf geen geldige JSON terug.");
        }

        const data = await response.json();

        setPlaceDetails(data);

        if (data.location?.lat && data.location?.lng) {
          const coords = `${data.location.lat},${data.location.lng}`;
          setCoordinates(coords);
        } else if (data.address) {
          await fetchCoordinates(data.address);
        } else {
          throw new Error("Geen locatiegegevens beschikbaar.");
        }

      } catch (err) {
        console.error('Fout bij ophalen plaatsdetails:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCoordinates = async (location) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/coordinates?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (data.lat && data.lng) {
          setCoordinates(`${data.lat},${data.lng}`);
        }
      } catch (err) {
        console.error("Fout bij ophalen coördinaten:", err.message);
      }
    };

    if (id) fetchPlaceById();
  }, [id]);

  if (loading) return <p>Bezig met laden...</p>;
  if (error) return <p style={{ color: "red" }}>Fout: {error}</p>;
  if (!placeDetails) return <p>Geen gegevens gevonden.</p>;

  return (
    <div className="place-detail" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Link to={`/${type}`}>&larr; Terug naar {type}</Link>
      <h1>{placeDetails.name}</h1>

      <img
        src={placeDetails.photo || "https://placehold.co/320x200?text=Geen+afbeelding"}
        alt={placeDetails.name}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
      />

      <p><strong>Adres:</strong> {placeDetails.address}</p>
      {placeDetails.phone && <p><strong>Telefoon:</strong> {placeDetails.phone}</p>}
      {placeDetails.website && (
        <p>
          <strong>Website:</strong>{" "}
          <a href={placeDetails.website} target="_blank" rel="noopener noreferrer">
            {placeDetails.website}
          </a>
        </p>
      )}
      {placeDetails.rating && <p><strong>Rating:</strong> ⭐ {placeDetails.rating}</p>}
      {placeDetails.description && <p><strong>Beschrijving:</strong> {placeDetails.description}</p>}

      {type === "hotels" && placeDetails.name && (
        <div style={{ marginTop: "1em" }}>
          <a
            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(placeDetails.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Bekijk op Booking.com
          </a>
        </div>
      )}

      {coordinates && (
        <div style={{ marginTop: "2em" }}>
          <iframe
            title="Map"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0, borderRadius: "8px" }}
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBlpxT86DXT-8ugulNwJke4Oncf7yu7UcQ&q=${coordinates}`}
            //src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyARMMWTVxjvo8qABcvXgZpHt6FJL63CDpA&q=${coordinates}`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

//test

export default PlaceDetailPage;
