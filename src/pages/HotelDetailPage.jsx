import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccessibilityButton from '../components/Buttons/AccessibilityButton';
import BookingButton from '../components/Buttons/BookingButton';
import "../styles/hoteldetails.css";

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
    <div className="place-detail-container">
      <div className="place-detail-subcontainer">
        <div className="go-back-link">
          <Link to={`/${type}`}> Go back {type}</Link>
        </div>
        <div className="place-details-text">
          <div>
            <h1>{placeDetails.name}</h1>

          </div>
          <div className="book-button-container-desktop">
            {placeDetails.name && (
              <BookingButton placeName={placeDetails.name} />
            )}
          </div>
        </div>
        <div className="place-details-image">
          <img
            src={placeDetails.photo || "https://placehold.co/320x200?text=Geen+afbeelding"}
            alt={placeDetails.name}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
          />

        </div>
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />

        <div className="line" />

        <h2>About this property</h2>
        {placeDetails.description && <p>
          {placeDetails.description}</p>}

        <div className="line" />

        <h2>Accessibility overview</h2>
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />
        <AccessibilityButton
          feedbackSubject="General accessibility"
          accessibilityScore={placeDetails.accessibilityScore || "Geen score gevonden"}
          borderColor="green"
        />

      </div>

      <div className="line" />
      <h2>Location</h2>
      <p>{placeDetails.address}</p>


      {coordinates && (
        <div>
          <iframe
            title="Map"
            width="100%"
            height="400px"
            style={{ border: 0, borderRadius: "8px" }}
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBlpxT86DXT-8ugulNwJke4Oncf7yu7UcQ&q=${coordinates}`}
            allowFullScreen
          />
        </div>
      )}
      <div className="book-button-container-mobile">
        {placeDetails.name && (
          <BookingButton placeName={placeDetails.name} />
        )}
      </div>
    </div>
  );
};

//test

export default PlaceDetailPage;
