import React, { useState } from 'react';
import "../../styles/addpopup.css";
import PrimaryButton from '../Buttons/PrimaryButton';
import { FaTimes } from 'react-icons/fa';

// Array met de bestandsnamen van vakantie-foto's
const LOCAL_VACATION_IMAGES = [
  "ethan-robertson-SYx3UCHZJlo-unsplash.jpg",
  "haseeb-jamil-zbg2-gyo_hM-unsplash.jpg",
  "link-hoang-UoqAR2pOxMo-unsplash.jpg",
  "marissa-grootes-TVllFyGaLEA-unsplash.jpg",
  "natalya-zaritskaya-SIOdjcYotms-unsplash.jpg",
  "tron-le-JsuBKjHGDMM-unsplash.jpg",
  "upgraded-points-KVym2PAn1gA-unsplash.jpg",
];

// Hulpfunctie voor random afbeelding
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * LOCAL_VACATION_IMAGES.length);
  return `/assets/images/vacation_pictures/${LOCAL_VACATION_IMAGES[randomIndex]}`;
};

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
    <div className="modal-overlay-homepage">
      <div className={`modal-homepage ${step === 1 ? 'step-one' : 'step-two'}`}>

        {step === 2 && (
          <button
            className="back-button top-left"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        )}

        <button className="close-button" onClick={onClose}> <FaTimes /></button>
        <h1>Add {selectedPlace?.name} to a trip</h1>

        {step === 1 && (
          <>
            <h2>Select a trip:</h2>
            <div className={`trip-cards-popup ${userTrips.length === 1 ? 'align-left' : ''}`}>
              {[...userTrips].reverse().map(trip => {
                const randomImage = getRandomImage();
                return (
                  <div
                    key={trip._id}
                    className={`trip-card ${selectedTripId === trip._id ? 'selected' : ''}`}
                  >
                    <img
                      src={randomImage}
                      alt="Trip"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="trip-details">
                      <h3>{trip.TripName}</h3>
                      <p>{trip.Place}</p>
                      <p>
                        {new Date(trip.StartDate).toLocaleDateString()} -{" "}
                        {new Date(trip.EndDate).toLocaleDateString()}
                      </p>
                      <PrimaryButton
                        text="Choose"
                        onClick={() => handleTripSelect(trip._id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && selectedTripId && (
          <>
            <h2>Select a day:</h2>
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
              <PrimaryButton
                text="Add activity"
                onClick={handleAddActivityToTrip}
                disabled={selectedTripId === ""}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
