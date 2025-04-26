import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

const SanitaryReviewPage = () => {
    const { id } = useParams();

    const [responses, setResponses] = useState({
        accessibleRestroom: "",
        doorWidthOK: "",
        spaceToManeuver: "",
        grabBarsInstalled: "",
        sinkAccessible: "",
        showerAvailable: "",
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
                    sanitary: responses,
                    points: 1
                })
            });

            if (!res.ok) throw new Error("Failed to update review");

            navigate(`/review/staff/${id}`);
        } catch (err) {
            console.error(err);
            alert("Could not save detailed review.");
        }
    };

    return (
        <div className="write-review-container">
            <h1>Sanitary facilities</h1>

            <div className="write-review-form-group">
                <QuestionGroup label="Was there an accessible restroom available?" field="accessibleRestroom">
                    <Tag text="Yes" color="green" isSelected={responses.accessibleRestroom === "Yes"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                    <Tag text="No" color="red" isSelected={responses.accessibleRestroom === "No"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                    <Tag text="Not applicable" color="gray" isSelected={responses.accessibleRestroom === "Not applicable"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                </QuestionGroup>

                <QuestionGroup label="Was the doorway to the restroom wide enough (minimum 85 cm or 33.5 inches)?" field="doorWidthOK">
                    <Tag text="Yes" color="green" isSelected={responses.doorWidthOK === "Yes"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                    <Tag text="No" color="red" isSelected={responses.doorWidthOK === "No"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                </QuestionGroup>

                <QuestionGroup label="Was there enough space to maneuver a wheelchair inside the restroom?" field="spaceToManeuver">
                    <Tag text="Yes" color="green" isSelected={responses.spaceToManeuver === "Yes"} onClick={(val) => handleTagClick("spaceToManeuver", val)} />
                    <Tag text="No" color="red" isSelected={responses.spaceToManeuver === "No"} onClick={(val) => handleTagClick("spaceToManeuver", val)} />
                </QuestionGroup>

                <QuestionGroup label="Were grab bars installed near the toilet and sink?" field="grabBarsInstalled">
                    <Tag text="Yes" color="green" isSelected={responses.grabBarsInstalled === "Yes"} onClick={(val) => handleTagClick("grabBarsInstalled", val)} />
                    <Tag text="No" color="red" isSelected={responses.grabBarsInstalled === "No"} onClick={(val) => handleTagClick("grabBarsInstalled", val)} />
                </QuestionGroup>

                <QuestionGroup label="Was the sink accessible (e.g., appropriate height, space underneath)?" field="sinkAccessible">
                    <Tag text="Yes" color="green" isSelected={responses.sinkAccessible === "Yes"} onClick={(val) => handleTagClick("sinkAccessible", val)} />
                    <Tag text="No" color="red" isSelected={responses.sinkAccessible === "No"} onClick={(val) => handleTagClick("sinkAccessible", val)} />
                </QuestionGroup>

                <QuestionGroup label="Was there an accessible shower facility (if applicable)?" field="showerAvailable">
                    <Tag text="Yes" color="green" isSelected={responses.showerAvailable === "Yes"} onClick={(val) => handleTagClick("showerAvailable", val)} />
                    <Tag text="No" color="red" isSelected={responses.showerAvailable === "No"} onClick={(val) => handleTagClick("showerAvailable", val)} />
                    <Tag text="Not applicable" color="gray" isSelected={responses.showerAvailable === "Not applicable"} onClick={(val) => handleTagClick("showerAvailable", val)} />
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

export default SanitaryReviewPage;
