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

  useEffect(() => {
    const fetchPlaceById = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/place/${id}`);
        if (!response.ok) throw new Error("Failed to fetch place details");
        const data = await response.json();
        setPlaceDetails(data);

        if (data.location?.lat && data.location?.lng) {
          setCoordinates(`${data.location.lat},${data.location.lng}`);
        } else if (data.address) {
          await fetchCoordinates(data.address);
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

    // ✅ Alleen deze regel is nodig
    fetchPlaceById();
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
    const categories = ['general', 'parking', 'entrance', 'internalNavigation', 'sanitary', 'staff'];
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

    return averages;
  };

  const getOverallScore = (sectionData) => {
    if (!sectionData) return "Geen score gevonden";

    const scoreCounts = { "Fully accessible": 0, "Adjustments needed": 0, "Not accessible": 0 };

    Object.values(sectionData).forEach(questionCounts => {
      Object.entries(questionCounts).forEach(([answer, count]) => {
        let mappedAnswer;
        if (answer.toLowerCase() === "yes") {
          mappedAnswer = "Fully accessible";
        } else if (answer.toLowerCase() === "partial" || answer.toLowerCase() === "sometimes") {
          mappedAnswer = "Adjustments needed";
        } else if (answer.toLowerCase() === "no") {
          mappedAnswer = "Not accessible";
        } else {
          mappedAnswer = "Not accessible";
        }
        scoreCounts[mappedAnswer] += count;
      });
    });

    let highestScore = "Geen score gevonden";
    let maxCount = 0;
    Object.entries(scoreCounts).forEach(([label, count]) => {
      if (count > maxCount) {
        maxCount = count;
        highestScore = label;
      }
    });

    return highestScore;
  };

  const getLabelColor = (score) => {
    switch (score) {
      case "Fully accessible":
        return "green";
      case "Adjustments needed":
        return "orange";
      case "Not accessible":
        return "red";
      default:
        return "gray";
    }
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
            src={placeDetails.photo || "./assets/images/loginImage.png"}
            alt={placeDetails.name}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>

        <div className="review-button-container">
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
            { key: 'general', label: 'General accessibility' },
            { key: 'parking', label: 'Parking facilities' },
            { key: 'entrance', label: 'Entrance' },
            { key: 'internalNavigation', label: 'Internal navigation' },
            { key: 'sanitary', label: 'Sanitary facilities' },
            { key: 'staff', label: 'Staff support', question: 'staffAssistance' }
          ].map(({ key, label }) => {
            const overallScore = getOverallScore(averageAnswers[key]);
            const borderColor = getLabelColor(overallScore);

            return (
              <div
                className="accessibility-card"
                key={key}
                onClick={() => setExpandedSection(expandedSection === key ? null : key)}
              >
                <AccessibilityButton
                  feedbackSubject={label}
                  accessibilityScore={overallScore}
                  borderColor={borderColor}
                  to={`/hotels/${id}/feature/${key}?name=${encodeURIComponent(placeDetails.name)}&score=${encodeURIComponent(overallScore)}`}
                />
              </div>
            );
          })}
        </div>
        <div className="line" />

        <h2>Location</h2>
        <p>{placeDetails.address}</p>
        {coordinates && (
          <iframe
            title="Map"
            width="100%"
            height="400px"
            style={{ border: 0, borderRadius: "8px" }}
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDJuN-eDKZvS0CkMxPaUN8M1TfpJQ2fFzE&q=${coordinates}`}
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
