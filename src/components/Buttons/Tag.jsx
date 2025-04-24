import React from "react";
import "./Buttons.css";

const Tag = ({ text, color = "gray", onClick, isSelected = false, className = "" }) => {
    const tagClass = `tag-btn tag-${color} ${isSelected ? "tag-selected" : ""} ${className}`.trim();

    return (
        <button className={tagClass} onClick={() => onClick(text)}>
            <span className="tag-indicator" />
            {text}
        </button>
    );
};

export default Tag;
