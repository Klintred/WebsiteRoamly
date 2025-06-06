import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/Buttons/Tag';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import "../styles/reviews.css";

const SanitaryReviewPage = () => {
    const { id } = useParams();

    const [responses, setResponses] = useState({
        accessibleRestroom: "",
        doorWidthOKRestroom: "",
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
        const requiredFields = [
            "accessibleRestroom",
            "doorWidthOKRestroom",
            "spaceToManeuver",
            "grabBarsInstalled",
            "sinkAccessible",
            "showerAvailable",
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
                    sanitary: responses,
                    points: 1,
                    sectionsCompleted: "sanitary"
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
            <div className='container-small'>

                <h1>Sanitary facilities</h1>

                <div className="write-review-form-group">
                    <QuestionGroup label={questionLabelMap.accessibleRestroom} field="accessibleRestroom" required>
                        <Tag text="Yes" color="green" isSelected={responses.accessibleRestroom === "Yes"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                        <Tag text="No" color="red" isSelected={responses.accessibleRestroom === "No"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                        <Tag text="Not applicable" color="gray" isSelected={responses.accessibleRestroom === "Not applicable"} onClick={(val) => handleTagClick("accessibleRestroom", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.doorWidthOKRestroom} field="doorWidthOKRestroom" required>
                        <Tag text="Yes" color="green" isSelected={responses.doorWidthOKRestroom === "Yes"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                        <Tag text="No" color="red" isSelected={responses.doorWidthOKRestroom === "No"} onClick={(val) => handleTagClick("doorWidthOK", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.spaceToManeuver} field="spaceToManeuver" required>
                        <Tag text="Yes" color="green" isSelected={responses.spaceToManeuver === "Yes"} onClick={(val) => handleTagClick("spaceToManeuver", val)} />
                        <Tag text="No" color="red" isSelected={responses.spaceToManeuver === "No"} onClick={(val) => handleTagClick("spaceToManeuver", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.grabBarsInstalled} field="grabBarsInstalled" required>
                        <Tag text="Yes" color="green" isSelected={responses.grabBarsInstalled === "Yes"} onClick={(val) => handleTagClick("grabBarsInstalled", val)} />
                        <Tag text="No" color="red" isSelected={responses.grabBarsInstalled === "No"} onClick={(val) => handleTagClick("grabBarsInstalled", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.sinkAccessible} field="sinkAccessible" required>
                        <Tag text="Yes" color="green" isSelected={responses.sinkAccessible === "Yes"} onClick={(val) => handleTagClick("sinkAccessible", val)} />
                        <Tag text="No" color="red" isSelected={responses.sinkAccessible === "No"} onClick={(val) => handleTagClick("sinkAccessible", val)} />
                    </QuestionGroup>
                    <QuestionGroup label={questionLabelMap.showerAvailable} field="showerAvailable" required>
                        <Tag text="Yes" color="green" isSelected={responses.showerAvailable === "Yes"} onClick={(val) => handleTagClick("showerAvailable", val)} />
                        <Tag text="No" color="red" isSelected={responses.showerAvailable === "No"} onClick={(val) => handleTagClick("showerAvailable", val)} />
                        <Tag text="Not applicable" color="gray" isSelected={responses.showerAvailable === "Not applicable"} onClick={(val) => handleTagClick("showerAvailable", val)} />
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

export default SanitaryReviewPage;
