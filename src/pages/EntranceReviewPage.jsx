import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";
import { questionLabelMap } from "../config/questionLabels";

const EntranceReviewPage = () => {
    const { id } = useParams();

    const [responses, setResponses] = useState({
        doorWidthOK: "",
        stepsOrThresholds: "",
        rampAvailable: "",
        doorType: "",
    });

    const navigate = useNavigate();

    const handleTagClick = (field, value) => {
        setResponses(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const requiredFields = [
            "doorWidthOK",
            "stepsOrThresholds",
            "rampAvailable",
            "doorType",
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
                    entrance: responses,
                    points: 1,
                    sectionsCompleted: "entrance"
                })
            });

            if (!res.ok) throw new Error("Failed to update review");

            navigate(`/review/internal/${id}`);
        } catch (err) {
            console.error(err);
            alert("Could not save detailed review.");
        }
    };

    return (
        <div className="write-review-container">
            <div className='container-small'>
                <h1>Entrance</h1>

                <div className="write-review-form-group">
                    <QuestionGroup label={questionLabelMap.doorWidthOK} field="doorWidthOK" required>
                        <Tag text="Yes" color="green" isSelected={responses.doorWidthOK === "Yes"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                        <Tag text="No" color="red" isSelected={responses.doorWidthOK === "No"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.stepsOrThresholds} field="stepsOrThresholds" required>
                        <Tag text="Steps present" color="green" isSelected={responses.stepsOrThresholds === "Steps present"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                        <Tag text="Small treshold (less than 2 cm)" color="orange" isSelected={responses.stepsOrThresholds === "Small treshold (less than 2 cm)"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                        <Tag text="No steps/tresholds" color="red" isSelected={responses.stepsOrThresholds === "No steps/tresholds"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.rampAvailable} field="rampAvailable" required>
                        <Tag text="Yes" color="green" isSelected={responses.rampAvailable === "Yes"} onClick={(val) => handleTagClick("rampAvailable", val)} />
                        <Tag text="No" color="red" isSelected={responses.rampAvailable === "No"} onClick={(val) => handleTagClick("rampAvailable", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.doorType} field="doorType" required>
                        <Tag text="Automatic door" color="green" isSelected={responses.doorType === "Automatic door"} onClick={(val) => handleTagClick("doorType", val)} />
                        <Tag text="Manual door but easy to open" color="orange" isSelected={responses.doorType === "Manual door but easy to open"} onClick={(val) => handleTagClick("doorType", val)} />
                        <Tag text="Manual door difficult to open" color="red" isSelected={responses.doorType === "Manual door difficult to open"} onClick={(val) => handleTagClick("doorType", val)} />
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

export default EntranceReviewPage;
