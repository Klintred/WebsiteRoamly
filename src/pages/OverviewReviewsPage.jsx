import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

const OverviewReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://roamly-api.onrender.com/api/v1/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data.");
          return res.json();
        })
        .then((data) => {
          const user = data.data.user || data.user || data;
          setUserId(user._id);
          localStorage.setItem("userId", user._id);
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Haal alle reviews op en filter lokaal op userId
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://roamly-api.onrender.com/api/v1/reviews`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        // Filter op userId
        const filteredReviews = data.filter(
          (review) => String(review.userId) === String(userId)
        );

        setReviews(filteredReviews);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-action-container desktop">
          <h1>Profile</h1>
          <Link className="profile-action-link" to="/profile">
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">person</span>
              About me
            </div>
          </Link>
          <Link className="profile-action-link" to="/my-reviews">
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">reviews</span>
              My reviews
            </div>
          </Link>
          <Link className="profile-action-link" to="/my-points">
            <div className="profile-action-subcontainer">
              <span className="material-symbols-outlined">star_rate</span>
              My points
            </div>
          </Link>
        </div>
        <div className="vertical-line"></div>

        <div className="profile-wrapper">
          <div className="profile-action-container mobile">
            <h1>Profile</h1>
            <Link className="profile-action-link" to="/profile">
              <div className="profile-action-subcontainer">
                <span className="material-symbols-outlined">person</span>
                About me
              </div>
            </Link>
            <Link className="profile-action-link" to="/my-reviews">
              <div className="profile-action-subcontainer">
                <span className="material-symbols-outlined">reviews</span>
                My reviews
              </div>
            </Link>
            <Link className="profile-action-link" to="/my-points">
              <div className="profile-action-subcontainer">
                <span className="material-symbols-outlined">star_rate</span>
                My points
              </div>
            </Link>
          </div>
          <div className="flex-row">
            <div className="profile-header-container">
              <div className="profile-header">
                <h2>My reviews</h2>
                <p className="profile-subtitle">View your written reviews</p>
              </div>
            </div>
            <div className="reviews-container">
              {loading ? (
                <p>Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <h3>{review.placeName}</h3>
                    <p>{review.textReview || "No written comment."}</p>
                    <p>
                      <strong>Accessibility:</strong>{" "}
                      {review.general?.accessibility}
                    </p>
                    <p>
                      <strong>Recommendation:</strong>{" "}
                      {review.general?.recommend}
                    </p>
                    {review.photoUrls && review.photoUrls.length > 0 && (
                      <div className="photo-preview">
                        {review.photoUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`review ${idx}`}
                            style={{ width: "100px", marginRight: "8px" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewReviewsPage;
