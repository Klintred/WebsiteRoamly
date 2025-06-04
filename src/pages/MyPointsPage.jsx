import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";

const MyPointsPage = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchReviewCount = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const res = await fetch(`https://roamly-api.onrender.com/api/v1/reviews/user/${username}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const reviews = await res.json();
        setPoints(reviews.length); 
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviewCount();
  }, []);
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
            <Link className="profile-action-link" to="/profile">
              <div className="profile-action-subcontainer">
                <span className="material-symbols-outlined">reviews</span>
                My reviews
              </div>
            </Link>
            <Link className="profile-action-link" to="/profile">
              <div className="profile-action-subcontainer">
                <span className="material-symbols-outlined">star_rate</span>
                My points
              </div>
            </Link>
          </div>

          <div className="profile-header-container">
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
          <div className="points-container">
            <h2>Rewards</h2>
            <div className="points-content">
              <div className="points-reward">
                <p className="points-reward-header">20 points</p>
                <p>Acces to 1 free AI-trip.</p>
                <button className="points-reward-button">Redeem</button>
              </div>

              <div className="points-reward">
                <p className="points-reward-header">60 points</p>
                <p>50% discount on trip bundle (10 trips).</p>
                <button className="points-reward-button">Redeem</button>
              </div>

              <div className="points-reward">
                <p className="points-reward-header">100 points</p>
                <p>Goodie bag.</p>
                <button className="points-reward-button">Redeem</button>
              </div>

              <div className="points-reward">
                <p className="points-reward-header">140 points</p>
                <p>Chance of winning a weekend-city trip for two people.</p>
                <button className="points-reward-button">Redeem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPointsPage;
