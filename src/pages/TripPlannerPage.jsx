import React, { useState } from "react";
import CustomCalendar from "../components/Forms/callender";
import "../styles/TripPlannerPage.css";
import PrimaryButton from '../components/Buttons/PrimaryButton';

function TripPlannerPage() {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activityInput, setActivityInput] = useState("");
  const [activities, setActivities] = useState([]);
  const [people, setPeople] = useState(1);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddActivity = (e) => {
    if (e.key === "Enter" && activityInput.trim()) {
      e.preventDefault();
      if (!activities.includes(activityInput.trim())) {
        setActivities([...activities, activityInput.trim()]);
        setActivityInput("");
      }
    }
  };

  const removeActivity = (activity) => {
    setActivities(activities.filter((a) => a !== activity));
  };

  const handleSubmit = async () => {
    if (!destination || !dates[0] || !dates[1] || !departureLocation || activities.length === 0) {
      alert("Please fill in all required fields including at least one activity.");
      return;
    }

    const formattedDates = `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`;
    const prompt = `Create a detailed travel plan with the following details:
- Trip name: ${tripName}
- Departure location: ${departureLocation}
- Destination: ${destination}
- Dates: ${formattedDates}
- Number of people: ${people}
- Preferred activities: ${activities.join(", ")}

Provide the following structure:
{
  "hotel": "Hotel Name",
  "itinerary": [
    {
      "day": "Day 1",
      "activities": ["Activity 1", "Activity 2"],
      "restaurants": ["Restaurant 1", "Restaurant 2"]
    }
  ]
}`;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDltrr08aNnNRhkZXyVTL7mVCPxC-MpSJ4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await res.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      const jsonMatch = output.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error("No valid JSON found.");

      const cleanedResponse = jsonMatch[0];
      const token = localStorage.getItem("token");

      await fetch("https://roamly-api.onrender.com/api/v1/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          TripName: tripName || destination,
          Place: destination,
          StartDate: dates[0].toISOString(),
          EndDate: dates[1].toISOString(),
          Plan: cleanedResponse,
        }),
      });

      setResponse(cleanedResponse);
    } catch (error) {
      setResponse("An error occurred. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <h1 className="planner-header">Create a new trip</h1>
      <div className="planner-subcontainer">

        <div className="planner-input-container">
          <span className="material-symbols-outlined">edit</span>
          <input
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="planner-input"
          />
        </div>

        <div className="planner-input-container">
          <span className="material-symbols-outlined">flight_takeoff</span>
          <input
            type="text"
            placeholder="Where are you departing from?"
            value={departureLocation}
            onChange={(e) => setDepartureLocation(e.target.value)}
            className="planner-input"
          />
        </div>

        <div className="planner-input-container">
          <span className="material-symbols-outlined">place</span>
          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="planner-input"
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
              />
            </div>
          )}
        </div>

        <div className="planner-input-container">
          <span className="material-symbols-outlined">interests</span>
          <input
            type="text"
            placeholder="Type an activity (e.g. Lebanese restaurant)"
            value={activityInput}
            onChange={(e) => setActivityInput(e.target.value)}
            onKeyDown={handleAddActivity}
            className="planner-input"
          />
        </div>

        {activities.length > 0 && (
          <div className="selected-tags">
            {activities.map((activity) => (
              <span key={activity} className="tag-chip">
                {activity}
                <button onClick={() => removeActivity(activity)}>&times;</button>
              </span>
            ))}
          </div>
        )}

        <PrimaryButton
          text={loading ? "Planning..." : "Generate Travel Plan"}
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
  );
}

export default TripPlannerPage;
