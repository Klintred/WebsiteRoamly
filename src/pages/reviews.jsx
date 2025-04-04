import React, { useState } from "react";

const AccessibilityFeedback = () => {
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState({
    overall: "",
    parking: "",
    entrance: "",
    movement: "",
    restroom: "",
    signage: "",
    staffHelp: "",
    additionalComments: "",
  });

  const handleSelect = (field, value) => {
    setFeedback({ ...feedback, [field]: value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Feedback:", feedback);
    // Hier zou je de feedback naar een API kunnen sturen
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg h-screen flex flex-col justify-center">

      <h2 className="text-xl font-semibold mb-4">Give feedback</h2>

      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        {step === 1 && (
          <>
            <div className="mb-4">
              <p className="font-medium">How would you rate the overall accessibility?</p>
              <div className="flex gap-2 mt-2">
                {[{ label: "Fully accessible", value: "fully", color: "green" },
                  { label: "Adjustments needed", value: "adjustments", color: "yellow" },
                  { label: "Not accessible", value: "not", color: "red" }].map((option) => (
                  <button key={option.value} type="button"
                    className={`px-3 py-1 border rounded-full ${feedback.overall === option.value ? `bg-${option.color}-500 text-white` : "border-gray-300"}`}
                    onClick={() => handleSelect("overall", option.value)}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {[{ label: "Was the parking suitable for your needs?", field: "parking" },
              { label: "Was the entrance easily accessible?", field: "entrance" },
              { label: "Could you move around inside without difficulties?", field: "movement" }].map((question) => (
              <div key={question.field} className="mb-4">
                <p className="font-medium">{question.label}</p>
                <div className="flex gap-2 mt-2">
                  {["Yes", "No"].map((answer) => (
                    <button key={answer} type="button"
                      className={`px-3 py-1 border rounded-full ${feedback[question.field] === answer.toLowerCase() ? "bg-blue-500 text-white" : "border-gray-300"}`}
                      onClick={() => handleSelect(question.field, answer.toLowerCase())}>
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {step === 2 && (
          <>
            {[{ label: "Were the restroom facilities accessible?", field: "restroom" },
              { label: "Was the signage clear and helpful?", field: "signage" },
              { label: "Did staff provide necessary assistance?", field: "staffHelp" }].map((question) => (
              <div key={question.field} className="mb-4">
                <p className="font-medium">{question.label}</p>
                <div className="flex gap-2 mt-2">
                  {["Yes", "No"].map((answer) => (
                    <button key={answer} type="button"
                      className={`px-3 py-1 border rounded-full ${feedback[question.field] === answer.toLowerCase() ? "bg-blue-500 text-white" : "border-gray-300"}`}
                      onClick={() => handleSelect(question.field, answer.toLowerCase())}>
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <p className="font-medium">Additional Comments</p>
              <textarea className="w-full p-2 border rounded-lg" rows="3"
                value={feedback.additionalComments}
                onChange={(e) => handleSelect("additionalComments", e.target.value)}
                placeholder="Share any additional feedback..."></textarea>
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg">
          {step === 1 ? "Next" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AccessibilityFeedback;
