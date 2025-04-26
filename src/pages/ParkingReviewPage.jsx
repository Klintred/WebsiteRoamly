import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

const ParkingReviewPage = () => {
  const { id } = useParams(); 
  
  const [responses, setResponses] = useState({
    designatedSpot: "",
    sizeRating: "",
    entranceAccessible: "",
    closeToEntrance: "",
  });

  const navigate = useNavigate();
  
  const handleTagClick = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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
      <h1>Internal navigation</h1>

      <div className="write-review-form-group">
        <QuestionGroup label="Was there a designated parking spot for people with disabilities?" field="designatedSpot">
          <Tag text="Yes" color="green" isSelected={responses.designatedSpot === "Yes"} onClick={(val) => handleTagClick("designatedSpot", val)} />
          <Tag text="No" color="red" isSelected={responses.designatedSpot === "No"} onClick={(val) => handleTagClick("designatedSpot", val)} />
        </QuestionGroup>

        <QuestionGroup label="How would you rate the size of the parking space?" field="sizeRating">
          <Tag text="Small" color="red" isSelected={responses.sizeRating === "Small"} onClick={(val) => handleTagClick("sizeRating", val)} />
          <Tag text="Medium" color="orange" isSelected={responses.sizeRating === "Medium"} onClick={(val) => handleTagClick("sizeRating", val)} />
          <Tag text="Large" color="green" isSelected={responses.sizeRating === "Large"} onClick={(val) => handleTagClick("sizeRating", val)} />
        </QuestionGroup>

        <QuestionGroup label="Was the entrance easily accessible?" field="entranceAccessible">
          <Tag text="Yes" color="green" isSelected={responses.entranceAccessible === "Yes"} onClick={(val) => handleTagClick("entranceAccessible", val)} />
          <Tag text="No" color="red" isSelected={responses.entranceAccessible === "No"} onClick={(val) => handleTagClick("entranceAccessible", val)} />
        </QuestionGroup>

        <QuestionGroup label="Was the parking area close to the entrance?" field="closeToEntrance">
          <Tag text="Yes" color="green" isSelected={responses.closeToEntrance === "Yes"} onClick={(val) => handleTagClick("closeToEntrance", val)} />
          <Tag text="No" color="red" isSelected={responses.closeToEntrance === "No"} onClick={(val) => handleTagClick("closeToEntrance", val)} />
        </QuestionGroup>

     


        </div>

      <PrimaryButton text="Submit" onClick={handleSubmit} />
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

export default ParkingReviewPage;
