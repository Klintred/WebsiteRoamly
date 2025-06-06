import React, { useState } from 'react';
import "../../styles/addpopup.css";

const Popup = ({
  showModal,
  selectedPlace,
  userTrips,
  selectedTripId,
  setSelectedTripId,
  selectedDayIndex,
  setSelectedDayIndex,
  handleAddActivityToTrip,
  onClose
}) => {
  const [step, setStep] = useState(1);

  if (!showModal) return null;

  const handleTripSelect = (tripId) => {
    setSelectedTripId(tripId);
    setStep(2);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Back button for step 2 */}
        {step === 2 && (
          <button
            className="back-button top-left"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        )}

        <button className="close-button" onClick={onClose}>X</button>
        <h2>Add "{selectedPlace?.name}" to a Trip</h2>

        {step === 1 && (
          <>
            <h3>Select a Trip:</h3>
            <div
              className={`trip-cards-popup ${
                userTrips.length === 1 ? 'align-left' : ''
              }`}
            >
              {userTrips.map(trip => (
                <div
                  key={trip._id}
                  className={`trip-card-popup ${
                    selectedTripId === trip._id ? 'selected' : ''
                  }`}
                >
                  <img src="../assets/images/loginImage.png" alt="Trip" />
                  <div className="trip-details-popup">
                    <h3>{trip.TripName}</h3>
                    <p>{trip.Place}</p>
                    <p>
                      {new Date(trip.StartDate).toLocaleDateString()} -{" "}
                      {new Date(trip.EndDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="choose-button"
                    onClick={() => handleTripSelect(trip._id)}
                  >
                    Choose
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && selectedTripId && (
          <>
            <h3>Select a Day:</h3>
            <div className="day-selector">
              {(() => {
                const trip = userTrips.find(t => t._id === selectedTripId);
                const itineraryLength = trip
                  ? (typeof trip.Plan === "string"
                      ? JSON.parse(trip.Plan).itinerary.length
                      : trip.Plan.itinerary.length)
                  : 0;
                return [...Array(itineraryLength)].map((_, index) => (
                  <button
                    key={index}
                    className={`day-button ${selectedDayIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedDayIndex(index)}
                  >
                    Day {index + 1}
                  </button>
                ));
              })()}
            </div>

            <div className="popup-actions">
              <button
                className="confirm-button"
                onClick={handleAddActivityToTrip}
                disabled={selectedTripId === ""}
              >
                Add Activity
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
