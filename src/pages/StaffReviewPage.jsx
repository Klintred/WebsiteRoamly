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
        const requiredFields = [
            "knowledgeable",
            "assistanceWillingness",
            "communicationEffective",
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
                    staff: responses,
                    points: 1,
                    sectionsCompleted: "staff"
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
            <div className="container-small">
                <h1>Staff support</h1>

                <div className="write-review-form-group">
                    <QuestionGroup label="Did the staff seem knowledgeable about accessibility needs?" field="knowledgeable" required>
                        <Tag text="Yes" color="green" isSelected={responses.knowledgeable === "Yes"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                        <Tag text="No" color="red" isSelected={responses.knowledgeable === "No"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                        <Tag text="Not applicable" color="gray" isSelected={responses.knowledgeable === "Not applicable"} onClick={(val) => handleTagClick("knowledgeable", val)} />
                    </QuestionGroup>

                    <QuestionGroup label="Were they willing to provide assistance when needed?" field="assistanceWillingness" required>
                        <Tag text="Yes" color="green" isSelected={responses.assistanceWillingness === "Yes"} onClick={(val) => handleTagClick("assistanceWillingness", val)} />
                        <Tag text="No" color="red" isSelected={responses.assistanceWillingness === "No"} onClick={(val) => handleTagClick("assistanceWillingness", val)} />
                    </QuestionGroup>

                    <QuestionGroup label="Did they communicate effectively with you regarding your needs?" field="communicationEffective" required>
                        <Tag text="Yes" color="green" isSelected={responses.communicationEffective === "Yes"} onClick={(val) => handleTagClick("communicationEffective", val)} />
                        <Tag text="No" color="red" isSelected={responses.communicationEffective === "No"} onClick={(val) => handleTagClick("communicationEffective", val)} />
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

export default StaffReviewPage;
