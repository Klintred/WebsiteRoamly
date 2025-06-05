import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import '../styles/thankYouPage.css'; // You can create and style this CSS file

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h1>🎉 Thank you for your review!</h1>
        <p>Your feedback helps us improve accessibility for everyone.</p>

        <div className="thank-you-buttons">
          <PrimaryButton
            text="Go to my points"
            onClick={() => navigate('/my-points')}
          />
          <PrimaryButton
            text="Back to hotel"
            variant="secondary"
            onClick={() => navigate('/home')}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
