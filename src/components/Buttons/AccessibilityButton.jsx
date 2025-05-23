import "./Buttons.css";

const AccessibilityButton = ({ feedbackSubject, accessibilityScore = "No score found", borderColor = "gray", className = "" }) => {
  const buttonClass = `btn accessibility-btn accessibility-${borderColor} ${className}`.trim();
  const regularClass = `btn link ${className}`.trim();
  const accessibilityText = `accessibility-text ${className}`.trim();
  const accessibilityContainer = `accessibility-container ${className}`.trim();

  return (
    <div className={buttonClass} >
      <div className={accessibilityContainer}>
        <span className="material-symbols-outlined">person</span>
        <div className={accessibilityText}>
          <p>{feedbackSubject}</p>
          <div>
            <span className="tag-indicator" />
            <p>{accessibilityScore}</p>
          </div>
        </div>
      </div>
      <button className={regularClass}>
        See details
      </button>
    </div>


  );
};

export default AccessibilityButton;
