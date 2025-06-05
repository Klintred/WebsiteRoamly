import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccessibilityButton from '../components/Buttons/AccessibilityButton';
import BookingButton from '../components/Buttons/BookingButton';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/hoteldetails.css";

const API_BASE_URL = "https://roamly-api.onrender.com";

const PlaceDetailPage = () => {
  const { type, id } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageAnswers, setAverageAnswers] = useState({});

  const dummyPlaces = {
    'dummy-hotel-1': {
      id: 'dummy-hotel-1',
      name: 'Demo Hotel Example',
      address: '123 Example Street, Amsterdam, Netherlands',
      photo: 'https://via.placeholder.com/600x400?text=Demo+Hotel',
      price: '€120 per night',
      description: 'This is a demo hotel used for preview and testing purposes.',
      accessibilityScore: 'Good',
      location: {
        lat: 52.3676,
        lng: 4.9041
      }
    }
  };

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
          setCoordinates(`${data.location.lat},${data.location.lng}`);
        } else if (data.address) {
          await fetchCoordinates(data.address);
        } else {
          throw new Error("Geen locatiegegevens beschikbaar.");
        }
      } catch (err) {
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

    if (id in dummyPlaces) {
      setPlaceDetails(dummyPlaces[id]);
      setCoordinates(`${dummyPlaces[id].location.lat},${dummyPlaces[id].location.lng}`);
      setLoading(false);
    } else {
      fetchPlaceById();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!placeDetails?.name) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/reviews`);
        const data = await res.json();
        const filtered = data.filter(r => r.placeName === placeDetails.name);
        setReviews(filtered);

        const averages = calculateAverageAnswers(filtered);
        setAverageAnswers(averages);
      } catch (err) {
        console.error("Fout bij ophalen van reviews:", err);
      }
    };

    fetchReviews();
  }, [placeDetails?.name]);

  const calculateAverageAnswers = (reviews) => {
    const categories = ['general', 'parking', 'entrance', 'internalNavigation', 'sanitary'];
    const averages = {};

    categories.forEach(category => {
      averages[category] = {};
      reviews.forEach(review => {
        const section = review[category];
        if (section) {
          Object.keys(section).forEach(question => {
            const answer = section[question];
            if (answer) {
              averages[category][question] = averages[category][question] || {};
              averages[category][question][answer] = (averages[category][question][answer] || 0) + 1;
            }
          });
        }
      });
    });

    const modeAnswers = {};
    categories.forEach(category => {
      modeAnswers[category] = {};
      Object.entries(averages[category]).forEach(([question, counts]) => {
        let maxCount = 0;
        let mostCommonAnswer = "Geen antwoord gevonden";
        Object.entries(counts).forEach(([answer, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostCommonAnswer = answer;
          }
        });
        modeAnswers[category][question] = mostCommonAnswer;
      });
    });

    return modeAnswers;
  };

  if (loading) return <p>Bezig met laden...</p>;
  if (error) return <p style={{ color: "red" }}>Fout: {error}</p>;
  if (!placeDetails) return <p>Geen gegevens gevonden.</p>;

  return (
    <div className="container">
      <div className="place-detail-subcontainer">
        <div className="go-back-link">
          <Link to={`/${type || ''}`}>Go back to {type || 'home'}</Link>
        </div>

        <div className="place-details-text">
          <h1>{placeDetails.name}</h1>
          <div className="book-button-container-desktop">
            <BookingButton placeName={placeDetails.name} />
          </div>
        </div>

        <div className="place-details-image">
          <img
            src={placeDetails.photo || "https://placehold.co/320x200?text=Geen+afbeelding"}
            alt={placeDetails.name}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>

        <div className="review-button-container" style={{ marginTop: "1rem" }}>
          <PrimaryButton
            text="Write a review"
            to={`/write-review?name=${encodeURIComponent(placeDetails.name)}`}
            variant="secondary"
          />
        </div>

        <div className="line" />
        <h2>About this property</h2>
        <p>{placeDetails.description}</p>

        <div className="line" />
        <h2>Accessibility overview</h2>
        <div className="accessibility-grid">
          {[
            { key: 'general', label: 'General accessibility', question: 'accessibility' },
            { key: 'parking', label: 'Parking facilities', question: 'designatedSpot' },
            { key: 'entrance', label: 'Entrance', question: 'doorWidthOK' },
            { key: 'internalNavigation', label: 'Internal navigation', question: 'pathWidthOK' },
            { key: 'sanitary', label: 'Sanitary facilities', question: 'accessibleRestroom' },
            { key: 'staff', label: 'Staff support', question: 'staffAssistance' }
          ].map(({ key, label, question }) => {
            const value = averageAnswers[key]?.[question] || "Geen score gevonden";
            return (
              <div
                className="accessibility-card"
                key={key}
                onClick={() => setExpandedSection(expandedSection === key ? null : key)}
              >
                <AccessibilityButton
                  feedbackSubject={label}
                  accessibilityScore={value}
                  borderColor="green"
                />
                {expandedSection === key && (
                  <ul className="details-list">
                    {Object.entries(averageAnswers[key] || {}).map(([k, v]) => (
                      <li key={k}><strong>{k}:</strong> {v}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="line" />
        <h2>User Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="review-block">
              {r.textReview && (
                <p>
                  <strong>{r.username || "Anonymous"}:</strong> {r.textReview}
                </p>
              )}
              {r.photoUrls && r.photoUrls.length > 0 && (
                <div className="review-photos">
                  {r.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Uploaded ${i}`}
                      style={{ maxWidth: '100px', marginRight: '10px', borderRadius: '4px' }}
                    />
                  ))}
                </div>
              )}
              <hr style={{ margin: '1rem 0' }} />
            </div>
          ))
        )}

        <div className="line" />
        <h2>Location</h2>
        <p>{placeDetails.address}</p>
        {coordinates && (
          <iframe
            title="Map"
            width="100%"
            height="400px"
            style={{ border: 0, borderRadius: "8px" }}
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBlpxT86DXT-8ugulNwJke4Oncf7yu7UcQ&q=${coordinates}`}
            allowFullScreen
          />
        )}
      </div>
      <div className="book-button-container-mobile">
        <BookingButton placeName={placeDetails.name} />
      </div>
    </div>
  );
};

export default PlaceDetailPage;
