import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hoteldetails.css';

const API_BASE_URL = 'https://roamly-api.onrender.com';

const HotelDetailPage = () => {
  const { id: hotelId } = useParams();  // Het ID van het hotel uit de URL
  const [hotelDetails, setHotelDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  const fetchHotelDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/hotel/${hotelId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setHotelDetails(data);

      if (data.location && data.location.lat && data.location.lng) {
        setCoordinates(`${data.location.lat},${data.location.lng}`);
      } else if (data.address) {
        await fetchCoordinatesFromAddress(data.address);
      } else {
        throw new Error("Geen locatiegegevens beschikbaar voor dit hotel.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinatesFromAddress = async (address) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinates?location=${encodeURIComponent(address)}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.lat && data.lng) {
        setCoordinates(`${data.lat},${data.lng}`);
      } else {
        throw new Error("Kon geen coördinaten vinden voor dit adres.");
      }
    } catch (error) {
      console.error('Fout bij ophalen coördinaten:', error);
      setError(error.message);
    }
  };

  if (loading) return <p>Gegevens laden...</p>;
  if (error) return <p>Fout: {error}</p>;

  return (
    <div className="hotel-detail">
      <div className="hotel-header">
        <img
          src={hotelDetails?.photos?.[0]?.url || 'https://via.placeholder.com/1920x400?text=No+Image'}
          alt={hotelDetails?.name || "Hotel"}
          className="hotel-header-image"
        />
      </div>

      <div className="hotel-content">
        <div className="hotel-details">
          <h1>{hotelDetails.name}</h1>
          <p><strong>Adres:</strong> {hotelDetails.address}</p>
          <p><strong>Telefoon:</strong> {hotelDetails.phone || 'Niet beschikbaar'}</p>
          <p><strong>Website:</strong> {hotelDetails.website ? (
            <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">{hotelDetails.website}</a>
          ) : 'Niet beschikbaar'}</p>
          <p><strong>Beoordeling:</strong> {hotelDetails.rating ? `⭐ ${hotelDetails.rating}` : 'Geen beoordeling beschikbaar'}</p>
          <p><strong>Beschrijving:</strong> {hotelDetails.description || 'Geen beschrijving beschikbaar.'}</p>
        </div>

        {/* Maps embed */}
        <div className="hotel-map">
          {coordinates ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${coordinates}`}
              allowFullScreen
              loading="lazy"
              title="Hotel locatie"
              className="map-iframe"
            ></iframe>
          ) : (
            <p>Locatie niet beschikbaar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
