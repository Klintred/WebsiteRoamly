import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

const MyPointsPage = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const res = await fetch(`https://roamly-api.onrender.com/api/v1/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const reviews = await res.json();

        const userReviews = reviews.filter(
          (review) => (review.username || "Anonymous") === username
        );

        const totalPoints = userReviews.reduce(
          (sum, review) => sum + (review.points || 0),
          0
        );

        setPoints(totalPoints);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchUserPoints();
  }, []);
  const rewards = [
    { requiredPoints: 20, description: "Access to 1 free AI-trip." },
    { requiredPoints: 60, description: "50% discount on trip bundle (10 trips)." },
    { requiredPoints: 100, description: "Goodie bag." },
    { requiredPoints: 140, description: "Chance of winning a weekend-city trip for two people." },
  ];

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
            <div className="profile-header">
              <h2>My points</h2>
              <p className="profile-subtitle">Manage your points and rewards</p>
            </div>

            <div className="points-container">
              <div className="points-header">
                <div className="points-header-text">
                  <p className="points-header-text-score">{points}</p>
                  <p>points</p>
                </div>
              </div>
            </div>
          </div>

          <div className="line"></div>
          <div className="flex-row">
            <h2>Rewards</h2>
            <div className="points-content">
              {rewards.map((reward, index) => (
                <div className="points-reward" key={index}>
                  <p className="points-reward-header">{reward.requiredPoints} points</p>
                  <p>{reward.description}</p>
                  <button
                    className="points-reward-button"
                    disabled={points < reward.requiredPoints}
                  >
                    {points < reward.requiredPoints ? "Not enough points" : "Redeem"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPointsPage;
