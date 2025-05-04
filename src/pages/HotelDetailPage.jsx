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

  const [location, setLocation] = useState('Paris, France');
  const [coordsString, setCoordsString] = useState('48.8566,2.3522');


  useEffect(() => {
    fetchCoordinates(location);
  }, [location]);

  useEffect(() => {
    if (coordsString) {
      fetchHotelById();
    }
  }, [coordsString]);

  const [mapEmbedUrl, setMapEmbedUrl] = useState(null);

useEffect(() => {
  if (coordinates) {
    fetch(`${API_BASE_URL}/api/mapembed?location=${encodeURIComponent(coordinates)}`)
      .then(res => res.json())
      .then(data => setMapEmbedUrl(data.embedUrl))
      .catch(err => console.error('Fout bij ophalen map embed URL:', err));
  }
}, [coordinates]);

  const fetchCoordinates = async (locationName) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinates?location=${encodeURIComponent(locationName)}`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server gaf geen geldige JSON terug bij coördinaten.");
      }
      const data = await response.json();
      if (data.lat && data.lng) {
        setCoordsString(`${data.lat},${data.lng}`);
      } else {
        throw new Error("Kon geen coördinaten vinden.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchHotelById = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/places?query=hotels&location=${coordsString}&radius=50000`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server gaf geen geldige JSON terug.");
      }

      const data = await response.json();
      const match = data.find(h => String(h.id) === String(hotelId));

      if (!match) throw new Error("Hotel niet gevonden.");

      setHotelDetails(match);

      if (match.location?.lat && match.location?.lng) {
        setCoordinates(`${match.location.lat},${match.location.lng}`);
      } else if (match.address) {
        await fetchCoordinates(match.address);
      } else {
        throw new Error("Geen locatiegegevens beschikbaar.");
      }

    } catch (err) {
      console.error('Fout bij ophalen hotel:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Gegevens laden...</p>;
  if (error) return <p>Fout: {error}</p>;

  return (
    <div className="hotel-detail">
      <div className="hotel-header">
        <img
          src={hotelDetails?.photo || 'https://via.placeholder.com/1920x400?text=No+Image'}
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
        <div className="affiliate-button">
  <a
    href={`https://www.booking.com/searchresults.html?aid=7484361&ss=${encodeURIComponent(hotelDetails.name + ' ' + hotelDetails.address)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="booking-affiliate-link"
  >
    Boek dit hotel op Booking.com
  </a>
</div>



<div className="hotel-map">
  
  
  {mapEmbedUrl ? (
    <iframe
      src={mapEmbedUrl}
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
