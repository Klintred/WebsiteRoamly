import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

const InternalReviewPage = () => {
    const { id } = useParams();

    const [responses, setResponses] = useState({
        pathWidthOK: "",
        elevatorOrRamp: "",
        elevatorAccessible: "",
        obstaclesLevel: "",
    });

    const navigate = useNavigate();

    const handleTagClick = (field, value) => {
        setResponses(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const requiredFields = [
            "pathWidthOK",
            "elevatorOrRamp",
            "elevatorAccessible",
            "obstaclesLevel",
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
                    internalNavigation: responses,
                    points: 1,
                    sectionsCompleted: "internalNavigation"
                })
            });

            if (!res.ok) throw new Error("Failed to update review");

            navigate(`/review/sanitary/${id}`);
        } catch (err) {
            console.error(err);
            alert("Could not save detailed review.");
        }
    };

    return (
        <div className="write-review-container">
            <div className='container-small'>
                <h1>Internal navigation</h1>

                <div className="write-review-form-group" required>
                    <QuestionGroup label="Were indoor pathways and corridors wide enough (min. 90 cm )?" field="pathWidthOK">
                        <Tag text="Yes" color="green" isSelected={responses.pathWidthOK === "Yes"} onClick={(val) => handleTagClick("pathWidthOK", val)} />
                        <Tag text="No" color="red" isSelected={responses.pathWidthOK === "No"} onClick={(val) => handleTagClick("pathWidthOK", val)} />
                    </QuestionGroup>

                    <QuestionGroup label="Were there elevators or ramps to navigate between floors?" field="elevatorOrRamp" required>
                        <Tag text="Elevators available" color="green" isSelected={responses.elevatorOrRamp === "Elevators available"} onClick={(val) => handleTagClick("elevatorOrRamp", val)} />
                        <Tag text="Ramps available" color="orange" isSelected={responses.elevatorOrRamp === "Ramps available"} onClick={(val) => handleTagClick("elevatorOrRamp", val)} />
                        <Tag text="Neither available" color="red" isSelected={responses.elevatorOrRamp === "Neither available"} onClick={(val) => handleTagClick("elevatorOrRamp", val)} />
                    </QuestionGroup>

                    <QuestionGroup label="If elevators, were they spacious and accessible?" field="elevatorAccessible" required>
                        <Tag text="Yes" color="green" isSelected={responses.elevatorAccessible === "Yes"} onClick={(val) => handleTagClick("elevatorAccessible", val)} />
                        <Tag text="No" color="red" isSelected={responses.elevatorAccessible === "No"} onClick={(val) => handleTagClick("elevatorAccessible", val)} />
                    </QuestionGroup>

                    <QuestionGroup label="Did you encounter any obstacles inside (e.g., narrow passages, furniture blocking the way)?" field="obstaclesLevel" required>
                        <Tag text="No obstacles" color="green" isSelected={responses.obstaclesLevel === "No obstacles"} onClick={(val) => handleTagClick("obstaclesLevel", val)} />
                        <Tag text="Minor obstacles" color="orange" isSelected={responses.obstaclesLevel === "Minor obstacles"} onClick={(val) => handleTagClick("obstaclesLevel", val)} />
                        <Tag text="Significant obstacles" color="red" isSelected={responses.obstaclesLevel === "Significant obstacles"} onClick={(val) => handleTagClick("obstaclesLevel", val)} />
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


export default InternalReviewPage;
