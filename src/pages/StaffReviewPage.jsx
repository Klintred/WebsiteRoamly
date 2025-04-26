import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

const StaffReviewPage = () => {
    const { id } = useParams();

    const [responses, setResponses] = useState({
        knowledgeable: "",
        assistanceWillingness: "",
        communicationEffective: "",
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
                    staff: responses,
                    points: 1
                })
            });

            if (!res.ok) throw new Error("Failed to update review");

            navigate("/thank-you");
        } catch (err) {
          console.error(err);
          alert("Could not save entrance review.");
        }
      };

    return (
        <div className="write-review-container">
            <h1>Staff support</h1>

            <div className="write-review-form-group">
                <QuestionGroup label="Did the staff seem knowledgeable about accessibility needs?" field="knowledgeable">
                    <Tag text="Yes" color="green" isSelected={responses.knowledgeable === "Yes"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                    <Tag text="No" color="red" isSelected={responses.knowledgeable === "No"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                    <Tag text="Not applicable" color="gray" isSelected={responses.knowledgeable === "Not applicable"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                </QuestionGroup>

                <QuestionGroup label="Were they willing to provide assistance when needed?" field="assistanceWillingness">
                    <Tag text="Yes" color="green" isSelected={responses.assistanceWillingness === "Yes"} onClick={(val) => handleTagClick("assistanceWillingness", val)} />
                    <Tag text="No" color="red" isSelected={responses.assistanceWillingness === "No"} onClick={(val) => handleTagClick("assistanceWillingness", val)} />
                </QuestionGroup>

                <QuestionGroup label="Did they communicate effectively with you regarding your needs?" field="communicationEffective">
                    <Tag text="Yes" color="green" isSelected={responses.communicationEffective === "Yes"} onClick={(val) => handleTagClick("communicationEffective", val)} />
                    <Tag text="No" color="red" isSelected={responses.communicationEffective === "No"} onClick={(val) => handleTagClick("communicationEffective", val)} />
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

export default StaffReviewPage;
