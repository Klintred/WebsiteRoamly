import React, { useState } from "react";
import CustomCalendar from "../components/Forms/callender";
import "../styles/TripPlannerPage.css";

function TripPlannerPage() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [people, setPeople] = useState(1);
  const [activities, setActivities] = useState({ sport: false, culture: false, spa: false });
  const [departureLocation, setDepartureLocation] = useState("");
  const [transportMode, setTransportMode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivityChange = (activity) => {
    setActivities((prev) => ({ ...prev, [activity]: !prev[activity] }));
  };

  const handleSubmit = async () => {
    if (!destination || !dates[0] || !dates[1] || !people || !Object.values(activities).includes(true) || !departureLocation || !transportMode) return;

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
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
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

      const tripData = {
        TripName: destination,
        Place: destination,
        StartDate: dates[0].toISOString(),
        EndDate: dates[1].toISOString(),
        Plan: cleanedResponse,
      };

      await fetch("https://roamly-api.onrender.com/api/v1/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      setResponse("Trip successfully saved!");
    } catch (error) {
      setResponse("An error occurred. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <h1 className="planner-header">AI Travel Planner</h1>

      <input
        type="text"
        placeholder="Where do you want to go?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="planner-input"
      />

      <div className="planner-section">
        <h3 className="planner-subtitle">When?</h3>
        <CustomCalendar selectedDates={dates} setSelectedDates={setDates} />
      </div>

      <div className="planner-section">
        <h3 className="planner-subtitle">How many people?</h3>
        <div className="people-stepper">
          <button
            type="button"
            className="circle-button"
            onClick={() => setPeople((prev) => Math.max(1, Number(prev) - 1))}
          >
            –
          </button>
          <span className="people-count">{people}</span>
          <button
            type="button"
            className="circle-button"
            onClick={() => setPeople((prev) => Number(prev) + 1)}
          >
            +
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Where are you departing from?"
        value={departureLocation}
        onChange={(e) => setDepartureLocation(e.target.value)}
        className="planner-input"
      />

      <input
        type="text"
        placeholder="Preferred transport mode (e.g., car, plane, train)"
        value={transportMode}
        onChange={(e) => setTransportMode(e.target.value)}
        className="planner-input"
      />

      <div className="planner-section">
        <h3 className="planner-subtitle">What activities do you prefer?</h3>
        <label className={`planner-label ${activities.sport ? "checked" : ""}`}>
          <input
            type="checkbox"
            checked={activities.sport}
            onChange={() => handleActivityChange("sport")}
          /> Sport
        </label>
        <label className={`planner-label ${activities.culture ? "checked" : ""}`}>
          <input
            type="checkbox"
            checked={activities.culture}
            onChange={() => handleActivityChange("culture")}
          /> Culture
        </label>
        <label className={`planner-label ${activities.spa ? "checked" : ""}`}>
          <input
            type="checkbox"
            checked={activities.spa}
            onChange={() => handleActivityChange("spa")}
          /> Spa
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="planner-button"
      >
        {loading ? "Planning..." : "Generate Travel Plan"}
      </button>

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
