import React, { useState } from "react";
import CustomCalendar from "../components/Forms/callender";
import "../styles/TripPlannerPage.css";
import PrimaryButton from '../components/Buttons/PrimaryButton';


function TripPlannerPage() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [people, setPeople] = useState(1);
  const [activities, setActivities] = useState({ sport: false, culture: false, spa: false });
  const [departureLocation, setDepartureLocation] = useState("");
  const [transportMode, setTransportMode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripName, setTripName] = useState("");


  const handleActivityChange = (activity) => {
    setActivities((prev) => ({ ...prev, [activity]: !prev[activity] }));
  };

  const handleSubmit = async () => {
    console.log("Button clicked!");
    console.log("Current Form State:");
    console.log({ tripName, destination, dates, people, activities, departureLocation, transportMode });

    if (!destination || !dates[0] || !dates[1] || !people || !Object.values(activities).includes(true) || !departureLocation) {
      console.log("Form validation failed!");
      if (!destination) console.log("❌ Destination missing");
      if (!dates[0] || !dates[1]) console.log("❌ Dates missing");
      if (!people) console.log("❌ People missing");
      if (!Object.values(activities).includes(true)) console.log("❌ No activity selected");
      if (!departureLocation) console.log("❌ Departure location missing");
      if (!transportMode) console.log("❌ Transport mode missing");
      return;
    }
    console.log("✅ Form is valid. Submitting...");

    const selectedActivities = Object.entries(activities)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(", ");

    const formattedDates = `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`;

    const prompt = `Create a detailed travel plan with the following details and structure:
    - Departure location: ${departureLocation}
    - Transport mode: ${transportMode}
    - Destination: ${destination}
    - Dates: ${formattedDates}
    - Number of people: ${people}
    - Preferred activities: ${selectedActivities}

    Please provide the following information in a structured format:
    {
      "hotel": "Hotel Name",
      "itinerary": [
        {
          "day": "Day 1",
          "activities": ["Wheelchair accessible Activity 1", "Wheelchair accessible Activity 2", "Wheelchair accessible Activity 3"],
          "restaurants": ["Wheelchair accessible Restaurant 1", "Wheelchair accessible Restaurant 2"]
        }
      ]
    }`;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDltrr08aNnNRhkZXyVTL7mVCPxC-MpSJ4", {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          TripName: destination,
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
  }

  return (
    <div className="planner-container">
      <h1 className="planner-header">Generate an AI-generated trip</h1>
      <div className="planner-subcontainer">

        <div className="planner-input-container">
          <div>
            <span className="material-symbols-outlined">
              bookmark
            </span>

          </div>
          <input
            type="text"
            placeholder="Trip name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="planner-input"
          />
        </div>

        <div className="planner-input-container">
          <div>
            <span className="material-symbols-outlined">
              flight_takeoff
            </span>

          </div>
          <input
            type="text"
            placeholder="Where are you departing from?"
            value={departureLocation}
            onChange={(e) => setDepartureLocation(e.target.value)}
            className="planner-input"
          />
        </div>

        <div className="planner-input-container">
          <div>
            <span className="material-symbols-outlined">
              flight_land
            </span>

          </div>
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
            <div>
              <span className="material-symbols-outlined">
                calendar_today
              </span>
            </div>
            <button
              type="button"
              className="calendar-select-button"
              onClick={() => setCalendarOpen((prev) => !prev)}
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
                  console.log("Cleaned selected dates:", maybeDates);

                  setDates(maybeDates);

                  if (maybeDates[0] && maybeDates[1]) {
                    setCalendarOpen(false);
                  }
                }}
                variant="tripplanner"

              />
            </div>
          )}
        </div>

        <div className="planner-section">
          <div className="planner-input-container">
            <div>
              <span className="material-symbols-outlined">
                local_activity
              </span>
            </div>
            <button
              type="button"
              className="calendar-select-button"
              onClick={() => setActivitiesOpen((prev) => !prev)}
            >
              {Object.values(activities).some(val => val)
                ? `Selected: ${Object.entries(activities)
                  .filter(([_, value]) => value)
                  .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                  .join(", ")}`
                : "Select activities"}
            </button>

          </div>
          {activitiesOpen && (
            <div className="activity-options">
              {["sport", "culture", "spa"].map((activity) => (
                <label
                  key={activity}
                  className={`planner-label ${activities[activity] ? "checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={activities[activity]}
                    onChange={() => handleActivityChange(activity)}
                  />{" "}
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>


      </div>
      <PrimaryButton
        text={loading ? "Planning..." : "Generate with AI"}
        onClick={handleSubmit}
        variant="primary"
        disabled={loading}

      />
      {response && (
        <div className="planner-response">
          <h2 className="planner-response-title">Travel Plan Proposal:</h2>
          <p className="planner-response-text">{response}</p>
        </div>
      )}
    </div>
  );
}

export default TripPlannerPage;
