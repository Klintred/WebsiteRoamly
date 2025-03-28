import React, { useState } from "react";
import CustomCalendar from "../components/Forms/callender"; // Your new calendar component

function TripPlannerPage() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState([null, null]);
  const [people, setPeople] = useState("");
  const [activities, setActivities] = useState({ sport: false, culture: false, spa: false });
  const [departureLocation, setDepartureLocation] = useState(""); // Added departure location
  const [transportMode, setTransportMode] = useState(""); // Added transport mode
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
    
    1. List specific wheelchair accessible hotels by name.
    2. For each day of the trip, provide:
       - Day: Name of the day (e.g., "Day 1", "Day 2").
       - Activities: A list of wheelchair accessible activities for the day (e.g., sport, culture, spa).
       - Restaurants: A list of wheelchair accessible restaurant names for that day.
       
    Ensure that:
    - The hotel names, activity names, and restaurant names are all real and wheelchair accessible.
    - Provide popular and relevant wheelchair accessible options that cater to people with mobility challenges.
    
    Format the response like this:
    
    {
      "hotel": "Hotel Name",
      "itinerary": [
        {
          "day": "Day 1",
          "activities": ["Wheelchair accessible Activity 1", "Wheelchair accessible Activity 2", "Wheelchair accessible Activity 3"],
          "restaurants": ["Wheelchair accessible Restaurant 1", "Wheelchair accessible Restaurant 2"]
        },
        {
          "day": "Day 2",
          "activities": ["Wheelchair accessible Activity 1", "Wheelchair accessible Activity 2", "Wheelchair accessible Activity 3"],
          "restaurants": ["Wheelchair accessible Restaurant 1", "Wheelchair accessible Restaurant 2"]
        }
        ...
      ]
    }
    
    Please ensure the response is valid JSON.`;

    console.log(prompt);

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

      console.log("AI response:", output);

      // Verwijder markdown-indicatoren en andere ongewenste tekens
      const jsonMatch = output.match(/{[\s\S]*}/); // Pakt eerste JSON block
      if (!jsonMatch) {
        throw new Error("Geen geldige JSON gevonden in de AI-response.");
      }
      const cleanedResponse = jsonMatch[0]; // Nu puur de JSON

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Kon de AI-response niet parsen naar JSON:", error);
        setResponse("De gegenereerde reisplanning kon niet correct worden ingelezen als JSON. Probeer het opnieuw.");
        setLoading(false);
        return;
      }

      console.log("Cleaned AI response:", cleanedResponse);
      setResponse(cleanedResponse);

      // We maken tripData aan en sturen het naar de backend
      const tripData = {
        TripName: destination,
        Place: destination,
        StartDate: dates[0].toISOString(),
        EndDate: dates[1].toISOString(),
        Plan: cleanedResponse, // Sla het op als tekst, zonder markdown
      };

      // Verstuur tripData naar de backend
      const apiResponse = await fetch("https://roamly-api.onrender.com/api/v1/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      const responseJson = await apiResponse.json();
      console.log("Trip saved:", responseJson);

      // Update de response state als de trip succesvol is opgeslagen
      setResponse("Trip successfully saved!");

    } catch (error) {
      console.error("Fout bij het ophalen van de AI response:", error);
      setResponse("Er is een fout opgetreden. Controleer de API-sleutel en probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>AI Travel Planner</h1>

      <input
        type="text"
        placeholder="Where do you want to go?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "16px" }}>
        <h3>When?</h3>
        <CustomCalendar selectedDates={dates} setSelectedDates={setDates} />
      </div>

      <input
        type="number"
        placeholder="How many people?"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <input
        type="text"
        placeholder="Where are you departing from?"
        value={departureLocation}
        onChange={(e) => setDepartureLocation(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <input
        type="text"
        placeholder="Preferred transport mode (e.g., car, plane, train)"
        value={transportMode}
        onChange={(e) => setTransportMode(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "16px" }}>
        <h3>What activities do you prefer?</h3>
        <label>
          <input
            type="checkbox"
            checked={activities.sport}
            onChange={() => handleActivityChange("sport")}
          /> Sport
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={activities.culture}
            onChange={() => handleActivityChange("culture")}
          /> Culture
        </label>
        <br />
        <label>
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
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
          borderRadius: "8px",
          backgroundColor: "#4F46E5",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Planning..." : "Generate Travel Plan"}
      </button>

      {response && (
        <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
          <h2 style={{ fontWeight: "600" }}>Travel Plan Proposal:</h2>
          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default TripPlannerPage;
