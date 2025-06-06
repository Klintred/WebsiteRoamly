import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";
import { questionLabelMap } from "../config/questionLabels";

const ParkingReviewPage = () => {
  const { id } = useParams();

  const [responses, setResponses] = useState({
    designatedSpot: "",
    sizeRating: "",
    entranceAccessibleParking: "",
    closeToEntrance: "",
  });

  const navigate = useNavigate();

  const handleTagClick = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async () => {
    const requiredFields = [
      "designatedSpot",
      "sizeRating",
      "entranceAccessibleParking",
      "closeToEntrance",
    ];
    const unanswered = requiredFields.filter(field => !responses[field]);
    console.log("responses:", responses);
    console.log("unanswered:", unanswered);
    if (unanswered.length > 0) {
      alert("Please answer all required questions before submitting.");
      return;
    }
    try {
      const res = await fetch(`https://roamly-api.onrender.com/api/v1/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parking: responses,
          points: 1,
          sectionsCompleted: "parking"
        })
      });

      if (!res.ok) throw new Error("Failed to update review");

      navigate(`/review/entrance/${id}`);
    } catch (err) {
      console.error(err);
      alert("Could not save detailed review.");
    }
  };

  return (
    <div className="write-review-container">
      <div className='container-small'>

        <h1>Parking facilities</h1>

        <div className="write-review-form-group">
          <QuestionGroup label={questionLabelMap.designatedSpot} field="designatedSpot" required>
            <Tag text="Yes" color="green" isSelected={responses.designatedSpot === "Yes"} onClick={(val) => handleTagClick("designatedSpot", val)} />
            <Tag text="No" color="red" isSelected={responses.designatedSpot === "No"} onClick={(val) => handleTagClick("designatedSpot", val)} />
          </QuestionGroup>
          <QuestionGroup label={questionLabelMap.sizeRating} field="sizeRating" required>
            <Tag text="Small" color="red" isSelected={responses.sizeRating === "Small"} onClick={(val) => handleTagClick("sizeRating", val)} />
            <Tag text="Medium" color="orange" isSelected={responses.sizeRating === "Medium"} onClick={(val) => handleTagClick("sizeRating", val)} />
            <Tag text="Large" color="green" isSelected={responses.sizeRating === "Large"} onClick={(val) => handleTagClick("sizeRating", val)} />
          </QuestionGroup>
          <QuestionGroup label={questionLabelMap.entranceAccessibleParking} field="entranceAccessibleParking" required>
            <Tag text="Yes" color="green" isSelected={responses.entranceAccessibleParking === "Yes"} onClick={(val) => handleTagClick("entranceAccessibleParking", val)} />
            <Tag text="No" color="red" isSelected={responses.entranceAccessibleParking === "No"} onClick={(val) => handleTagClick("entranceAccessibleParking", val)} />
          </QuestionGroup>
          <QuestionGroup label={questionLabelMap.closeToEntrance} field="closeToEntrance" required>
            <Tag text="Yes" color="green" isSelected={responses.closeToEntrance === "Yes"} onClick={(val) => handleTagClick("closeToEntrance", val)} />
            <Tag text="No" color="red" isSelected={responses.closeToEntrance === "No"} onClick={(val) => handleTagClick("closeToEntrance", val)} />
          </QuestionGroup>
        </div>

        <PrimaryButton text="Submit" onClick={handleSubmit} />
      </div>
    </div>
  );
};


const QuestionGroup = ({ label, children, required }) => (
  <div className="write-review-form-group">
    <p>
      {label}
      {required && <span className="required-asterisk"> *</span>}
    </p>
    <div className='tag-container'>
      <div className='tag-subcontainer'>
        {children}
      </div>
    </div>
    <div className="line"></div>
  </div>
);


export default ParkingReviewPage;
