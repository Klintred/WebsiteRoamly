import React, { useState } from 'react';
import "../styles/reviews.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';

const WriteReviewPage = () => {
  const [responses, setResponses] = useState({
    accessibility: "",
    parking: "",
    entrance: "",
    movement: "",
    restrooms: "",
    staff: "",
    recommend: ""
  });
  const [reviewId, setReviewId] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const navigate = useNavigate();

  const handleTagClick = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://roamly-api.onrender.com/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ general: responses }) // <- wrap in "general"
      });
  
      if (!res.ok) throw new Error("Failed to submit");
  
      const data = await res.json(); // expects { _id: "..." }
      setReviewId(data._id);
      setShowFollowUp(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  if (showFollowUp) {
    return (
      <div className="write-review-container">
        <h2>Thank you for your feedback!</h2>
        <p>Would you like to leave a more detailed review?</p>
        <div className="button-group">
          <PrimaryButton text="Yes, continue" onClick={() => navigate(`/review/details/${reviewId}`)} />
          <PrimaryButton text="No, I'm done" variant="secondary" onClick={() => navigate('/thank-you')} />
        </div>
      </div>
    );
  }
  return (
    <div className="write-review-container">
      <h2>Give feedback</h2>
      <div className="write-review-form">
        <div className="write-review-form-group">
        <QuestionGroup label="How would you rate the overall accessibility?" field="accessibility">
          <Tag text="Fully accessible" color="green" isSelected={responses.accessibility === "Fully accessible"} onClick={(val) => handleTagClick("accessibility", val)} />
          <Tag text="Adjustments needed" color="orange" isSelected={responses.accessibility === "Adjustments needed"} onClick={(val) => handleTagClick("accessibility", val)} />
          <Tag text="Not accessible" color="red" isSelected={responses.accessibility === "Not accessible"} onClick={(val) => handleTagClick("accessibility", val)} />
        </QuestionGroup>

        <QuestionGroup label="Was the parking suitable for your needs?" field="parking">
          <Tag text="Yes" color="green" isSelected={responses.parking === "Yes"} onClick={(val) => handleTagClick("parking", val)} />
          <Tag text="No" color="red" isSelected={responses.parking === "No"} onClick={(val) => handleTagClick("parking", val)} />
        </QuestionGroup>

        <QuestionGroup label="Was the entrance easily accessible?" field="entrance">
          <Tag text="Yes" color="green" isSelected={responses.entrance === "Yes"} onClick={(val) => handleTagClick("entrance", val)} />
          <Tag text="No" color="red" isSelected={responses.entrance === "No"} onClick={(val) => handleTagClick("entrance", val)} />
        </QuestionGroup>

        <QuestionGroup label="Could you move around inside without difficulties?" field="movement">
          <Tag text="Yes" color="green" isSelected={responses.movement === "Yes"} onClick={(val) => handleTagClick("movement", val)} />
          <Tag text="No" color="red" isSelected={responses.movement === "No"} onClick={(val) => handleTagClick("movement", val)} />
          <Tag text="Not applicable" color="gray" isSelected={responses.movement === "Not applicable"} onClick={(val) => handleTagClick("movement", val)} />
        </QuestionGroup>

        <QuestionGroup label="Were the restroom facilities accessible?" field="restrooms">
          <Tag text="Yes" color="green" isSelected={responses.restrooms === "Yes"} onClick={(val) => handleTagClick("restrooms", val)} />
          <Tag text="No" color="red" isSelected={responses.restrooms === "No"} onClick={(val) => handleTagClick("restrooms", val)} />
        </QuestionGroup>

        <QuestionGroup label="Was the staff helpful and accommodating?" field="staff">
          <Tag text="Yes" color="green" isSelected={responses.staff === "Yes"} onClick={(val) => handleTagClick("staff", val)} />
          <Tag text="No" color="red" isSelected={responses.staff === "No"} onClick={(val) => handleTagClick("staff", val)} />
          <Tag text="Not applicable" color="gray" isSelected={responses.staff === "Not applicable"} onClick={(val) => handleTagClick("staff", val)} />
        </QuestionGroup>

        <QuestionGroup label="Would you recommend this location to others with similar needs?" field="recommend">
          <Tag text="Yes" color="green" isSelected={responses.recommend === "Yes"} onClick={(val) => handleTagClick("recommend", val)} />
          <Tag text="No" color="red" isSelected={responses.recommend === "No"} onClick={(val) => handleTagClick("recommend", val)} />
        </QuestionGroup>

          <PrimaryButton text="Send" variant="primary" onClick={handleSubmit} />

        </div>
      </div>
    </div>

  );
};

const QuestionGroup = ({ label, children }) => (
  <div className="write-review-form-group">
    <p>{label}</p>
    <div className='tag-container'>
      <div className='tag-subcontainer'>
        {children}
      </div>
    </div>
  </div>
);

export default WriteReviewPage;
