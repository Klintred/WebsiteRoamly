import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

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
            <h1>Entrance</h1>

            <div className="write-review-form-group">
                <QuestionGroup label="Was the entrance door wide enough for a weelchair? min. 85 cm?" field="doorWidthOK">
                    <Tag text="Yes" color="green" isSelected={responses.doorWidthOK === "Yes"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                    <Tag text="No" color="red" isSelected={responses.doorWidthOK === "No"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                </QuestionGroup>

                <QuestionGroup label="Were there any steps or tresholds at the entrance?" field="stepsOrThresholds">
                    <Tag text="No steps/tresholds" color="red" isSelected={responses.stepsOrThresholds === "No steps/tresholds"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                    <Tag text="Small treshold (less than 2 cm)" color="orange" isSelected={responses.stepsOrThresholds === "Small treshold (less than 2 cm)"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                    <Tag text="Steps present" color="green" isSelected={responses.stepsOrThresholds === "Steps present"} onClick={(val) => handleTagClick("stepsOrThresholds", val)} />
                </QuestionGroup>

                <QuestionGroup label="If steps, was a ramp available?" field="rampAvailable">
                    <Tag text="Yes" color="green" isSelected={responses.rampAvailable === "Yes"} onClick={(val) => handleTagClick("rampAvailable", val)} />
                    <Tag text="No" color="red" isSelected={responses.rampAvailable === "No"} onClick={(val) => handleTagClick("rampAvailable", val)} />
                </QuestionGroup>

                <QuestionGroup label="Was there an automatic or easy-to-open door?" field="doorType">
                    <Tag text="Automatic door" color="green" isSelected={responses.doorType === "Automatic door"} onClick={(val) => handleTagClick("doorType", val)} />
                    <Tag text="Manual door but easy to open" color="orange" isSelected={responses.doorType === "Manual door but easy to open"} onClick={(val) => handleTagClick("doorType", val)} />
                    <Tag text="Manual door difficult to open" color="red" isSelected={responses.doorType === "Manual door difficult to open"} onClick={(val) => handleTagClick("doorType", val)} />
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

export default EntranceReviewPage;
