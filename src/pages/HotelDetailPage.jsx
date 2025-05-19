import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hoteldetails.css';

const API_BASE_URL = 'https://roamly-api.onrender.com';

const PlaceDetailPage = () => {
  const { id, category } = useParams(); // category = hotels, restaurants, activities
  const [placeDetails, setPlaceDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapEmbedUrl, setMapEmbedUrl] = useState(null);

  useEffect(() => {
    fetchPlaceById();
  }, [id, category]);

  useEffect(() => {
    if (coordinates) {
      fetch(`${API_BASE_URL}/api/mapembed?location=${encodeURIComponent(coordinates)}`)
        .then(res => res.json())
        .then(data => {
          if (data.embedUrl) setMapEmbedUrl(data.embedUrl);
        })
        .catch(err => {
          console.error('Fout bij ophalen map embed URL:', err);
          setMapEmbedUrl(null);
        });
    }
  }, [coordinates]);

  const fetchPlaceById = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/places?query=${category}&location=48.8566,2.3522&radius=50000`);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server gaf geen geldige JSON terug.");
      }

      const data = await response.json();
      const match = data.find(p => String(p.id) === String(id));

      if (!match) throw new Error("Locatie niet gevonden.");
      setPlaceDetails(match);

      if (match.location?.lat && match.location?.lng) {
        setCoordinates(`${match.location.lat},${match.location.lng}`);
      } else if (match.address) {
        fetchCoordinatesFromAddress(match.address);
      } else {
        throw new Error("Geen locatiegegevens beschikbaar.");
      }
    } catch (err) {
      console.error('Fout bij ophalen locatie:', err);
      setError(err.message);
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
        console.warn("Kon geen coördinaten vinden voor adres.");
      }
    } catch (err) {
      console.error('Fout bij ophalen coördinaten:', err);
    }
  };

  if (loading) return <p>Gegevens laden...</p>;
  if (error) return <p>Fout: {error}</p>;

  const categoryLabels = {
    hotels: 'hotel',
    restaurants: 'restaurant',
    activities: 'activiteit',
  };

  return (
    <div className="hotel-detail">
      <div className="hotel-header">
        <img
          src={placeDetails?.photo || 'https://via.placeholder.com/1920x400?text=Geen+afbeelding'}
          alt={placeDetails?.name || "Locatie"}
          className="hotel-header-image"
        />
      </div>

      <div className="hotel-content">
        <div className="hotel-details">
          <h1>{placeDetails.name}</h1>
          <p><strong>Adres:</strong> {placeDetails.address || 'Niet beschikbaar'}</p>
          <p><strong>Telefoon:</strong> {placeDetails.phone || 'Niet beschikbaar'}</p>
          <p><strong>Website:</strong> {
            placeDetails.website ? (
              <a href={placeDetails.website} target="_blank" rel="noopener noreferrer">
                {placeDetails.website}
              </a>
            ) : 'Niet beschikbaar'
          }</p>
          <p><strong>Beoordeling:</strong> {placeDetails.rating ? `⭐ ${placeDetails.rating}` : 'Geen beoordeling beschikbaar'}</p>
          <p><strong>Beschrijving:</strong> {placeDetails.description || 'Geen beschrijving beschikbaar.'}</p>
        </div>

        {category === 'hotels' && (
          <div className="affiliate-button">
            <a
              href={`https://www.booking.com/searchresults.html?aid=7484361&ss=${encodeURIComponent(placeDetails.name + ' ' + placeDetails.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="booking-affiliate-link"
            >
              Boek dit hotel op Booking.com
            </a>
          </div>
        )}

        <div className="hotel-map">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              allowFullScreen
              loading="lazy"
              title="Locatie op kaart"
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

export default PlaceDetailPage;
