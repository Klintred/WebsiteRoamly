import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "../styles/featureDetail.css";
import AccessibilityButton from '../components/Buttons/AccessibilityButton';
import { questionLabelMap } from "../config/questionLabels";

const API_BASE_URL = "https://roamly-api.onrender.com";
const labelMap = {
    general: "General Accessibility",
    parking: "Parking",
    entrance: "Entrance",
    internalNavigation: "Internal Navigation",
    sanitary: "Sanitary",
    staff: "Staff"
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

const FeatureDetailPage = () => {
    const { id, feature } = useParams();
    const [placeName, setPlaceName] = useState("");
    const [reviews, setReviews] = useState([]);
    const [averages, setAverages] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const placeNameFromQuery = queryParams.get("name");
    const scoreFromQuery = queryParams.get("score");

    useEffect(() => {
        const fetchData = async () => {
            try {
                let placeNameValue = placeNameFromQuery;

                if (!placeNameValue) {
                    const placeRes = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
                    const placeData = await placeRes.json();
                    placeNameValue = placeData.name;
                }

                setPlaceName(placeNameValue);

                const reviewRes = await fetch(`${API_BASE_URL}/api/v1/reviews`);
                const allReviews = await reviewRes.json();
                const relevant = allReviews.filter(r => r.placeName === placeNameValue && r[feature]);

                setReviews(relevant);

                const avg = {};
                relevant.forEach(r => {
                    const section = r[feature];
                    if (section) {
                        Object.entries(section).forEach(([q, a]) => {
                            avg[q] = avg[q] || {};
                            avg[q][a] = (avg[q][a] || 0) + 1;
                        });
                    }
                });

                setAverages(avg);
            } catch (err) {
                console.error("Error loading feature detail page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, feature, placeNameFromQuery]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="feature-detail-page">
            <div className="container">
                <Link to={`/hotels/${id}`}>← Back to place</Link>
                <h1>Reviews for {placeName}</h1>

                <AccessibilityButton
                    feedbackSubject={labelMap[feature] || feature}
                    accessibilityScore={scoreFromQuery}
                    borderColor={getLabelColor(scoreFromQuery)}
                />

                <div className="question-list">
                    {Object.entries(averages).map(([question, answerCounts]) => (
                        <div className="question-card" key={question}>
                            <h3 className="question-title">
                                {questionLabelMap[question] || question}
                            </h3>
                            <ul className="answer-list">
                                {Object.entries(answerCounts).map(([answer, count]) => (
                                    <li key={answer} className="answer-item">
                                        <span className="answer-text">{answer}</span>
                                        <span className="answer-count">({count})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="line"></div>
                <h2>User reviews</h2>
                {reviews.filter(r => r.textReview).map((r, idx) => (
                    <div key={idx} className="review-block">
                        <div className="flex-column">
                            <img
                                src={r.profileImage || "/assets/images/avatar.jpg"}
                                alt={r.username || "User"}
                                className="profile-image-reviews"
                            />
                            <p><strong>{r.username || "Anonymous"}</strong> </p>
                            
                        </div>
                        <div>
<p>{r.textReview}</p>
                        </div>
                        <div className="line"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureDetailPage;