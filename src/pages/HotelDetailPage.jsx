import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hoteldetails.css';

const API_KEY = 'AIzaSyBO0gm7S42KuQqgWTO63H-LCWix5488bMU';
const PLACE_DETAILS_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

const HotelDetailPage = () => {
  const { id: hotelId } = useParams();

  const [hotelDetails, setHotelDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterReviewsForAccessibility = (reviews) => {
    const keywords = ['wheelchair', 'accessible', 'disability', 'accessible room', 'accessible bathroom', 'handicapped parking', 'elevator', 'wide door'];
    return reviews.filter((review) => 
      keywords.some((keyword) => review.text.toLowerCase().includes(keyword))
    );
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) {
        setError("Hotel ID missing");
        return;
      }

      const detailsUrl = `${PLACE_DETAILS_API_BASE_URL}?place_id=${hotelId}&fields=name,formatted_address,formatted_phone_number,rating,website,opening_hours,photos,wheelchair_accessible_entrance,review,price_level,geometry&key=${API_KEY}`;
      const proxiedUrl = `${PROXY_URL}${encodeURIComponent(detailsUrl)}`;

      try {
        const response = await fetch(proxiedUrl);
        const data = await response.json();

        if (data.status === "OK") {
          setHotelDetails(data.result);
        } else {
          throw new Error('Hotel data not found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  const filteredReviews = hotelDetails.reviews ? filterReviewsForAccessibility(hotelDetails.reviews) : [];
  const hotelDescription = hotelDetails.description || "This hotel offers a luxurious experience with excellent amenities for both vacationers and business travelers.";
  const { lat, lng } = hotelDetails.geometry?.location || {};

  return (
    <div className="hotel-detail">
      {/* ✅ Full-width header image */}
      <div className="hotel-header">
        <img
          src={
            hotelDetails.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=4000&photoreference=${hotelDetails.photos[0].photo_reference}&key=${API_KEY}`
              : 'https://via.placeholder.com/1920x400?text=No+Image'
          }
          alt={hotelDetails.name}
          className="hotel-header-image"
        />
      </div>

      {/* ✅ Hotel Content: Details on the Left, Map on the Right */}
      <div className="hotel-content">
        {/* ✅ Left Side: Hotel Details */}
        <div className="hotel-details">
          <h1>{hotelDetails.name}</h1>

        <div className="hotel-accesibility">
          <div className="hotel-accesibility-text">
            <h2>General Accessibility</h2>
            <p>High accessibility</p>
          </div>
          <a href="../reviews">See details</a>
        </div>
        
        <p><strong>Address:</strong> {hotelDetails.formatted_address}</p>
        <p><strong>Phone:</strong> {hotelDetails.formatted_phone_number || 'Not available'}</p>
        <p><strong>Website:</strong> {hotelDetails.website ? <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">{hotelDetails.website}</a> : 'Not available'}</p>
        <p><strong>Rating:</strong> {hotelDetails.rating ? `⭐ ${hotelDetails.rating}` : 'No rating available'}</p>
        
        <a href="#" className="accessibility-details-button">See details</a>

          {/* ✅ Styled Info Section */}
          <div className="hotel-info">
            <h2>Address</h2>
            <p>{hotelDetails.formatted_address}</p>

            <h2>Phone</h2>
            <p>{hotelDetails.formatted_phone_number || 'Not available'}</p>

            <h2>Website</h2>
            <p>{hotelDetails.website ? <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">{hotelDetails.website}</a> : 'Not available'}</p>

            <h2>Rating</h2>
            <p>{hotelDetails.rating ? `⭐ ${hotelDetails.rating}` : 'No rating available'}</p>

            <h2>Description</h2>
            <p>{hotelDescription}</p>

            {hotelDetails.price_level !== undefined && (
              <>
                <h2>Price Level</h2>
                <p>{'⭐'.repeat(hotelDetails.price_level)}</p>
              </>
            )}

            {hotelDetails.wheelchair_accessible_entrance !== undefined && (
              <>
                <h2>Wheelchair Accessible</h2>
                <p>{hotelDetails.wheelchair_accessible_entrance ? 'Yes' : 'No'}</p>
              </>
            )}

            {hotelDetails.opening_hours && (
              <>
                <h2>Opening Hours</h2>
                <ul>
                  {hotelDetails.opening_hours.weekday_text.map((day, index) => (
                    <li key={index}>{day}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ✅ Accessibility Reviews */}
          <div>
            <h2>Accessibility Reviews</h2>
            {filteredReviews.length > 0 ? (
              filteredReviews.slice(0, 3).map((review, index) => (
                <div key={index} className="review">
                  <p><strong>{review.author_name}</strong>: {review.rating} ⭐</p>
                  <p>"{review.text}"</p>
                </div>
              ))
            ) : (
              <p>No reviews found related to accessibility.</p>
            )}
          </div>
        </div>

        {/* ✅ Right Side: Styled Map */}
        <div className="hotel-map">
          {lat && lng ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${lat},${lng}`}
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
