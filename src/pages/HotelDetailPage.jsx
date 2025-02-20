import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/hoteldetails.css';

const API_KEY = 'AIzaSyBO0gm7S42KuQqgWTO63H-LCWix5488bMU'; // Replace with your own API key
const PLACE_DETAILS_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const PROXY_URL = 'https://api.allorigins.win/raw?url='; // Proxy to bypass CORS

const HotelDetailPage = () => {
  const { id: hotelId } = useParams(); // Get the 'id' parameter from the URL

  console.log("Hotel ID fetched from URL:", hotelId); // ✅ Check if the ID is correct

  const [hotelDetails, setHotelDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to filter reviews based on accessibility
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

      console.log("Sent API request:", proxiedUrl); // ✅ Check if the URL is correct

      try {
        const response = await fetch(proxiedUrl);
        const data = await response.json();

        console.log("Received API response:", data); // ✅ Log the response to check if it works

        if (data.status === "OK") {
          setHotelDetails(data.result);
        } else {
          throw new Error('Hotel data not found.');
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error); // ✅ Log errors
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  // Filter reviews for accessibility
  const filteredReviews = hotelDetails.reviews ? filterReviewsForAccessibility(hotelDetails.reviews) : [];

  // Static description of the hotel
  const hotelDescription = hotelDetails.description || "This hotel offers a luxurious experience with excellent amenities for both vacationers and business travelers.";

  // Extract latitude and longitude for the map with optional chaining
  const { lat, lng } = hotelDetails.geometry?.location || {};

  return (
    <div className="hotel-detail">
      <img
        src={
          hotelDetails.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${hotelDetails.photos[0].photo_reference}&key=${API_KEY}`
          : 'https://via.placeholder.com/400?text=No+Image'
        }
        alt={hotelDetails.name}
        style={{ width: '100%', maxWidth: '800px' }}
      />

      <div className="hotel-details">
        <h1>{hotelDetails.name}</h1>

        <div className="hotel-accesibility">
          <div className="hotel-accesibility-text">
            <h2>General Accessibility</h2>
            <p>High accessibility</p>
          </div>
          <a href="#">See details</a>
        </div>
        
        <p><strong>Address:</strong> {hotelDetails.formatted_address}</p>
        <p><strong>Phone:</strong> {hotelDetails.formatted_phone_number || 'Not available'}</p>
        <p><strong>Website:</strong> {hotelDetails.website ? <a href={hotelDetails.website} target="_blank" rel="noopener noreferrer">{hotelDetails.website}</a> : 'Not available'}</p>
        <p><strong>Rating:</strong> {hotelDetails.rating ? `⭐ ${hotelDetails.rating}` : 'No rating available'}</p>
        
          {lat && lng ? (
            <div className="hotel-map">
              <h3>Hotel Location:</h3>
              <iframe
                width="600"
                height="450"
                src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${lat},${lng}`}
                allowFullScreen
                loading="lazy"
                title="Hotel Location"
              ></iframe>
            </div>
          ) : (
            <p>Location not available</p>
          )}
          </div>
        <p><strong>Description:</strong> {hotelDescription}</p>
        
        {hotelDetails.price_level !== undefined && (
          <p><strong>Price Level:</strong> {'⭐'.repeat(hotelDetails.price_level)}</p>
        )}

        {hotelDetails.opening_hours && (
          <div>
            <h3>Opening Hours:</h3>
            <ul>
              {hotelDetails.opening_hours.weekday_text.map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ul>
          </div>
        )}

        {hotelDetails.wheelchair_accessible_entrance !== undefined && (
          <p><strong>Wheelchair Accessible:</strong> {hotelDetails.wheelchair_accessible_entrance ? 'Yes' : 'No'}</p>
        )}

        {filteredReviews.length > 0 && (
          <div>
            <h3>Accessibility Reviews:</h3>
            {filteredReviews.slice(0, 3).map((review, index) => (
              <div key={index} style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                <p><strong>{review.author_name}</strong>: {review.rating} ⭐</p>
                <p>"{review.text}"</p>
              </div>
            ))}
          </div>
        )}
        {filteredReviews.length === 0 && <p>No reviews found related to accessibility.</p>}

        {/* Add Google Maps Embed with additional check for lat and lng */}
    </div>
  );
};

export default HotelDetailPage;
