import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomCalendar from "../components/Forms/callender";
import "../styles/TripPlannerPage.css";
import PrimaryButton from '../components/Buttons/PrimaryButton';
import LocationAutocomplete from "../components/Forms/LocationAutocomplete";

function TripPlannerPage() {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activityInput, setActivityInput] = useState("");
  const [activities, setActivities] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tripCount, setTripCount] = useState(0);
  const [showNoTripsModal, setShowNoTripsModal] = useState(false);

  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found. User may not be logged in.");
          return;
        }
        const res = await fetch("https://roamly-api.onrender.com/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        console.log("User data:", data);
        setUserData(data.data.user);
        setTripCount(data.data.user.tripcount || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddActivity = (e) => {
    const keyPressed = e.key;
    if ((keyPressed === "Enter" || keyPressed === "," || keyPressed === " ") && activityInput.trim()) {
      e.preventDefault();
      const newActivity = activityInput.trim().replace(/,$/, "");
      if (!activities.includes(newActivity)) {
        setActivities([...activities, newActivity]);
      }
      setActivityInput("");
    }
  };

  const removeActivity = (activity) => {
    setActivities(activities.filter((a) => a !== activity));
  };

  const handleSubmit = async () => {
    if (tripCount <= 0) {
      setShowNoTripsModal(true);
      return;
    }

    if (!tripName || !destination || !departureLocation || !dates[0] || !dates[1] || activities.length === 0) {
      alert("Please fill in all required fields including at least one activity.");
      return;
    }

    const formattedDates = `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`;
    const prompt = `You are a travel planner AI helping a user plan a personalized trip.

Use the details below to create a travel plan strictly tailored to their preferences:
- Trip Name: ${tripName}
- Departure Location: ${departureLocation}
- Destination City: ${destination}
- Dates: ${formattedDates}
- Preferred Activities: ${activities.join(", ")}

The user must see these activities reflected in the itinerary suggestions.

⚠️ VERY IMPORTANT:
- Do NOT recommend places outside ${destination}
- Focus only on ${destination} and surrounding areas
- Choose well-known places or hidden gems inside that region
- Include the user's preferred activity keywords where relevant

Format the output strictly in this JSON structure:
{
  "hotel": "Hotel Name",
  "itinerary": [
    {
      "day": "Day 1",
      "activities": ["Activity 1", "Activity 2"],
      "restaurants": ["Restaurant 1", "Restaurant 2"]
    }
  ]
}

Return only this JSON.`;

    setLoading(true);
    setResponse("");

    try {
      // Call AI
      const aiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDltrr08aNnNRhkZXyVTL7mVCPxC-MpSJ4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const aiData = await aiRes.json();
      const output = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = output.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error("No valid JSON found.");
      const cleanedResponse = jsonMatch[0];

      const token = localStorage.getItem("token");

      // Save trip
      const tripRes = await fetch("https://roamly-api.onrender.com/api/v1/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          TripName: tripName,
          Place: destination,
          StartDate: dates[0].toISOString(),
          EndDate: dates[1].toISOString(),
          Plan: cleanedResponse,
        }),
      });

      const tripData = await tripRes.json();
      const newTripId = tripData?.data?.trip?._id;
      if (!newTripId) throw new Error("Trip save failed.");

      // ✅ Update tripcount in database
      const decrementRes = await fetch("https://roamly-api.onrender.com/api/v1/users/decrement-tripcount", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!decrementRes.ok) {
        console.warn("Trip saved but tripcount could not be updated on server.");
      }

      setTripCount((prevCount) => {
        const updatedCount = Math.max(prevCount - 1, 0);
        if (updatedCount === 0) {
          setShowNoTripsModal(true);
        }
        return updatedCount;
      });

      navigate(`/my-trips-overview?tripId=${newTripId}`);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTripCount = () => {
    return tripCount !== null ? tripCount : "...";
  };

  return (
    <div className="planner-container">
      <div className="planner-content">
        <h1 className="planner-header">Plan your perfect trip with AI</h1>
        <div className="planner-subcontainer">
          <div className="tripcount-container">
            <p>Je kunt nog {getTripCount()} trip(s) plannen.</p>
          </div>

          <div className="planner-input-container">
            <span className="material-symbols-outlined">edit</span>
            <input
              type="text"
              placeholder="Trip name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="planner-input"
            />
          </div>

          <div className="planner-input-container">
            <span className="material-symbols-outlined">flight_takeoff</span>
            <LocationAutocomplete
              placeholder="Where are you departing from?"
              value={departureLocation}
              onChange={setDepartureLocation}
            />

          </div>

          <div className="planner-input-container">
            <span className="material-symbols-outlined">place</span>
            <LocationAutocomplete
              placeholder="Where are you going?"
              value={destination}
              onChange={setDestination}
            />
          </div>

          <div className="planner-section">
            <div className="planner-input-container">
              <span className="material-symbols-outlined">calendar_today</span>
              <button
                type="button"
                className="calendar-select-button"
                onClick={() => setCalendarOpen(!calendarOpen)}
              >
                {dates[0] && dates[1]
                  ? `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`
                  : "Select your dates"}
              </button>
            </div>
            {calendarOpen && (
              <div className="calendar-wrapper">
                <CustomCalendar
                  selectedDates={dates}
                  setSelectedDates={(selected) => {
                    const maybeDates = typeof selected === "function" ? selected(dates) : selected;
                    setDates(maybeDates);
                    if (maybeDates[0] && maybeDates[1]) setCalendarOpen(false);
                  }}
                  variant="tripplanner"
                />
              </div>
            )}
          </div>

          <div className="planner-input-container">
            <span className="material-symbols-outlined">interests</span>
            <input
              type="text"
              placeholder="Add an activity (e.g. hiking, museum), then press enter, comma, or space"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              onKeyDown={handleAddActivity}
              className="planner-input"
            />

          </div>

          {activities.length > 0 && (
            <div className="selected-tags">
              {activities.map((activity) => (
                <span key={activity} className="filter-button ">
                  {activity}
                  <button onClick={() => removeActivity(activity)}>&times;</button>
                </span>
              ))}
            </div>
          )}

          <PrimaryButton
            text={loading ? "Planning..." : "Generate travel plan"}
            onClick={handleSubmit}
            variant="primary"
            disabled={loading}
          />

          {response && (
            <div className="planner-response">
              <h2 className="planner-response-title">Travel Plan Proposal:</h2>
              <pre className="planner-response-text">{response}</pre>
            </div>
          )}
        </div>
      </div>
      {showNoTripsModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Je hebt geen trips meer over</h3>
            <p>Koop meer trips om verder te plannen!</p>
            <div className="modal-container-buttons">
              <PrimaryButton
                text="OK"
                onClick={() => setShowNoTripsModal(false)}
              />
              <PrimaryButton
                text="Ga naar abonnement"
                variant="secondary"
                onClick={() => {
                  setShowNoTripsModal(false);
                  navigate("/profile"); 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default TripPlannerPage;
