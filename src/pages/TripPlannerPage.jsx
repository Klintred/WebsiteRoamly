import { useState } from "react";

function GeminiAPI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDltrr08aNnNRhkZXyVTL7mVCPxC-MpSJ4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Geen antwoord ontvangen.";
      setResponse(output);
    } catch (error) {
      setResponse("Er is een fout opgetreden. Controleer de API-sleutel en probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>Gemini API Demo</h1>
      <input
        type="text"
        placeholder="Typ je vraag..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "16px", borderRadius: "8px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "10px", marginTop: "12px", borderRadius: "8px", backgroundColor: "#4F46E5", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Laden..." : "Verzend"}
      </button>
      {response && (
        <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
          <h2 style={{ fontWeight: "600" }}>Antwoord:</h2>
          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default GeminiAPI; 

// ✅ UI-componenten worden nu direct in de code opgebouwd zonder externe imports.