import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hoteldetails.css';

const API_BASE_URL = 'https://roamly-api.onrender.com';

const HotelDetailPage = () => {
  const { id: hotelId } = useParams();
  const [hotelDetails, setHotelDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ophalen van hotel details op basis van hotel ID
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/hotel/${hotelId}`);
        const data = await response.json();

        if (response.ok) {
          setHotelDetails(data);

          // Check of er al lat/lng aanwezig is
          if (data.location && data.location.lat && data.location.lng) {
            setCoordinates(`${data.location.lat},${data.location.lng}`);
          } else if (data.address) {
            // Anders ophalen op basis van adres
            await fetchCoordinatesFromAddress(data.address);
          } else {
            throw new Error("No location data available for this hotel.");
          }
        } else {
          throw new Error(data.message || "Hotel details not found.");
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
        const data = await response.json();
        if (data.lat && data.lng) {
          setCoordinates(`${data.lat},${data.lng}`);
        } else {
          throw new Error("Could not find coordinates for the given address.");
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hotel-detail">
      <div className="hotel-header">
        <img
          src={hotelDetails.photos ? hotelDetails.photos[0].url : 'https://via.placeholder.com/1920x400?text=No+Image'}
          alt={hotelDetails.name}
          className="hotel-header-image"
        />
      </div>

      <div className="hotel-content">
        <div className="hotel-details">
          <h1>{hotelDetails.name}</h1>
          <p><strong>Address:</strong> {hotelDetails.address}</p>
          <p><strong>Phone:</strong> {hotelDetails.phone || 'Not available'}</p>
          <p><strong>Website:</strong> {hotelDetails.website ? (
            <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">
              {hotelDetails.website}
            </a>
          ) : 'Not available'}</p>
          <p><strong>Rating:</strong> {hotelDetails.rating ? `⭐ ${hotelDetails.rating}` : 'No rating available'}</p>
          <p><strong>Description:</strong> {hotelDetails.description || 'No description available.'}</p>
        </div>

        {/* Maps embed (bijv. locatie van het hotel) */}
        <div className="hotel-map">
          {coordinates ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${coordinates}`}
              allowFullScreen
              loading="lazy"
              title="Hotel Location"
              className="map-iframe"
            ></iframe>
          ) : (
            <p>Location not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
